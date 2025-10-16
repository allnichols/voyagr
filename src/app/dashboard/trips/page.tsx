import Trips from "@/app/features/dashboard/trips";
import { Suspense } from "react";

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
