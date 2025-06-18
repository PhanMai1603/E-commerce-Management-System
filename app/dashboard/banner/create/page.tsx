/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/app/api/category";
import { createBanner } from "@/app/api/banner";
import type { BannerRequest, BannerPosition } from "@/interface/banner";
import { Banner as uploadBannerImage } from "@/app/api/upload";

export default function BannerCreatePage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [position, setPosition] = useState<BannerPosition>("SLIDE");
  const [category, setCategory] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || "");
    setAccessToken(localStorage.getItem("accessToken") || "");
    (async () => {
      try {
        setCategories(await getAllCategories());
      } catch {
        toast.error("Không thể tải danh mục!");
      }
    })();
  }, []);

  // Upload ảnh realtime
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!userId || !accessToken) {
      toast.error("Vui lòng đăng nhập lại!");
      return;
    }
    try {
      setLoading(true);
      const uploadedUrl = await uploadBannerImage(file, userId, accessToken);
      setImageUrl(uploadedUrl);
      toast.success("Upload ảnh thành công!");
    } catch (err) {
      toast.error("Upload ảnh thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Chọn danh mục
  const handleCategoryChange = (catId: string) => {
    setCategory((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (
    !title ||
    !imageUrl ||
    !position ||
    (position === "CATEGORY" && category.length === 0)
    // BỎ startDate, endDate khỏi validate bắt buộc
  ) {
    toast.error("Vui lòng nhập đủ thông tin bắt buộc!");
    return;
  }
  try {
    setLoading(true);
    const payload: BannerRequest = {
      title,
      subtitle,
      ctaText,
      ctaUrl,
      imageUrl,
      position,
      category: position === "CATEGORY" ? category : [],
      isActive,
      startDate, // giờ là optional, có thể rỗng
      endDate,
    };
    await createBanner(payload, userId, accessToken);
    toast.success("Tạo banner thành công!");
    router.push("/dashboard/banner");
  } catch (err) {
    // toast error đã có bên trong API
  } finally {
    setLoading(false);
  }
};
  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Tạo Banner Mới</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tiêu đề, phụ đề, CTA, link */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="font-medium mb-1 block">Tiêu đề <span className="text-red-500">*</span></label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="font-medium mb-1 block">Phụ đề</label>
              <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium mb-1 block">Nút CTA</label>
                <Input value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="Ví dụ: Xem ngay" />
              </div>
              <div>
                <label className="font-medium mb-1 block">Link khi bấm nút</label>
                <Input
                  value={ctaUrl}
                  onChange={e => setCtaUrl(e.target.value)}
                  placeholder="https://share-and-care-client.vercel.app/coupon"
                />
              </div>
            </div>
          </div>

          {/* Upload ảnh */}
          <div>
            <label className="font-medium mb-1 block">Ảnh banner <span className="text-red-500">*</span></label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="border-dashed border-2 border-gray-200 rounded p-2"
            />
            {imageUrl && (
              <div className="mt-3 flex justify-center">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full max-w-md h-44 object-cover rounded-lg shadow border"
                />
              </div>
            )}
          </div>

          {/* Vị trí banner */}
          <div>
            <label className="font-medium mb-1 block">Vị trí hiển thị <span className="text-red-500">*</span></label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value as BannerPosition)}
              className="border px-3 py-2 rounded-lg w-full mt-1 focus:ring-primary focus:border-primary"
            >
              <option value="SLIDE">Slide (Trang chủ)</option>
              <option value="FOOTER">Footer</option>
              <option value="CATEGORY">Theo danh mục</option>
            </select>
          </div>

          {/* Danh mục nếu chọn CATEGORY */}
          {position === "CATEGORY" && (
            <div>
              <label className="font-medium mb-1 block">Chọn danh mục <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    type="button"
                    size="sm"
                    variant={category.includes(cat.id) ? "default" : "outline"}
                    className={category.includes(cat.id) ? "bg-primary text-white" : ""}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Ngày bắt đầu - kết thúc */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-medium mb-1 block">Từ ngày <span className="text-red-500"></span></label>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
             
              />
            </div>
            <div className="flex-1">
              <label className="font-medium mb-1 block">Đến ngày <span className="text-red-500"></span></label>
              <Input
              type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
           
              />
            </div>
          </div>

          {/* Kích hoạt */}
          <div>
            <label className="font-medium">Hiển thị</label>
            <label className="inline-flex items-center ml-3 cursor-pointer select-none">
              <Input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="ml-2">{isActive ? "Có" : "Không"}</span>
            </label>
          </div>

          {/* Nút Submit + Hủy */}
          <div className="pt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300"
              onClick={() => router.push("/dashboard/banner")}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary text-white">
              {loading ? "Đang tạo..." : "Tạo banner"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
