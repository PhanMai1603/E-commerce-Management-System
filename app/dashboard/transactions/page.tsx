import React, { Suspense } from "react";
import TransactionsForm from "./transactions-form";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionsForm />
    </Suspense>
  );
}
