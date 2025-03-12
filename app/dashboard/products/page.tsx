import React, { Suspense } from "react";
import { ProductTable } from "@/app/dashboard/products/product-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductTable />
    </Suspense>
  );
}
