/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { getProductDetail, getAllProduct } from "@/app/api/product";
import { importStock } from "@/app/api/inventory";
import { Product, ProductDetail, SkuList } from "@/interface/product";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type VariantImport = {
  variantId: string;
  quantity: number;
  importPrice: number;
};

type ScannedItem = {
  id: string;
  product: ProductDetail;
  skuList: SkuList[];
  variantInputs: VariantImport[];
  quantity: number;
  price: number;
};

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function QrImportPage() {
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [scanning, setScanning] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const cameraIdRef = useRef<string | null>(null);
  const lastErrorTime = useRef<number>(0);
  const scannedCodes = useRef<Set<string>>(new Set());

  useEffect(() => {
    getAllProduct(userId, accessToken, 1, 100).then((res) => setAllProducts(res.items));
  }, []);
const fetchProductDetail = async (rawCode: string) => {
  const code = rawCode.trim();

  // Nếu mã QR đã được quét → bỏ qua
  if (scannedCodes.current.has(code)) {
    return;
  }

   try {
    const res = await getProductDetail(code, userId, accessToken);
    const { product, skuList } = res;

    const newItem: ScannedItem = {
      id: generateId(),
      product,
      skuList: skuList ?? [], // CHỈ SỬ DỤNG skuList LÀ ARRAY
      variantInputs:
        (skuList ?? []).map((v) => ({
          variantId: v.id,
          quantity: 0,
          importPrice: v.price,
        })),
      quantity: 1,
      price: product.originalPrice,
    };

    setScannedItems((prev) => [...prev, newItem]);

    // Lưu chính xác mã QR thô đã quét, không dùng product.code
    scannedCodes.current.add(code);

    toast.success("✅ Quét thành công");
  } catch (err) {
    console.error("❌ QR KHÔNG TÌM THẤY:", err);
    toast.error("❌ Không tìm thấy sản phẩm");
  }
};

  const startScanner = async () => {
    if (!scannerRef.current && typeof window !== "undefined") {
      scannerRef.current = new Html5Qrcode("qr-reader");
    }

    const cameras = await Html5Qrcode.getCameras();
    if (cameras.length) {
      cameraIdRef.current = cameras[0].id;
      scannerRef.current?.start(
        cameraIdRef.current,
        { fps: 10, qrbox: 250 },
        async (text) => {
          await fetchProductDetail(text);
        },
        (err) => {
          const now = Date.now();
          if (now - lastErrorTime.current > 3000) {
            console.warn("⚠️ Scan error:", err);
            lastErrorTime.current = now;
          }
        }
      );
      setScanning(true);
    } else {
      toast.error("Không tìm thấy camera");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scanning) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      setScanning(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const tempId = "qr-reader-temp";

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(tempId);
      }

      const result = await scannerRef.current.scanFile(file, true);
      // toast.success(`✅ Mã QR: ${result}`);
      await fetchProductDetail(result);

      // Optional: clean temp div
      const div = document.getElementById(tempId);
      if (div) div.innerHTML = "";
    } catch (err) {
      console.error("❌ Không đọc được mã QR từ ảnh:", err);
      toast.error("❌ Không đọc được mã QR từ ảnh");
    }
  };

  const handleImport = async () => {
    if (scannedItems.length === 0 || !supplier.trim()) {
      toast.error("Vui lòng quét ít nhất 1 sản phẩm và điền nhà cung cấp");
      return;
    }

    const items = scannedItems.map((item) => {
      if (item.skuList.length > 0) {
        return {
          productKey: item.product.code,
          skuList: item.variantInputs.filter((v) => v.quantity > 0 && v.importPrice > 0),
        };
      } else {
        return {
          productKey: item.product.id,
          quantity: item.quantity,
          importPrice: item.price,
        };
      }
    });

    try {
      await importStock({ supplier, note, items }, userId, accessToken);
      toast.success("🎉 Nhập kho thành công!");
      setScannedItems([]);
      scannedCodes.current.clear();
    } catch {
      toast.error("❌ Lỗi khi nhập kho");
    }
  };

  return (
<div className="p-4 space-y-6 max-w-4xl mx-auto">
  <h2 className="text-2xl font-bold text-center">📦 Nhập kho bằng mã QR</h2>

  {/* QR Scanner Section */}
  <div className="bg-white shadow rounded-lg p-4 space-y-4 border">
    <div className="flex flex-col items-center space-y-3">
      <div id="qr-reader" className="w-[300px] h-[300px] border-4 border-yellow-400 rounded-lg" />

      <div className="flex flex-wrap justify-center gap-4">
        {!scanning ? (
          <Button onClick={startScanner}>▶️ Bắt đầu quét</Button>
        ) : (
          <Button variant="destructive" onClick={stopScanner}>
            ⏹️ Dừng quét
          </Button>
        )}

        {/* Upload QR from Image */}
        <label className="text-sm font-medium text-gray-600">
          📷 Upload ảnh chứa mã QR
          <Input
            type="file"
            accept="image/*"
            className="mt-1"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
        </label>
        <div id="qr-reader-temp" className="hidden" />
      </div>
    </div>
  </div>

  {/* Supplier & Note */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input placeholder="🏭 Nhà cung cấp" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
    <Input placeholder="📝 Ghi chú" value={note} onChange={(e) => setNote(e.target.value)} />
  </div>

  {/* Scanned Items Form */}
  {scannedItems.map((item, index) => (
  <div key={item.id} className="border p-4 rounded-lg bg-gray-50 space-y-3 shadow-sm relative">
    <button
      onClick={() => {
        const newList = scannedItems.filter((_, i) => i !== index);
        setScannedItems(newList);
        scannedCodes.current.delete(item.product.code || item.product.id); // Xóa khỏi set
        toast.info("🗑️ Đã xoá sản phẩm khỏi danh sách");
      }}
      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
      title="Xoá sản phẩm này"
    >
      &times;
    </button>

      <h3 className="font-semibold text-lg">{item.product.name}</h3>
      {item.skuList.length > 0 ? (
        <div className="space-y-2">
          {item.variantInputs.map((v, vi) => {
            const slug = item.skuList.find((s) => s.id === v.variantId)?.slug ?? `Biến thể ${vi + 1}`;
            return (
              <div key={v.variantId + index} className="flex items-center gap-3">
                <span className="min-w-[100px]">{slug}</span>
                <Input
                  type="number"
                  placeholder="Số lượng"
                  value={v.quantity}
                  onChange={(e) => {
                    const newList = [...scannedItems];
                    newList[index].variantInputs[vi].quantity = Number(e.target.value);
                    setScannedItems(newList);
                  }}
                />
                <Input
                  type="number"
                  placeholder="Giá nhập"
                  value={v.importPrice}
                  onChange={(e) => {
                    const newList = [...scannedItems];
                    newList[index].variantInputs[vi].importPrice = Number(e.target.value);
                    setScannedItems(newList);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Số lượng"
            value={item.quantity}
            onChange={(e) => {
              const newList = [...scannedItems];
              newList[index].quantity = Number(e.target.value);
              setScannedItems(newList);
            }}
          />
          <Input
            type="number"
            placeholder="Giá nhập"
            value={item.price}
            onChange={(e) => {
              const newList = [...scannedItems];
              newList[index].price = Number(e.target.value);
              setScannedItems(newList);
            }}
          />
        </div>
      )}
    </div>
  ))}

  {/* Submit Button */}
  {scannedItems.length > 0 && (
    <div className="text-center">
      <Button className="mt-4 px-6 py-2 text-lg" onClick={handleImport}>
        ✅ Nhập tất cả sản phẩm
      </Button>
    </div>
  )}

  {/* All Products Table */}
  <div className="mt-10">
    <h3 className="text-xl font-semibold mb-2">📋 Danh sách sản phẩm hiện có</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Ảnh</th>
            <th className="border px-4 py-2 text-left">Tên sản phẩm</th>
            <th className="border px-4 py-2 text-left">Giá gốc</th>
            <th className="border px-4 py-2 text-left">Tồn kho</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((p) => (
            <tr key={p.id + "_pick"} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                <img src={p.mainImage} alt={p.name} className="w-16 h-16 object-cover rounded" />
              </td>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.originalPrice.toLocaleString()}đ</td>
              <td className="border px-4 py-2">{p.quantity?.toLocaleString() ?? "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
}
