/* eslint-disable @typescript-eslint/no-unused-vars */
// SimpleImportModal.tsx
"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductDetail } from "@/interface/product";
import { importStock } from "@/app/api/inventory";
import { toast } from "react-toastify";

interface SimpleImportModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductDetail;
  userId: string;
  accessToken: string;
}

export function SimpleImportModal({ open, onClose, product, userId, accessToken }: SimpleImportModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [importPrice, setImportPrice] = useState<number>(0);
  const [supplier, setSupplier] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const handleSubmit = async () => {
    if (!supplier.trim()) {
      toast.error("Vui lòng nhập nhà cung cấp");
      return;
    }

    try {
      await importStock(
        {
          supplier,
          note,
          items: [
            {
              productKey: product.id,
              quantity,
              importPrice,
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
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Số lượng"
          />
          <Input
            type="number"
            value={importPrice}
            onChange={(e) => setImportPrice(Number(e.target.value))}
            placeholder="Giá nhập"
          />
          <Button onClick={handleSubmit}>Xác nhận</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
