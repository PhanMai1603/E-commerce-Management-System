/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tag, Star } from "lucide-react";
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ProductDetail } from "@/interface/product";


interface ProductInformationProps {
  product: ProductDetail;
  selectedImage: string | null;
  setSelectedImage: (image: string) => void;
}

export default function ProductInformation({
  product,
  selectedImage,
  setSelectedImage,
}: ProductInformationProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          className="text-amber-400 fill-amber-400"
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={16} className="text-gray-300 fill-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={16} className="text-amber-400 fill-amber-400" />
          </div>
        </div>
      );
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={16}
          className="text-gray-300 fill-gray-300"
        />
      );
    }
    return stars;
  };

  return (
    <Card className="col-start-6 col-span-4 flex flex-col p-6 rounded-2xl">
      <div className="flex items-center mb-1">
        <Badge variant="outline" className="text-xs font-normal">
          <Tag size={12} className="mr-1" />
          MÃ: {product.code}
        </Badge>
        {product.status === "PUBLISHED" && (
          <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200 transition duration-300">
            Còn hàng
          </Badge>
        )}
        {product.status === "OUT_OF_STOCK" && (
          <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-200 transition duration-300">
            Hết hàng
          </Badge>
        )}
      </div>

      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        {product.name}
      </h1>

      <div className="flex items-center mb-4">
        <div className="flex mr-2">{renderStars(product.rating)}</div>
        <span className="text-sm text-gray-600">
          {product.rating.toFixed(1)} ({product.ratingCount} đánh giá)
        </span>

        {Number(product.sold) > 0 && (
          <>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm text-gray-600">{product.sold} đã bán</span>
          </>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          {product.minPrice === product.maxPrice ? (
            <span className="text-3xl font-bold text-primary">
              {product.minPrice.toLocaleString()}đ
            </span>
          ) : (
            <span className="text-3xl font-bold text-primary">
              {product.minPrice.toLocaleString()}đ - {product.maxPrice.toLocaleString()}đ
            </span>
          )}
        </div>
      </div>


      <Separator className="my-4" />

      {/* Biến thể sản phẩm */}
      <div className="mb-4">
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            {product.variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="mb-4">
                <div className="mb-2 font-semibold">
                  {variant.name === "Color" ? "Màu sắc" : variant.name}
                </div>
                <ul className="flex flex-wrap gap-2">
                  {variant.options.map((option, optionIndex) => {
                    const isColorVariant = variant.name.toLowerCase().includes("color");
                    const image = variant.images[optionIndex] || product.mainImage;
                    const isSelected = isColorVariant && selectedImage === image;

                    return (
                      <li
                        key={optionIndex}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition duration-200 text-center ${isSelected
                          ? "ring-2 ring-primary bg-gray-100 border-primary"
                          : isColorVariant
                            ? "border border-gray-300"
                            : "border border-gray-200"
                          } ${isColorVariant
                            ? "hover:bg-gray-50 hover:ring-2 hover:ring-primary"
                            : ""
                          }`}
                        onClick={() => {
                          if (isColorVariant) {
                            setSelectedColor(option);
                            setSelectedImage(image);
                          }
                        }}
                      >
                        {option}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      {product.code && product.qrCode && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">QR Code sản phẩm:</p>
          <img
            src={product.qrCode}
            alt={`QR ${product.code}`}
            className="w-28 h-28 object-contain border rounded-md"
          />
        </div>
      )}
    </Card>
  );
}
