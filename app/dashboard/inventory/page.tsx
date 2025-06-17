import React, { Suspense } from "react";
import InventoryForm from "./inventory-form";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryForm />
    </Suspense>
  );
}

