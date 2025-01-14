import React, { Suspense } from "react";
import { TableDemo } from "@/app/dashboard/products/table";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TableDemo />
    </Suspense>
  );
}
