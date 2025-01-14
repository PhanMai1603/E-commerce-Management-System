import React, { Suspense } from "react";
import { TableDemo } from "@/app/dashboard/categories/data-table";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TableDemo />
    </Suspense>
  );
}
