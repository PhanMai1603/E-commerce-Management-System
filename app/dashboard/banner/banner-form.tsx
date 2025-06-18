/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAll } from "@/app/api/banner";
import type { BannerMetadata, BannerGroup, BannerItem } from "@/interface/banner";
import { Skeleton } from "@/components/ui/skeleton";

interface BannerListProps {
    userId: string;
    accessToken: string;
    position?: "SLIDE" | "FOOTER" | "CATEGORY";
}

// types
type BannerListType = { group: BannerGroup[]; total: number }
  | { group: BannerItem[]; total: number };

export default function BannerList({ userId, accessToken, position }: BannerListProps) {
  const [data, setData] = useState<any>(null); // dùng any cho linh hoạt, hoặc BannerListType
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !accessToken) return;
    setLoading(true);
    getAll(userId, accessToken, position)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [userId, accessToken, position]);

  if (loading) return <div>Loading...</div>;

  // Khi chưa có data hoặc không có group
  if (!data?.group || data.group.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách banner</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Không có banner nào.</p>
        </CardContent>
      </Card>
    );
  }

  // Nếu là group dạng group->items
  if (data.group[0]?.items) {
    return (
      <div className="space-y-6">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Nếu là group là mảng banner thẳng (BannerItem[])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách banner</CardTitle>
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

