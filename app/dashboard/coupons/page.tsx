import React, { Suspense } from "react";
import CouponTable from "@/app/dashboard/coupons/coupons-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CouponTable />
    </Suspense>
  );
}
