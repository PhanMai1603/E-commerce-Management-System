import React, { Suspense } from "react";
import UnrepliedReviewsPage from "./review-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <UnrepliedReviewsPage/>
    </Suspense>
  );
}
