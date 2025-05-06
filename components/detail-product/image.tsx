import React, { useState } from "react";
import { Card } from "../ui/card";

interface ProductImageProps {
  mainImage: string;
  subImages: string[];
}

export default function ProductImage({ mainImage, subImages }: ProductImageProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage || "/images/product.png");

  return (
    <Card className="col-start-2 col-span-4 p-4 overflow-hidden mb-0">
      {/* Ảnh chính - tràn sát viền */}
      <div className="w-full">
        <img
          src={selectedImage}
          alt="Main product"
          className="w-full h-[500px] object-cover"
        />
      </div>

      {/* Ảnh phụ (thumbnail) */}
      <div className="flex justify-start gap-3 flex-wrap p-4">
        {subImages && subImages.length > 0 ? (
          subImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Sub ${index}`}
              className={`h-20 w-20 object-cover rounded-lg border cursor-pointer transition hover:ring-2 hover:ring-primary ${
                selectedImage === img ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">Không có ảnh phụ</p>
        )}
      </div>
    </Card>
  );
}
