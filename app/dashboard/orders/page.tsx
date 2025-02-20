

import React, { Suspense } from "react";
import { OrderPage } from "@/app/dashboard/orders/table";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderPage />
    </Suspense>
  );
}

