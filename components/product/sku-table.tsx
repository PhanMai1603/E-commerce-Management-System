import { ProductData, ProductSKU, Variant } from "@/interface/product";
import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { uploadProductImage } from "@/app/api/upload";

interface SkuTableProps {
  userId: string,
  accessToken: string,
  variants: Variant[] | undefined;
  setProduct: React.Dispatch<React.SetStateAction<ProductData>>;
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

const SkuTable: React.FC<SkuTableProps> = ({ userId, accessToken, variants, setProduct }) => {
  const [skuList, setSkuList] = useState<ProductSKU[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean[]>([]);

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const combinations = generateCombinations(variants);

  useEffect(() => {
    if (!variants) return;
  
    const colorVariant = variants.find(v => v.name === "Màu sắc");
    if (!colorVariant) return;
  
    const validColors = new Set(colorVariant.options);
    const filteredImages: { [key: string]: string } = {};
  
    Object.entries(images).forEach(([color, url]) => {
      if (validColors.has(color)) {
        filteredImages[color] = url;
      }
    });
  
    // Chỉ setImages nếu có khác biệt thật sự
    if (JSON.stringify(filteredImages) !== JSON.stringify(images)) {
      setImages(filteredImages);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);  

  useEffect(() => {
    if (combinations.length > 0) {
      setSkuList(prevSkuList => {
        const newSkuList = combinations.map((combination, index) => {
          const existingSku = prevSkuList.find(sku =>
            JSON.stringify(sku.tierIndex) === JSON.stringify(combination.map(item => item.index))
          );

          return existingSku || {
            tierIndex: combination.map(item => item.index),
            isDefault: index === 0,
            price: 0,
            quantity: 0
          };
        });

        return JSON.stringify(prevSkuList) !== JSON.stringify(newSkuList) ? newSkuList : prevSkuList;
      });
    }
  }, [combinations]);

  useEffect(() => {
    setProduct(prev => {
      const updatedVariants = prev.variants?.map(variant =>
        variant.name === "Màu sắc"
          ? { ...variant, images: Object.values(images) }
          : variant
      );

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  }, [images, setProduct]);

  useEffect(() => {
    setProduct(prev => ({
      ...prev,
      skuList,
    }));
  }, [skuList, setProduct]);

  useEffect(() => {
    setLoading(new Array(combinations.length).fill(false));
  }, [combinations.length, variants]);

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
        combinations.forEach((combination, index) => {
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
      console.error("Error fetching image URL:", error);
    } finally {
      setLoading(prev => {
        const newLoading = [...prev];
        combinations.forEach((combination, index) => {
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
      newImages[color] = '';
      return newImages;
    });

    setLoading(prev => {
      const newLoading = [...prev];
      combinations.forEach((combination, index) => {
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
    setSkuList((prev) => {
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
  };

  const handleDefaultChange = (index: number) => {
    setSkuList(prev => prev.map((sku, i) => ({
      ...sku,
      isDefault: i === index,
    })));
  };

  return (
    <div className="col-span-full">
      <Table>
        <TableHeader>
          <TableRow>
            {variants?.some(variant => variant.name === "Màu sắc") && (
              <TableHead>Image</TableHead>
            )}
            {variants?.map((variant, index) => (
              <TableHead key={index}>{variant.name}</TableHead>
            ))}
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {combinations.map((combination, rowIndex) => {
            const colorItem = combination.find(item => item.name === "Màu sắc");
            const color = colorItem ? colorItem.value : "";
            return (
              <TableRow key={rowIndex}>
                {variants?.some(variant => variant.name === "Màu sắc") && (
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
                          <Button
                            onClick={() => handleDelete(color)}
                            className='absolute h-auto -top-2 -right-2 p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-3'
                          >
                            <X />
                          </Button>
                        </div>
                      ) : (
                        loading[rowIndex] ? (
                          <div className='relative w-full h-44 flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 [&_svg]:size-6 group overflow-hidden'>
                            <LoaderCircle className="animate-spin" />
                          </div>
                        ) : (
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
                    value={skuList[rowIndex]?.price ?? 0}
                    onChange={(e) => handleInputChange(rowIndex, "price", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter quantity"
                    value={skuList[rowIndex]?.quantity ?? 0}
                    onChange={(e) => handleInputChange(rowIndex, "quantity", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="radio"
                    name="defaultSku"
                    checked={skuList[rowIndex]?.isDefault ?? false}
                    onChange={() => handleDefaultChange(rowIndex)}
                    className="h-5"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default SkuTable;