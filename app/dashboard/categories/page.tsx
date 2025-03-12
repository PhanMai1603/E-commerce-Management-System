import React, { Suspense } from "react";
import Page from "@/app/dashboard/categories/categories-form";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}
