import React, { Suspense } from "react";
import { UserTable } from "@/app/dashboard/users/user-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserTable />
    </Suspense>
  );
}
