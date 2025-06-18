/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Sales from "@/components/dashboard/sales";
import { getOrderRecords, getBestSeller } from "@/app/api/statistics";
import { OrderRecords, BestSellerMetadata } from "@/interface/statistics";
import DashboardOrderOverview from "@/components/dashboard/OrderRecords";
import BestSellerProductsTable from "@/components/dashboard/BestSellerProductsTable";
import TrendChart from "@/components/dashboard/TrendChart";
import ReturnRateTable from "@/components/dashboard/ReturnRateTable";
import CategoryRevenueTable from "@/components/dashboard/CategoryRevenueTable";
import ReviewChart from "@/components/dashboard/ReviewChart";

export default function Page() {
  const [orderRecords, setOrderRecords] = useState<OrderRecords | null>(null);
  const [bestSellerData, setBestSellerData] = useState<BestSellerMetadata | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    if (uid && token) {
      setUserId(uid);
      setAccessToken(token);

      Promise.all([getOrderRecords(uid, token), getBestSeller(uid, token)])
        .then(([orderData, bestSeller]) => {
          setOrderRecords(orderData);
          setBestSellerData(bestSeller);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!orderRecords) return <div className="p-4">Không có dữ liệu đơn hàng.</div>;
  if (!bestSellerData) return <div className="p-4">Không có dữ liệu sản phẩm bán chạy.</div>;

  return (
    <div className="grid gap-4 p-4">

      {/* Hàng 1: Sales */}
      <div>
        <Sales />
      </div>

      {/* Hàng 2: Doanh thu + Tổng quan đơn hàng */}
      {userId && accessToken && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrendChart userId={userId} accessToken={accessToken} />
          <DashboardOrderOverview orderRecords={orderRecords} />
        </div>
      )}

      {/* Hàng 3: Bán chạy + Đánh giá + Tỷ lệ hoàn trả */}
      {userId && accessToken && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <ReviewChart userId={userId} accessToken={accessToken} />
          <BestSellerProductsTable data={bestSellerData} />
       
          <ReturnRateTable userId={userId} accessToken={accessToken} />
        </div>
      )}

      {/* Hàng 4: Doanh thu theo danh mục */}
      {userId && accessToken && (
        <div>
          <CategoryRevenueTable
            userId={userId}
            accessToken={accessToken}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      )}
    </div>
  );
}
