/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { getDetail } from "@/app/api/banner";
import type { BannerDetailMetadata } from "@/interface/banner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import PublishBanner from "@/components/banner/switch";


export default function BannerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bannerId = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");
  const [data, setData] = useState<BannerDetailMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  // Lấy userId, accessToken từ localStorage
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || "");
    setAccessToken(localStorage.getItem("accessToken") || "");
  }, []);

  // Refetch chi tiết khi bannerId, userId, accessToken đổi
  const fetchDetail = () => {
    if (!bannerId || !userId || !accessToken) return;
    setLoading(true);
    getDetail(bannerId, userId, accessToken)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerId, userId, accessToken]);

  // Sau khi publish/unpublish thành công, reload lại chi tiết banner
  const handlePublishChange = () => {
    fetchDetail();
  };

  if (!userId || !accessToken) return <div>Vui lòng đăng nhập lại!</div>;
  if (loading || !data) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <Button
            variant="outline"
            size="sm"
            className="mb-2 md:mb-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
          <CardTitle className="text-xl">{data.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <PublishBanner
            id={data.id}
            isActive={data.isActive}
            onChanged={handlePublishChange}
          />
          <Badge variant={data.isActive ? "default" : "secondary"}>
            {data.isActive ? "Đang hiển thị" : "Ẩn"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-[15px]">
        <div>
          <span className="text-gray-500">Vị trí:</span> <b>{data.position}</b>
        </div>
        {data.subtitle && (
          <div>
            <span className="text-gray-500">Mô tả ngắn:</span> {data.subtitle}
          </div>
        )}
        <div>
          <span className="text-gray-500">CTA Text:</span> <b>{data.ctaText}</b>
        </div>
        <div>
          <span className="text-gray-500">CTA Url:</span>{" "}
          <a
            href={data.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {data.ctaUrl}
          </a>
        </div>
        <div>
          <span className="text-gray-500">Ảnh banner:</span>
          <div className="my-2">
            <img
              src={data.imageUrl}
              alt={data.title}
              className="rounded shadow border w-full max-w-sm"
            />
          </div>
          <div className="text-xs text-gray-500 break-all">
            <span>Cloudinary publicId:</span> {data.publicId}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Thứ tự hiển thị:</span> {data.displayOrder}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-gray-500">Danh mục:</span>
          {data.category.length === 0 ? (
            <span>Không có</span>
          ) : (
            data.category.map((cat) => (
              <Badge key={cat.id} variant="outline" className="text-[13px]">
                {cat.name}
              </Badge>
            ))
          )}
        </div>
        <div>
          <span className="text-gray-500">Thời gian áp dụng:</span>{" "}
          <b>
            {format(new Date(data.startDate), "dd/MM/yyyy", { locale: vi })} -{" "}
            {format(new Date(data.endDate), "dd/MM/yyyy", { locale: vi })}
          </b>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500">Tạo lúc:</span>{" "}
            {format(new Date(data.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
          </div>
          <div>
            <span className="text-gray-500">Cập nhật lúc:</span>{" "}
            {format(new Date(data.updatedAt), "dd/MM/yyyy HH:mm", { locale: vi })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
