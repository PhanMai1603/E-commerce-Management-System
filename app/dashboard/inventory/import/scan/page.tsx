/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import QrScanner from "@/components/qr/QrScanner";
import QrImageScanner from "@/components/qr/QrImageScanner";
import { getAllProduct, getProductDetail } from "@/app/api/product";
import { ProductDetail, SkuList } from "@/interface/product";
import { SimpleImportModal } from "@/components/qr/SimpleImportModal";
import { VariantImportModal } from "@/components/qr/VariantImportModal";

export default function ScanProductPage() {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [skuList, setSkuList] = useState<SkuList[]>([]);
  const [mode, setMode] = useState<"none" | "camera" | "image">("none");
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const handleScan = async (productCode: string) => {
    try {
      // Bước 1: Tải toàn bộ sản phẩm (nên dùng size lớn hơn nếu có nhiều)
      const all = await getAllProduct(userId, accessToken, 1, 1000); // Tăng size nếu cần

      const matched = all.items.find((item) => item.code === productCode);
      if (!matched) {
        alert("Không tìm thấy sản phẩm có mã QR này.");
        return;
      }

      // Bước 2: Lấy chi tiết sản phẩm
      const detail = await getProductDetail(matched.id, userId, accessToken);
      setProduct(detail.product);
      setSkuList(detail.skuList?.skuList || []);

      if (detail.skuList?.skuList?.length > 0) {
        setShowVariantModal(true);
      } else {
        setShowSimpleModal(true);
      }
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm theo mã", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Quét QR để nhập kho</h2>

      <div className="flex gap-4">
        <button
          onClick={() => setMode("camera")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Dùng Camera
        </button>
        <button
          onClick={() => setMode("image")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Tải ảnh QR
        </button>
      </div>

      {mode === "camera" && <QrScanner onScanSuccess={handleScan} />}
      {mode === "image" && <QrImageScanner onScanSuccess={handleScan} />}

      {product && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p>Mã sản phẩm: {product.code}</p>
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-40 h-40 object-cover mt-2"
          />
        </div>
      )}

      {product && showSimpleModal && (
        <SimpleImportModal
          open={showSimpleModal}
          onClose={() => setShowSimpleModal(false)}
          product={product}
          userId={userId}
          accessToken={accessToken}
        />
      )}

      {product && showVariantModal && (
        <VariantImportModal
          open={showVariantModal}
          onClose={() => setShowVariantModal(false)}
          product={product}
          userId={userId}
          accessToken={accessToken}
          skuList={skuList}
        />
      )}
    </div>
  );
}
