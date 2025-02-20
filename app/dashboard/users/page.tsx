import React, { Suspense } from "react";
import { TableDemo } from "@/app/dashboard/users/table";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TableDemo />
    </Suspense>
  );
}
