import Link from "next/link";

export default function TripsPage() {
  return (
    <div className="p-4">
      <h1 className="font-bold mb-4">Trips</h1>

      <div>

      </div>

      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl mb-2 font-bold">You don't have any trips!</h2>
          <p className="mb-4">Create one now!</p>
          <Link href="/dashboard/create-trip" className="btn btn-secondary rounded-sm">Create a trip</Link>
        </div>
      </div>
    </div>
  );
}