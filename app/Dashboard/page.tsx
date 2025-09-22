"use client";
import { Suspense } from "react";
import DashboardContent from "./DashboardContent"; // Move all your current Dashboard code here

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-white text-center mt-10">Loading Dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}
