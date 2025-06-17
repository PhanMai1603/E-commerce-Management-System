/* eslint-disable @typescript-eslint/no-unused-vars */
// VariantImportModal.tsx
"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VariantImport } from "@/interface/inventory";
import { ProductDetail, SkuList } from "@/interface/product";
import { importStock } from "@/app/api/inventory";
import { toast } from "react-toastify";

interface VariantImportModalProps {
  open: boolean;
  onClose: () => void;
  skuList: SkuList[];
  product: ProductDetail;
  userId: string;
  accessToken: string;
}

export function VariantImportModal({
  open,
  onClose,
  skuList: initialSkuList,
  product,
  userId,
  accessToken,
}: VariantImportModalProps) {
  const [supplier, setSupplier] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [skuList, setSkuList] = useState<VariantImport[]>(
    initialSkuList.map((sku) => ({
      variantId: sku.id,
      quantity: 0,
      importPrice: 0,
    }))
  );

  const handleChange = (index: number, field: "quantity" | "importPrice", value: number) => {
    const updated = [...skuList];
    updated[index][field] = value;
    setSkuList(updated);
  };

  const handleSubmit = async () => {
    const filtered = skuList.filter((v) => v.quantity > 0 && v.importPrice > 0);
    if (!supplier.trim()) {
      toast.error("Vui lòng nhập nhà cung cấp!");
      return;
    }

    if (filtered.length === 0) {
      toast.error("Vui lòng nhập ít nhất một biến thể hợp lệ!");
      return;
    }

    try {
      await importStock(
        {
          supplier,
          note,
          items: [
            {
              productKey: product.code,
              skuList: filtered,
            },
          ],
        },
        userId,
        accessToken
      );
      toast.success("Nhập kho thành công!");
      onClose();
    } catch (error) {
      toast.error("Lỗi khi nhập kho!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập kho sản phẩm: {product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Nhà cung cấp"
          />
          <Input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú"
          />

          {initialSkuList.map((sku, index) => (
            <div key={sku.id} className="space-y-1">
              <p className="font-medium">{sku.slug || sku.id}</p>
              <Input
                type="number"
                placeholder="Số lượng"
                onChange={(e) => handleChange(index, "quantity", Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Giá nhập"
                onChange={(e) => handleChange(index, "importPrice", Number(e.target.value))}
              />
            </div>
          ))}
          <Button onClick={handleSubmit}>Xác nhận</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
