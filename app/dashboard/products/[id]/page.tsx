"use client";
import { getProductDetail } from "@/app/api/product";
import ProductDescription from "@/components/detail-product/description";
import ProductImage from "@/components/detail-product/image";
import ProductInformation from "@/components/detail-product/information";
import ProductVariant from "@/components/detail-product/variant";
import { ProductDetailResponse } from "@/interface/product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailResponse>({
    product: {
      id: "",
      code: "",
      name: "",
      slug: "",
      description: "",
      video: "",
      mainImage: "",
      subImages: [],
      qrCode: "",
      originalPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      discountType: "PERCENT",
      discountValue: 0,
      discountStart: null,
      discountEnd: null,
      quantity: 0,
      sold: 0,
      category: [],
      attributes: [],
      status: "",
      rating: 0,
      ratingCount: 0,
      views: 0,
      uniqueViews: [],
      createdBy: "",
      updatedBy: "",
      returnDays: 0,
      variants: [],
      variantAttributes: [],
      price: 0,
      discountedPrice: null,
      hasDiscount: false,
    },
    skuList: {
      skuList: [],
    },
  });

  // State để quản lý hình ảnh đang được chọn
  const [selectedImage, setSelectedImage] = useState<string>("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id && userId && accessToken) {
          const data = await getProductDetail(
            id as string,
            userId,
            accessToken
          );
          setProduct(data);

          // Đặt hình ảnh chính khi tải trang
          const mainImage = data.product.mainImage || "/images/product.png";
          setSelectedImage(mainImage);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id, userId, accessToken]);

  return (
    <div className="grid grid-cols-10 gap-4 mt-4">
      <ProductImage
        mainImage={product.product.mainImage}
        subImages={product.product.subImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      <ProductInformation
        product={product.product}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      <ProductDescription product={product.product} />

      <ProductVariant
        skuList={product.skuList.skuList} 
        setProduct={setProduct}
      />
    </div>
  );
}
