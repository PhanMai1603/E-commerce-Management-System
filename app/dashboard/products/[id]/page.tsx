"use client";
import { getProductDetail } from "@/app/api/product";
import ProductDescription from "@/components/detail-product/description";
import ProductImage from "@/components/detail-product/image";
import ProductInformation from "@/components/detail-product/information";
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
          if (data) {
            setProduct({
              ...data,
              product: {
                ...data.product,
                mainImage: data.product.mainImage || "/images/product.png", // fallback nếu không có ảnh
              },
            });
          } else {
            console.error("Product not found or invalid data format.");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id, userId, accessToken]);

  return (
    <div className="grid grid-cols-10 gap-4 mt-20">
      <ProductImage mainImage={product.product.mainImage} 
       subImages={product.product.subImages}
      />

      <ProductInformation 
        product={product.product} 
      />
      <ProductDescription 
      product={product.product}
      />
    </div>
  );
}
