import Trips from "@/app/features/dashboard/trips";
import { Suspense } from "react";

export default function TripsPage() {
  return (
    <div className="p-4">
      <h1 className="font-bold mb-4">Trips</h1>

      <div>
        <Suspense fallback={<div>Loading trips...</div>}>
          <Trips />
        </Suspense>
      </div>
    </div>
  );
}
