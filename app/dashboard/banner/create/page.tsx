/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

  // Lấy token và categories
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
      setImageUrl(uploadedUrl); // API trả về url string
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
      !startDate ||
      !endDate ||
      (position === "CATEGORY" && category.length === 0)
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
        startDate,
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
    <Card className="max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Tạo banner mới</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="font-medium">Tiêu đề *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="font-medium">Phụ đề</label>
            <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
          </div>
          <div>
            <label className="font-medium">Nút kêu gọi (CTA Text)</label>
            <Input value={ctaText} onChange={e => setCtaText(e.target.value)} />
          </div>
          <div>
            <label className="font-medium">Link khi bấm nút (CTA Url)</label>
            <Input
              value={ctaUrl}
              onChange={e => setCtaUrl(e.target.value)}
              placeholder="VD: https://share-and-care-client.vercel.app/coupon"
            />
          </div>
          <div>
            <label className="font-medium">Ảnh banner *</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="mt-2 w-full h-40 object-cover rounded border" />
            )}
          </div>
          <div>
            <label className="font-medium">Vị trí *</label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value as BannerPosition)}
              className="border px-2 py-1 rounded w-full mt-1"
            >
              <option value="SLIDE">Slide (Trang chủ)</option>
              <option value="FOOTER">Footer</option>
              <option value="CATEGORY">Theo danh mục</option>
            </select>
          </div>
          {position === "CATEGORY" && (
            <div>
              <label className="font-medium">Chọn danh mục *</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    type="button"
                    size="sm"
                    variant={category.includes(cat.id) ? "default" : "outline"}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-medium">Từ ngày *</label>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="font-medium">Đến ngày *</label>
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="font-medium">Hiển thị</label>
            <Input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="ml-2"
            />{" "}
            {isActive ? "Có" : "Không"}
          </div>
          <div className="pt-4 flex justify-end gap-4">
            <Button
              type="button"
              className="bg-gray-100 text-gray-900 hover:bg-gray-200"
              onClick={() => router.push("/dashboard/banner")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo banner"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
