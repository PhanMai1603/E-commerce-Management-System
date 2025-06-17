import { ImportProduct, ProductDetailResponse, ProductUpdate, UpdateSkuList, Variant } from "@/interface/product";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { uploadProductImage } from "@/app/api/upload";
import Publish from "./switch";

interface SkuTableProps {
  userId: string;
  accessToken: string;
  product: ProductDetailResponse;
  updatedProduct: ProductUpdate;
  setUpdatedProduct: React.Dispatch<React.SetStateAction<ProductUpdate>>;
  setImportQuantity: React.Dispatch<React.SetStateAction<ImportProduct>>;
}

const generateCombinations = (variants: Variant[] | undefined) => {
  if (!variants || variants.length === 0) return [];

  return variants.reduce<{ name: string; value: string; index: number }[][]>(
    (acc, variant) => {
      if (acc.length === 0) {
        return variant.options.map((option, index) => [{ name: variant.name, value: option, index }]);
      }

      const newCombinations: { name: string; value: string; index: number }[][] = [];
      acc.forEach((combination) => {
        variant.options.forEach((option, index) => {
          newCombinations.push([...combination, { name: variant.name, value: option, index }]);
        });
      });

      return newCombinations;
    },
    []
  );
};

const SkuTable: React.FC<SkuTableProps> = ({ userId, accessToken, product, updatedProduct, setUpdatedProduct, setImportQuantity }) => {
  type InternalSku = {
    tierIndex: number[];
    price: number;
    isOld: boolean; // Key này để biết cũ hay mới
  };

  const [skuList, setSkuList] = useState<InternalSku[]>([]);
  const [newSkuList, setNewSkuList] = useState<UpdateSkuList[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean[]>([]);

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const sourceSkuListRef = useRef(
    updatedProduct.skuList ?? product.skuList.skuList.map(({ tierIndex, price, quantity, slug }) => ({
      tierIndex,
      price,
      quantity,
      slug,
    }))
  );

  const sortSkuList = (list: UpdateSkuList[]) =>
    [...list].sort((a, b) => a.slug.localeCompare(b.slug));

  const shouldUpdate = useMemo(() => {
    const sortedNew = sortSkuList(newSkuList);
    const sortedSource = sortSkuList(sourceSkuListRef.current);

    const omitQuantity = (arr: UpdateSkuList[]) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      arr.map(({ quantity, ...rest }) => rest);

    return JSON.stringify(omitQuantity(sortedNew)) !== JSON.stringify(omitQuantity(sortedSource));
  }, [newSkuList, sourceSkuListRef]);

  const sourceVariants = updatedProduct.variants ?? product.product.variants;

  const generatedCombinations = generateCombinations(sourceVariants);

  const hasColor = (!updatedProduct.variants && product.product.variants?.some(variant => variant.name === "Màu sắc"))
    || updatedProduct.variants?.some(variant => variant.name === "Màu sắc");

  useEffect(() => {
    setSkuList((prevSkuList) => {
      const newSkuList = generatedCombinations.map((combination) => {
        const matchedOldSku = sourceSkuListRef.current.find((sku) =>
          JSON.stringify(sku.tierIndex) === JSON.stringify(combination.map((item) => item.index))
        );

        if (matchedOldSku) {
          return {
            tierIndex: matchedOldSku.tierIndex,
            price: matchedOldSku.price,
            isOld: true,
          };
        } else {
          return {
            tierIndex: combination.map(item => item.index),
            price: 0,
            isOld: false,
          };
        }
      });

      return JSON.stringify(prevSkuList) !== JSON.stringify(newSkuList) ? newSkuList : prevSkuList;
    });
  }, [product, updatedProduct, generatedCombinations]);

  // Chuyển đổi skuList qua newSkuList để setUpdatedProduct
  useEffect(() => {
    const variants = updatedProduct.variants ?? product.product.variants;
    if (Array.isArray(variants)) {
      const transformed = skuList.map((sku) => {
        const slug = sku.tierIndex
          .map((index, i) => variants[i]?.options[index])
          .join("/");

        return {
          tierIndex: sku.tierIndex,
          price: sku.price,
          quantity: 0,
          slug,
        };
      });

      setNewSkuList(transformed);
    }
  }, [updatedProduct.variants, product.product.variants, skuList]);

  useEffect(() => {
    setUpdatedProduct((prev) => {
      if (shouldUpdate && newSkuList.length > 0) {
        return {
          ...prev,
          skuList: newSkuList,
        }
      } else {
        const updated = { ...prev };
        delete updated["skuList"];
        return updated;
      }
    });
  }, [updatedProduct.variants, shouldUpdate, newSkuList, setUpdatedProduct]);

  // Set images của variants vào skuList
  useEffect(() => {
    if (!updatedProduct.variants && product.product.variants) {
      const colorVariant = product.product.variants.find(v => v.name === "Màu sắc");
      if (colorVariant && colorVariant.images?.length) {
        const mappedImages: { [key: string]: string } = {};
        colorVariant.options.forEach((color, index) => {
          if (colorVariant.images && colorVariant.images[index]) {
            mappedImages[color] = colorVariant.images[index];
          }
        });
        setImages(mappedImages);
      }
    }
  }, [product, updatedProduct.variants, setImages]);

  useEffect(() => {
    setUpdatedProduct(prev => {
      if (!prev.variants) return prev;

      const updatedVariants = prev.variants.map(variant =>
        variant.name === "Màu sắc"
          ? { ...variant, images: Object.values(images) }
          : variant
      );

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  }, [images, setUpdatedProduct]);

  useEffect(() => {
    setLoading(new Array(generatedCombinations.length).fill(false));
  }, [generatedCombinations.length, updatedProduct.variants]);

  const handleClick = (rowIndex: number) => {
    if (fileInputRefs.current[rowIndex]) {
      fileInputRefs.current[rowIndex]?.click();
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(prev => {
        const newLoading = [...prev];
        generatedCombinations.forEach((combination, index) => {
          if (combination.some(item => item.name === "Màu sắc" && item.value === color)) {
            newLoading[index] = true;
          }
        });
        return newLoading;
      });

      // Gọi API uploadImage
      const imageUrl = await uploadProductImage(file, userId, accessToken);
      setImages((prev) => ({
        ...prev,
        [color]: imageUrl
      }));
    } catch (error) {
      console.error("Lỗi khi tải URL hình ảnh:", error);
    } finally {
      setLoading(prev => {
        const newLoading = [...prev];
        generatedCombinations.forEach((combination, index) => {
          if (combination.some(item => item.name === "Màu sắc" && item.value === color)) {
            newLoading[index] = false;
          }
        });
        return newLoading;
      });
    }
  };

  const handleDelete = (color: string) => {
    setImages(prev => {
      const newImages = { ...prev };
      delete newImages[color];
      return newImages;
    });

    setLoading(prev => {
      const newLoading = [...prev];
      generatedCombinations.forEach((combination, index) => {
        if (combination.some(item => item.name === "Màu sắc" && item.value === color)) {
          newLoading[index] = false;
        }
      });
      return newLoading;
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  // const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   setIsDragOver(false);
  //   const file = event.dataTransfer.files;

  //   const previewUrl = URL.createObjectURL(file[0]);
  // };

  const handleInputChange = (index: number, field: "price" | "quantity", value: string) => {
    setNewSkuList((prev) => {
      const updatedSkuList = prev.map((sku, i) => {
        if (i === index) {
          let newValue = Number(value);

          // Nếu là số âm, đặt giá trị thành "0"
          if (newValue < 0) newValue = 0;

          return { ...sku, [field]: value === "" ? "" : newValue };
        }
        return sku;
      });

      return updatedSkuList;
    });

    if (field === "quantity" && Number(value) > 0) {
      const matchSku = product.skuList.skuList.find(item => item.slug === newSkuList[index]?.slug);

      if (matchSku) {
        setImportQuantity(prev => {
          const existingList = prev.skuList || [];

          const updatedList = existingList.some(item => item.id === matchSku.id)
            ? existingList.map(item =>
              item.id === matchSku.id
                ? { ...item, quantity: Number(value) }
                : item
            )
            : [...existingList, { id: matchSku.id, quantity: Number(value) }];

          return {
            ...prev,
            skuList: updatedList,
          };
        });
      }
    }
  };

  return (
    <div className="col-span-full">
      <Table>
        <TableHeader>
          <TableRow>
            {hasColor && (
              <TableHead>Hình ảnh</TableHead>
            )}
            {(updatedProduct.variants ?? product.product.variants)?.map((variant, index) => (
              <TableHead key={index}>{variant.name}</TableHead>
            ))}
            <TableHead>Giá</TableHead>
            <TableHead>Số lượng nhập khẩu</TableHead>
            <TableHead>Public</TableHead>
            {/* <TableHead>Default</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {generatedCombinations.map((combination, rowIndex) => {
            const colorItem = combination.find(item => item.name === "Màu sắc");
            const color = colorItem ? colorItem.value : "";
            return (
              <TableRow key={rowIndex}>
                {hasColor && (
                  <TableCell className="border p-2 w-32">
                    {color ? (
                      images[color] ? (
                        <div className='relative group'>
                          <Image
                            src={images[color]}
                            alt="Product Image"
                            width={1000}
                            height={1000}
                            className='w-full h-44 object-contain rounded-md'
                          />
                          {!product.skuList.skuList.find(item => item.slug === newSkuList[rowIndex]?.slug) && (
                            <Button
                              onClick={() => handleDelete(color)}
                              className='absolute h-auto -top-2 -right-2 p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-3'
                            >
                              <X />
                            </Button>
                          )}
                        </div>
                      ) : (
                        loading[rowIndex] ? (
                          <div className='relative w-full h-44 flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 [&_svg]:size-6 group overflow-hidden'>
                            <LoaderCircle className="animate-spin" />
                          </div>
                        ) : (
                          !skuList[rowIndex]?.isOld && (
                            <div>
                              <div
                                className='relative w-full h-44 flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 [&_svg]:size-6 group overflow-hidden'
                                onClick={() => handleClick(rowIndex)}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                              // onDrop={handleDrop}
                              >
                                <div className={`absolute bottom-0 left-0 w-full bg-gray-600/10 transition-all duration-300 group-hover:h-full ${isDragOver ? 'h-full' : 'h-0'}`} />
                                <ImagePlus className='text-gray-400 group-hover:text-gray-500' />
                              </div>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleChange(event, color)}
                                ref={(el) => {
                                  if (el) fileInputRefs.current[rowIndex] = el;
                                }}
                                className="hidden"
                              />
                            </div>
                          )
                        )
                      )
                    ) : (
                      <span>No Color</span>
                    )}
                  </TableCell>
                )}
                {combination.map((item, colIndex) => (
                  <TableCell key={colIndex}>{item.value}</TableCell>
                ))}
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter price"
                    value={newSkuList[rowIndex]?.price ?? 0}
                    onChange={(e) => handleInputChange(rowIndex, "price", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    disabled={!product.skuList.skuList.find(item => item.slug === newSkuList[rowIndex]?.slug)}
                    placeholder="Enter quantity"
                    value={newSkuList[rowIndex]?.quantity ?? 0}
                    onChange={(e) => handleInputChange(rowIndex, "quantity", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Publish
                    id={product.skuList.skuList.find(item => item.slug === newSkuList[rowIndex]?.slug)?.id}
                    status={product.skuList.skuList.find(item => item.slug === newSkuList[rowIndex]?.slug)?.status}
                    item="variant"
                  />
                </TableCell>
                {/* <TableCell>
                  <Input
                    type="radio"
                    name="defaultSku"
                    disabled={true}
                    checked={skuList[rowIndex]?.isDefault ?? false}
                    className="h-5"
                  />
                </TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default SkuTable;