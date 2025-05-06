import { Tag, Star, ShoppingCart, Heart, Share2, Award, Package, Truck } from 'lucide-react';
import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ProductDetail } from '@/interface/product';

interface ProductInformationProps {
  product: ProductDetail;
}

export default function ProductInformation({ product }: ProductInformationProps) {
  // Calculate if there's a discount
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Function to render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} className="text-amber-400 fill-amber-400" />);
    }
    
    // Add half star if needed
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
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300 fill-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card className="col-start-6 col-span-4 flex flex-col p-6 shadow-md">
      {/* Product code */}
      <div className="flex items-center mb-1">
        <Badge variant="outline" className="text-xs font-normal">
          <Tag size={12} className="mr-1" />
          Mã: {product.code}
        </Badge>
        
        {product.status === 'in_stock' && (
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
            Còn hàng
          </Badge>
        )}
        
        {product.status === 'out_of_stock' && (
          <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800 hover:bg-red-200">
            Hết hàng
          </Badge>
        )}
      </div>

      {/* Product name */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex mr-2">
          {renderStars(product.rating)}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating.toFixed(1)} ({product.ratingCount}  Reviews)
        </span>
        {product.sold && (
          <>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm text-gray-600">{product.sold} Sold</span>
          </>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-center">
          <span className="text-3xl font-bold text-primary">
            {product.price?.toLocaleString()}đ
          </span>
          
          {hasDiscount && (
            <>
              <span className="ml-3 text-lg text-gray-500 line-through">
                {product.originalPrice?.toLocaleString()}đ
              </span>
              <Badge className="ml-3 bg-red-100 text-red-800 hover:bg-red-200">
                -{discountPercentage}%
              </Badge>
            </>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Description */}
      {product.description && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Mô tả:</h3>
          <p className="text-sm text-gray-600">
            {product.description}
          </p>
        </div>
      )}

      {/* Delivery */}
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <Truck size={16} className="text-primary mr-2" />
        <span>Giao hàng miễn phí từ 500.000đ</span>
      </div>
      
      {/* Quality guarantee */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Award size={16} className="text-primary mr-2" />
        <span>Bảo đảm chất lượng</span>
      </div>

      <Separator className="my-4" />

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
          <ShoppingCart size={16} className="mr-2" />
          Thêm vào giỏ hàng
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Heart size={16} className="mr-2" />
            Yêu thích
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 size={16} className="mr-2" />
            Chia sẻ
          </Button>
        </div>
      </div>
    </Card>
  );
}