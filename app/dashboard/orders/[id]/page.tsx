import OrderDetailPage from "@/components/order/detail";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetailPage />
    </Suspense>
  );
}
