import React, { Suspense } from "react";


import AllDiscountPage from "./discount-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
     <AllDiscountPage />
    </Suspense>
  );
}
