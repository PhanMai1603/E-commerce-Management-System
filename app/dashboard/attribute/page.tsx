

import React, { Suspense } from "react";
import AttributeTable from "@/app/dashboard/attribute/attribute-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttributeTable />
    </Suspense>
  );
}

