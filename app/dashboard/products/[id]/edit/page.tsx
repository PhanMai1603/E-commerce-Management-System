'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductDetail, importProduct, updateProduct } from '@/app/api/product';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import InformationForm from '@/components/edit-product/information';
import { ImportProduct, ProductDetailResponse, ProductUpdate } from '@/interface/product';
import DescriptionForm from '@/components/edit-product/description';
import MainImageForm from '@/components/edit-product/main-image';
import OtherImageForm from '@/components/edit-product/other-image';
import SkuTable from '@/components/edit-product/sku-table';
import Publish from '@/components/edit-product/switch';
import { Label } from '@radix-ui/react-label';
// import { uploadProductImage } from '@/app/api/upload';

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailResponse>({
    product: {
      id: '',
      code: '',
      name: '',
      slug: '',
      description: '',
      video: '',
      mainImage: '',
      subImages: [],
      qrCode: '',
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
      status: '',
      rating: 0,
      ratingCount: 0,
      views: 0,
      uniqueViews: [],
      createdBy: '',
      updatedBy: '',
      returnDays: 0,
      variants: [],
      variantAttributes: [],
      price: 0,
      discountedPrice: null,
      hasDiscount: false,
    },
    skuList: {
      skuList: []
    },
  });
  const [updatedProduct, setUpdatedProduct] = useState<ProductUpdate>({
    productKey: "",
  });
  const [importQuantity, setImportQuantity] = useState<ImportProduct>({
    id: typeof (id) === "string" ? id : "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
  const accessToken =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '';

  const isAnySkuPublished = product.skuList.skuList.some(item => item.status !== 'PUBLISHED');

  useEffect(() => {
    console.log("updatedProduct:", updatedProduct);
  }, [updatedProduct])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id && userId && accessToken) {
          const data = await getProductDetail(id as string, userId, accessToken);
          setProduct(data);
          setUpdatedProduct(prev => {
            return {
              ...prev,
              productKey: data.product.code,
            };
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id, userId, accessToken]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // // Helper function để fetch file từ blob URL và upload
      // const uploadBlobIfNeeded = async (url: string): Promise<string> => {
      //   if (url.startsWith('blob:http://localhost:3031')) {
      //     const blob = await fetch(url).then(res => res.blob());
      //     const file = new File([blob], 'image.webp', { type: blob.type });
      //     const uploadedUrl = await uploadProductImage(file, userId, accessToken);
      //     return uploadedUrl;
      //   }
      //   return url;
      // };

      // // Xử lý mainImage nếu là blob
      // if (updatedProduct.mainImage?.startsWith('blob:http://localhost:3031')) {
      //   updatedProduct.mainImage = await uploadBlobIfNeeded(updatedProduct.mainImage);
      // }

      // // Xử lý subImages nếu có blob
      // if (Array.isArray(updatedProduct.subImages)) {
      //   const updatedImages = await Promise.all(
      //     updatedProduct.subImages.map((img) => uploadBlobIfNeeded(img))
      //   );
      //   updatedProduct.subImages = updatedImages;
      // } else {
      //   updatedProduct.subImages = [];
      // }

      // Call importProduct nếu cần
      if (
        (importQuantity.skuList && importQuantity.skuList.length > 0) ||
        (importQuantity.quantity && importQuantity.quantity > 0)
      ) {
        await importProduct(importQuantity, userId, accessToken);
        toast.success('Update quantity successful!');
      }

      // Call updateProduct nếu có data
      if (
        (updatedProduct.productKey && updatedProduct.productKey.trim() !== "") ||
        (Object.keys(updatedProduct).length > 1)
      ) {
        await updateProduct(updatedProduct, userId, accessToken);
        toast.success('Update product successful!');
      }

      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  }

  if (product.product.id === '') return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-6 gap-4">
      <MainImageForm
        mainImage={product.product.mainImage}
        updatedProduct={updatedProduct}
        setUpdatedProduct={setUpdatedProduct}
      />

      <OtherImageForm
        subImages={product.product.subImages}
        updatedProduct={updatedProduct}
        setUpdatedProduct={setUpdatedProduct}
      />

      <InformationForm
        product={product.product}
        updatedProduct={updatedProduct}
        setUpdatedProduct={setUpdatedProduct}
        userId={userId}
        accessToken={accessToken}
      />

      <DescriptionForm
        description={product.product.description}
        updatedProduct={updatedProduct}
        setUpdatedProduct={setUpdatedProduct}
      />

      {product.product.variants && (
        <>
          <SkuTable
            userId={userId}
            accessToken={accessToken}
            product={product}
            updatedProduct={updatedProduct}
            setUpdatedProduct={setUpdatedProduct}
            setImportQuantity={setImportQuantity}
          />

          <div className='space-x-4 col-span-6 flex justify-end items-center'>
            <Label>Publish All Variant</Label>
            <Publish
              id={id}
              status={!isAnySkuPublished ? 'PUBLISHED' : 'DRAFT'}
              item="all-variant"
            />
          </div>
        </>
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
          UPDATE PRODUCT
        </Button>
      </div>
    </div>
  );
};

export default EditProductPage;
