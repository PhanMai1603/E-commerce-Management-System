import React, { Suspense } from "react";
import RefundForm from "./refund-form";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefundForm />
    </Suspense>
  );
}
