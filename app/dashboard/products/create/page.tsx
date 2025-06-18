'use client'

import MainImageForm from '@/components/product/main-image'
import OtherImageForm from '@/components/product/other-image'
import InformationForm from '@/components/product/information'
import DescriptionForm from '@/components/product/description'
import { ProductData } from '@/interface/product'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { uploadProductImage } from '@/app/api/upload'
import { createProduct } from '@/app/api/product'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Label } from '@/components/ui/label'
import SkuTable from '@/components/product/sku-table'

export default function Page() {
  const [product, setProduct] = useState<ProductData>({
    name: '',
    mainImage: '',
    subImages: [],
    video: '',
    originalPrice: 0,
    description: '',
    category: [],
    attributes: [],
    returnDays: -1,
  });
  const [mainImage, setMainImage] = useState<File | undefined>();
  const [subImage, setSubImage] = useState<File[] | undefined>();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!mainImage) {
      setErrorMessage("*Ảnh chính là bắt buộc.");
      return;
    }

    if (!subImage || subImage.length === 0) {
      setErrorMessage("*Cần ít nhất một ảnh phụ.");
      return;
    }

    if (product.name === '') {
      setErrorMessage("*Tên sản phẩm là bắt buộc.");
      return;
    }

    if (product.category.length === 0) {
      setErrorMessage("*Vui lòng chọn ít nhất một danh mục.");
      return;
    }

    if (product.originalPrice === 0) {
      setErrorMessage("*Giá gốc phải lớn hơn 0.");
      return;
    }

    if (product.returnDays === -1) {
      setErrorMessage("*Vui lòng nhập số ngày cho phép đổi trả.");
      return;
    }

      if (product.attributes.length === 0) {
      setErrorMessage("*Cần ít nhất một thuộc tính.");
      return;
    }

    if (product.description === '') {
      setErrorMessage("*Vui lòng nhập mô tả sản phẩm.");
      return;
    }

    const colorVariant = product.variants?.find(variant => variant.name === "Color");
    if (colorVariant && colorVariant.options.some(option => option.trim() === "")) {
      setErrorMessage("*Thuộc tính màu sắc có giá trị rỗng.");
      return;
    }

    try {
      if (userId && accessToken) {
        setLoading(true);

        const mainImageResponse = await uploadProductImage(mainImage, userId, accessToken);

        const uploadedImages = await Promise.all(
          subImage.map(async (file) => {
            const response = await uploadProductImage(file, userId, accessToken);
            return response;
          })
        );

        const updatedProduct = {
          ...product,
          mainImage: mainImageResponse,
          subImages: uploadedImages,
        };

        await createProduct(updatedProduct, userId, accessToken);
        toast.success("Tạo sản phẩm thành công!");

        router.push("/dashboard/products");
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error("Đã xảy ra lỗi khi tạo sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  }

  if (!accessToken || !userId) return <p>Đang tải...</p>;

  return (
    <div className='grid grid-cols-6 gap-4'>
      {/* Thêm ảnh và video sản phẩm */}
      <MainImageForm setMainImage={setMainImage} />
      <OtherImageForm setSubImage={setSubImage} />

      {/* Thêm thông tin sản phẩm */}
      <InformationForm
        userId={userId}
        accessToken={accessToken}
        product={product}
        setProduct={setProduct}
      />

      {/* Thêm mô tả sản phẩm */}
      <DescriptionForm
        description={product.description}
        setProduct={setProduct}
      />

      {product.variants && (
        <SkuTable
          userId={userId}
          accessToken={accessToken}
          variants={product.variants}
          setProduct={setProduct}
        />
      )}

      {errorMessage && (
        <Label className='col-span-6 flex place-self-end text-red-600'>{errorMessage}</Label>
      )}

      <div className="col-span-6 flex place-self-end gap-x-4">
        <Button
          onClick={handleGoBack}
          className='bg-gray-200 text-gray-900 hover:bg-gray-300'
        >
          HỦY BỎ
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "ĐANG TẠO..." : "TẠO SẢN PHẨM"}
        </Button>
      </div>
    </div>
  )
}
