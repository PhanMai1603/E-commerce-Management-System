"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { getProductDetail } from "@/app/api/product";
import { ProductDetail, SkuList } from "@/interface/product";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react";
import Link from "next/link";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [skuList, setSkuList] = useState<SkuList[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<(string | { value: string; descriptionUrl: string })[]>([]);
  const [selectedSku, setSelectedSku] = useState<SkuList | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getProductDetail(id as string, userId, accessToken);
        setProduct(res.product);
        setSkuList(res.skuList.skuList);
        setMainImage(res.product.mainImage);
        setLoading(false);
      } catch (err) {
        toast.error("Lỗi khi lấy chi tiết sản phẩm");
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    // Find default SKU if exists
    if (skuList.length > 0) {
      const defaultSku = skuList.find(sku => sku.isDefault);
      if (defaultSku) {
        setSelectedSku(defaultSku);
      } else {
        setSelectedSku(skuList[0]);
      }
    }
  }, [skuList]);

  const handleVariantSelect = (attributeIndex: number, value: string | { value: string; descriptionUrl: string }) => {
    const newSelectedVariants = [...selectedVariant];
    newSelectedVariants[attributeIndex] = value;
    setSelectedVariant(newSelectedVariants);
    
    // Here you would normally match the variant selection to a SKU
    // This is a simplified version - in a real app you'd map tierIndex to variants
    if (product?.variants) {
      // Update selected SKU based on variant selection
      // This is placeholder logic - would need to be updated based on your actual data structure
    }
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (selectedSku?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleImageChange = (image: string) => {
    setMainImage(image);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const calculateDiscountedPrice = () => {
    if (!product) return 0;
    
    if (product.hasDiscount && product.discountedPrice) {
      return product.discountedPrice;
    }
    
    if (product.hasDiscount && product.discountType === "PERCENT") {
      return product.price - (product.price * (product.discountValue / 100));
    }
    
    if (product.hasDiscount && product.discountType === "AMOUNT") {
      return product.price - product.discountValue;
    }
    
    return product.price;
  };

  const getDiscountLabel = () => {
    if (!product?.hasDiscount) return null;
    
    if (product.discountType === "PERCENT") {
      return `-${product.discountValue}%`;
    } else {
      return `-${formatPrice(product.discountValue)}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#2F8F8A]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-medium mb-4">Không tìm thấy sản phẩm</p>
        <Link href="/products" className="text-[#2F8F8A] hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-white py-3 shadow-sm mb-6">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm">
            <Link href="/dashboard" className="text-gray-500 hover:text-[#2F8F8A]">Trang chủ</Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <Link href="/dashboard/products" className="text-gray-500 hover:text-[#2F8F8A]">Sản phẩm</Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="text-[#2F8F8A] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Product Images */}
            <div className="w-full md:w-2/5 p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                {product.hasDiscount && (
                  <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    {getDiscountLabel()}
                  </div>
                )}
                <Image 
                  src={mainImage || "/placeholder.png"} 
                  alt={product.name}
                  className="object-cover" 
                  fill
                  priority
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-5 gap-2">
                <div 
                  onClick={() => handleImageChange(product.mainImage)}
                  className={`aspect-square relative rounded cursor-pointer border-2 ${mainImage === product.mainImage ? 'border-[#2F8F8A]' : 'border-transparent'}`}
                >
                  <Image 
                    src={product.mainImage || "/placeholder.png"} 
                    alt="Thumbnail" 
                    className="object-cover rounded" 
                    fill
                  />
                </div>
                
                {product.subImages?.slice(0, 4).map((img, index) => (
                  <div 
                    key={index}
                    onClick={() => handleImageChange(img)}
                    className={`aspect-square relative rounded cursor-pointer border-2 ${mainImage === img ? 'border-[#2F8F8A]' : 'border-transparent'}`}
                  >
                    <Image 
                      src={img || "/placeholder.png"} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="object-cover rounded" 
                      fill
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-3/5 p-6 md:border-l border-gray-200">
              <div className="flex items-center mb-2">
                <span className="text-sm bg-[#2F8F8A]/10 text-[#2F8F8A] px-2 py-0.5 rounded">Mã: {product.code}</span>
                <div className="flex items-center ml-3">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm ml-1 text-gray-600">{product.rating} ({product.ratingCount} đánh giá)</span>
                </div>
                <span className="text-sm ml-3 text-gray-600">Đã bán: {product.sold}</span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="mb-6">
                {product.hasDiscount ? (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-[#2F8F8A]">
                      {formatPrice(calculateDiscountedPrice())}
                    </span>
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-[#2F8F8A]">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  {product.variantAttributes?.map((attr, attrIndex) => (
                    <div key={attr.id || attrIndex} className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">{attr.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {attr.values?.map((value, valIndex) => {
                          const valueText = typeof value === 'string' ? value : value.value;
                          const isSelected = selectedVariant[attrIndex] === value;
                          
                          return (
                            <button
                              key={valIndex}
                              onClick={() => handleVariantSelect(attrIndex, value)}
                              className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                isSelected
                                  ? 'border-[#2F8F8A] bg-[#2F8F8A]/10 text-[#2F8F8A]'
                                  : 'border-gray-300 text-gray-700 hover:border-[#2F8F8A]'
                              }`}
                            >
                              {valueText}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Số lượng</h3>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="flex items-center justify-center w-8 h-8 rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 h-8 text-center border-t border-b border-gray-300"
                  />
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (selectedSku?.quantity || product.quantity)}
                    className="flex items-center justify-center w-8 h-8 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                  <span className="ml-3 text-sm text-gray-500">
                    {selectedSku?.quantity || product.quantity} sản phẩm có sẵn
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button className="flex-1 bg-[#2F8F8A] hover:bg-[#267b76] text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-colors">
                  <ShoppingCart size={18} className="mr-2" />
                  Thêm vào giỏ hàng
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                  <Heart size={20} className="text-gray-600" />
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
              
              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start mb-3">
                  <Truck size={18} className="text-[#2F8F8A] mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Giao hàng miễn phí</h4>
                    <p className="text-sm text-gray-600">Giao hàng miễn phí cho đơn hàng từ 500.000đ</p>
                  </div>
                </div>
                <div className="flex items-start mb-3">
                  <RotateCcw size={18} className="text-[#2F8F8A] mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Đổi trả dễ dàng</h4>
                    <p className="text-sm text-gray-600">Đổi trả trong {product.returnDays} ngày</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ShieldCheck size={18} className="text-[#2F8F8A] mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Bảo hành chính hãng</h4>
                    <p className="text-sm text-gray-600">Sản phẩm chính hãng 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Description */}
        <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Mô tả sản phẩm</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
        
        {/* Product Specifications */}
        <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Thông số sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex border-b border-gray-200 py-3">
              <span className="w-1/3 text-gray-600">Mã sản phẩm</span>
              <span className="w-2/3 font-medium">{product.code}</span>
            </div>
            <div className="flex border-b border-gray-200 py-3">
              <span className="w-1/3 text-gray-600">Tên sản phẩm</span>
              <span className="w-2/3 font-medium">{product.name}</span>
            </div>
            <div className="flex border-b border-gray-200 py-3">
              <span className="w-1/3 text-gray-600">Giá gốc</span>
              <span className="w-2/3 font-medium">{formatPrice(product.originalPrice)}</span>
            </div>
            <div className="flex border-b border-gray-200 py-3">
              <span className="w-1/3 text-gray-600">Trạng thái</span>
              <span className="w-2/3 font-medium">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.status === "ACTIVE" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {product.status === "ACTIVE" ? "Còn hàng" : "Hết hàng"}
                </span>
              </span>
            </div>
            <div className="flex border-b border-gray-200 py-3">
              <span className="w-1/3 text-gray-600">Danh mục</span>
              <span className="w-2/3 font-medium">
                {product.category?.map(cat => cat.name).join(", ")}
              </span>
            </div>
            <div className="flex border-b border-gray-200 py-3">
              <span className="w-1/3 text-gray-600">Số ngày đổi trả</span>
              <span className="w-2/3 font-medium">{product.returnDays} ngày</span>
            </div>
            {product.hasDiscount && (
              <>
                <div className="flex border-b border-gray-200 py-3">
                  <span className="w-1/3 text-gray-600">Loại giảm giá</span>
                  <span className="w-2/3 font-medium">
                    {product.discountType === "PERCENT" ? "Phần trăm" : "Số tiền"}
                  </span>
                </div>
                <div className="flex border-b border-gray-200 py-3">
                  <span className="w-1/3 text-gray-600">Giá trị giảm</span>
                  <span className="w-2/3 font-medium">
                    {product.discountType === "PERCENT" 
                      ? `${product.discountValue}%` 
                      : formatPrice(product.discountValue)}
                  </span>
                </div>
                {product.discountStart && (
                  <div className="flex border-b border-gray-200 py-3">
                    <span className="w-1/3 text-gray-600">Bắt đầu giảm giá</span>
                    <span className="w-2/3 font-medium">
                      {new Date(product.discountStart).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
                {product.discountEnd && (
                  <div className="flex border-b border-gray-200 py-3">
                    <span className="w-1/3 text-gray-600">Kết thúc giảm giá</span>
                    <span className="w-2/3 font-medium">
                      {new Date(product.discountEnd).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;