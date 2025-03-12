import React, { Suspense } from "react";
import { RoleTable } from "@/app/dashboard/role/role-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoleTable />
    </Suspense>
  );
}
