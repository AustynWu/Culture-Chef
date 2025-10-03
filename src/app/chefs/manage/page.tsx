// app/chefs/manage/page.tsx
import { Suspense } from "react";
import ManageClient from "./ManageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ManageClient />
    </Suspense>
  );
}
