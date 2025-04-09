"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getProductDetail } from "@/app/api/product";
import { ProductDetail } from "@/interface/product";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProductDetail(id as string, userId, accessToken);
        setProduct(res.product); // ✅ Đã sửa đúng: product là object, không phải mảng
      } catch (err) {
        toast.error("Lỗi khi lấy chi tiết sản phẩm");
      }
    };

    if (id) fetchData();
  }, [id]);

  if (!product) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Chi tiết sản phẩm</h2>

      <p><strong>Mã sản phẩm:</strong> {product.code}</p>
      <p><strong>Tên sản phẩm:</strong> {product.name}</p>
      <p><strong>Số ngày hoàn trả:</strong> {product.returnDays}</p>
      <p><strong>Loại giảm giá:</strong> {product.discountType === "PERCENT" ? "Phần trăm" : "Số tiền"}</p>
      <p><strong>Giá trị giảm:</strong> {product.discountValue}</p>
      <p><strong>Ngày bắt đầu giảm giá:</strong> {product.discountStart || "Không có"}</p>
      <p><strong>Ngày kết thúc giảm giá:</strong> {product.discountEnd || "Không có"}</p>
    </div>
  );
};

export default ProductDetailPage;
