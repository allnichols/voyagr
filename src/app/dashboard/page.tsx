import { Suspense } from "react";
import Trips from "@/features/dashboard/trips";

export default function TripsPage() {
  return (
    <div className="p-4">
      <div>
        <Suspense fallback={<div>Loading trips...</div>}>
          <Trips />
        </Suspense>
      </div>
    </div>
  );
}