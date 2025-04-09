'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductDetail, updateProduct } from '@/app/api/product';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import InformationForm from '@/components/edit-product/information';
import {ProductDetail } from '@/interface/product';
import DescriptionForm from '@/components/edit-product/description';
import MainImageForm from '@/components/edit-product/main-image';
import OtherImageForm from '@/components/edit-product/other-image'
import SkuTable from '@/components/edit-product/sku-table';
import PublishProduct from '@/components/edit-product/switch';
const EditProductPage = () => {
  const { id } = useParams(); // 'id' thực ra là mã code của sản phẩm
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
  const accessToken =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id && userId && accessToken) {
          const data = await getProductDetail(id as string, userId, accessToken);
          setProduct(data.product);
        }
      } catch (error) {
        toast.error('Không thể tải dữ liệu sản phẩm.');
      }
    };

    fetchProduct();
  }, [id, userId, accessToken]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (product) {
        await updateProduct(product, userId, accessToken);
        toast.success('Cập nhật sản phẩm thành công!');
      }
    } catch {
      toast.error('Cập nhật thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="grid grid-cols-6 gap-4">
      <MainImageForm
        mainImage={product.mainImage}
        setProduct={setProduct}
      />

      <OtherImageForm
        subImages={product.subImages}
        setProduct={setProduct}
      />

      <InformationForm
        product={product}
        setProduct={setProduct}
        userId={userId}
        accessToken={accessToken}
      />

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

      <PublishProduct
        id={id}
        status={product.status}
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="col-span-6 flex place-self-end"
      >
        UPDATE PRODUCT
      </Button>
    </div>
  );
};

export default EditProductPage;
