/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { getAllCategories } from "@/app/api/category";
import { getAllProduct } from "@/app/api/product";
import { Discount } from "@/app/api/inventory";
import { DiscountType, Promotion } from "@/interface/inventory";
import PromotionInformationForm from "@/components/discount/PromotionInformationForm";
import PromotionTargetForm from "@/components/discount/PromotionTargetForm";
import PromotionNoteForm from "@/components/discount/PromotionNoteForm";
import PromotionCategoryPopover from "@/components/discount/PromotionTargetForm";
import ProductSelection from "@/components/discount/ProductSelection";

export default function PromotionCreatePage() {
    const router = useRouter();
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    // State
    const [discountType, setDiscountType] = useState<DiscountType>("PERCENT");
    const [discountValue, setDiscountValue] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [note, setNote] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            try {
                setCategories(await getAllCategories());
            } catch { toast.error("Không thể tải danh mục!"); }
            try {
                if (userId && accessToken)
                    setProducts((await getAllProduct(userId, accessToken, 1, 100)).items);
            } catch { toast.error("Không thể tải sản phẩm!"); }
        })();
    }, [userId, accessToken]);

    const handleSubmit = async () => {
        if (
            !discountValue || !startDate || !endDate ||
            (selectedProducts.length === 0 && selectedCategories.length === 0)
        ) {
            toast.error("Vui lòng nhập đủ thông tin & chọn ít nhất 1 sản phẩm hoặc danh mục!");
            return;
        }
        if (!userId || !accessToken) {
            toast.error("Chưa đăng nhập!");
            return;
        }
        setLoading(true);
        try {
            const payload: Promotion = {
                discountType,
                discountValue,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                note,
                productIds: selectedProducts,
                categoryIds: selectedCategories,
            };
            await Discount(payload, userId, accessToken);
            toast.success("Tạo khuyến mãi thành công!");
            router.push("/dashboard/discount");
        } catch { }
        setLoading(false);
    };

    return (
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Cột trái */}
  <PromotionInformationForm
    discountType={discountType}
    setDiscountType={setDiscountType}
    discountValue={discountValue}
    setDiscountValue={setDiscountValue}
    startDate={startDate}
    setStartDate={setStartDate}
    endDate={endDate}
    setEndDate={setEndDate}
  />
  {/* Cột phải */}
  <PromotionNoteForm note={note} setNote={setNote} />

  {/* Row: chọn danh mục và sản phẩm (chiếm full width) */}
  <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
    <PromotionCategoryPopover
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
    />
    <ProductSelection
      userId={userId || ""}
      accessToken={accessToken || ""}
      selectedProducts={selectedProducts}
      setSelectedProducts={setSelectedProducts}
    />
  </div>

  {/* Nút submit */}
  <div className="col-span-2 flex justify-end gap-4">
    <Button
      onClick={() => router.push("/dashboard/discount")}
      className="bg-gray-200 text-gray-900 hover:bg-gray-300"
      type="button"
    >
      HỦY
    </Button>
    <Button onClick={handleSubmit} disabled={loading}>
      {loading ? "Đang tạo..." : "TẠO KHUYẾN MÃI"}
    </Button>
  </div>
</div>

    );
}
