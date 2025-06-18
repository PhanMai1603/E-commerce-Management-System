"use client";
import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, SlidersHorizontal } from "lucide-react";

const groupedOptions = [
  {
    key: "price",
    label: "💰 Giá",
    options: [
      { value: "-MIN_PRICE", label: "Cao tới Thấp" },
      { value: "MIN_PRICE", label: "Thấp tới Cao" },
    ],
  },
  {
    key: "views",
    label: "👀 Lượt xem",
    options: [
      { value: "-VIEWS", label: "Nhiều nhất" },
      { value: "VIEWS", label: "Ít nhất" },
    ],
  },
  {
    key: "sold",
    label: "🛒 Bán chạy",
    options: [
      { value: "-SOLD", label: "Nhiều nhất" },
      { value: "SOLD", label: "Ít nhất" },
    ],
  },
  {
    key: "quantity",
    label: "📦 Tồn kho",
    options: [
      { value: "-QUANTITY", label: "Nhiều nhất" },
      { value: "QUANTITY", label: "Ít nhất" },
    ],
  },
  {
    key: "rating",
    label: "⭐ Đánh giá",
    options: [
      { value: "-RATING", label: "Cao nhất" },
      { value: "RATING", label: "Thấp nhất" },
    ],
  },
  {
    key: "created",
    label: "🕒 Thời gian",
    options: [
      { value: "-CREATED_AT", label: "Mới nhất" },
      { value: "CREATED_AT", label: "Cũ nhất" },
    ],
  },
];

interface SortSelectedProps {
  setSort: (sort: string) => void;
}

export default function SortSelectedSheet({ setSort }: SortSelectedProps) {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(groupedOptions[0].key);
  const [selectedSort, setSelectedSort] = useState<string>("");

  // Xử lý lưu chọn sort và đóng sheet
  const handleApply = () => {
    setSort(selectedSort);
    setOpen(false);
  };

  // Lấy label của sort hiện tại để hiển thị lên trigger
  const getCurrentSortLabel = () => {
    for (const group of groupedOptions) {
      for (const opt of group.options) {
        if (opt.value === selectedSort) return opt.label;
      }
    }
    return "Sắp xếp";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="w-5 h-5" />
          <span>{getCurrentSortLabel()}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-sm w-full">
        <SheetHeader>
          <SheetTitle>Chọn kiểu sắp xếp</SheetTitle>
        </SheetHeader>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-5">
            <TabsList className="grid grid-cols-3 gap-1 mb-4">
                {groupedOptions.map((group) => (
                <TabsTrigger key={group.key} value={group.key} className="truncate">
                    {group.label}
                </TabsTrigger>
                ))}
            </TabsList>
          {groupedOptions.map((group) => (
            <TabsContent key={group.key} value={group.key}>
              <div className="flex flex-col gap-2">
                {group.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedSort(option.value)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border
                      ${selectedSort === option.value
                        ? "bg-primary/10 border-primary text-primary font-semibold"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    <span>{option.label}</span>
                    {selectedSort === option.value && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <SheetFooter className="mt-8 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              setSelectedSort("");
              setSort("");
              setOpen(false);
            }}
          >
            Xoá sắp xếp
          </Button>
          <Button type="button" className="flex-1" onClick={handleApply} disabled={!selectedSort}>
            Áp dụng
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
