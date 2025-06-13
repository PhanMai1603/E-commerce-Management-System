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

    // Kiểm tra nếu thiếu mainImage hoặc subImage
    if (!mainImage) {
      setErrorMessage("*Main image is required.");
      return;
    }

    if (!subImage || subImage.length === 0) {
      setErrorMessage("*At least one sub-image is required.");
      return;
    }

    // if (product.video === '') {
    //   setErrorMessage("*Video URL is required.");
    //   return;
    // }

    if (product.name === '') {
      setErrorMessage("*Product name is required.");
      return;
    }

    if (product.category.length === 0) {
      setErrorMessage("*At least one category is required.");
      return;
    }

    if (product.originalPrice === 0) {
      setErrorMessage("*Original price must be greater than 0.");
      return;
    }

    if (product.returnDays === -1) {
      setErrorMessage("*Return days is required.");
      return;
    }

    if (product.attributes.length === 0) {
      setErrorMessage("*At least one attribute is required.");
      return;
    }

    if (product.description === '') {
      setErrorMessage("*Description is required.");
      return;
    }

    const colorVariant = product.variants?.find(variant => variant.name === "Color");
    if (colorVariant && colorVariant.options.some(option => option.trim() === "")) {
      setErrorMessage("*Color variant contains an empty option.");
      return;
    }

    try {
      if (userId && accessToken) {
        setLoading(true);

        // Upload main image
        const mainImageResponse = await uploadProductImage(mainImage, userId, accessToken);

        // Upload sub-images
        const uploadedImages = await Promise.all(
          subImage.map(async (file) => {
            const response = await uploadProductImage(file, userId, accessToken);
            return response;
          })
        );

        // Tạo object product mới thay vì dùng state cũ
        const updatedProduct = {
          ...product,
          mainImage: mainImageResponse,
          subImages: uploadedImages,
        };

        // Gửi sản phẩm lên API
        await createProduct(updatedProduct, userId, accessToken);
        toast.success("Create product successful!");
        
        router.push("/dashboard/products");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  }

  if (!accessToken || !userId) return <p>Loading...</p>;

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
          CANCEL
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
        >
          CREATE PRODUCT
        </Button>
      </div>
    </div>
  )
}