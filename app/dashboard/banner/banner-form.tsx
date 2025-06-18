/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAll } from "@/app/api/banner";
import { BannerMetadata, BannerGroup, BannerItem } from "@/interface/banner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// Hiển thị từng phần (SLIDE, CATEGORY, FOOTER)
function RenderBannerSection({
  data,
  title,
  subtitle,
  router,
}: {
  data: any;
  title: string;
  subtitle?: string;
  router: any;
}) {
  if (!data?.group || data.group.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Không có banner nào.</p>
        </CardContent>
      </Card>
    );
  }

  // Nếu là group->items (CATEGORY)
  if (data.group[0]?.items) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </CardHeader>
        </Card>
        {data.group.map((group: BannerGroup) => (
          <Card key={group.id} className="border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">{group.name}</CardTitle>
                <Badge variant="outline">{group.total} banner</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.items.map((item: BannerItem) => (
                  <div
                    key={item.id}
                    className={`rounded border p-2 flex flex-col gap-2 items-center ${!item.isActive ? "opacity-50" : ""}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.id}
                      className="w-full h-32 object-cover rounded shadow"
                    />
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "Đang hiển thị" : "Ẩn"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/banner/${item.id}`)}
                    >
                      Chi tiết
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Nếu là mảng banner thẳng (SLIDE, FOOTER)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
        <Badge variant="outline">{data.group.length} banner</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.group.map((item: BannerItem) => (
            <div
              key={item.id}
              className={`rounded border p-2 flex flex-col gap-2 items-center ${!item.isActive ? "opacity-50" : ""}`}
            >
              <img
                src={item.imageUrl}
                alt={item.id}
                className="w-full h-32 object-cover rounded shadow"
              />
              <Badge variant={item.isActive ? "default" : "secondary"}>
                {item.isActive ? "Đang hiển thị" : "Ẩn"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/banner/${item.id}`)}
              >
                Chi tiết
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BannerList({ userId, accessToken }: { userId: string, accessToken: string }) {
  const [slideData, setSlideData] = useState<BannerMetadata | null>(null);
  const [categoryData, setCategoryData] = useState<BannerMetadata | null>(null);
  const [footerData, setFooterData] = useState<BannerMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!userId || !accessToken) return;
    setLoading(true);

    Promise.all([
      getAll(userId, accessToken, "SLIDE"),
      getAll(userId, accessToken, "CATEGORY"),
      getAll(userId, accessToken, "FOOTER"),
    ])
      .then(([slide, category, footer]) => {
        setSlideData(slide);
        setCategoryData(category);
        setFooterData(footer);
      })
      .finally(() => setLoading(false));
  }, [userId, accessToken]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => router.push("/dashboard/banner/create")}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm banner
        </Button>
      </div>
      <RenderBannerSection
        data={slideData}
        title="Banner Slide"
        subtitle="Banner sẽ hiển thị ở trang chủ, dạng slider hoặc hero section."
        router={router}
      />
      <RenderBannerSection
        data={categoryData}
        title="Banner theo danh mục"
        subtitle="Các banner này gắn với từng danh mục, hiển thị trên trang danh mục sản phẩm."
        router={router}
      />
      <RenderBannerSection
        data={footerData}
        title="Banner Footer"
        subtitle="Banner sẽ hiển thị ở chân trang (footer) toàn site."
        router={router}
      />
    </div>
  );
}
