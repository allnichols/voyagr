import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadItinerary } from "../api";
import useToast from "@/features/dashboard/hooks/useToast";
import ToastComponent from "@/features/dashboard/components/toast";

type DownloadItineraryProps = {
  tripId: number | string;
};

export default function DownloadItinerary({ tripId }: DownloadItineraryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination") || "Your_Trip";
  const { toasts, showError, removeToast } = useToast();

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const res = await downloadItinerary(tripId);

      if (!res) {
        showError("Download failed. Please try again.");
        console.log("No itinerary available for download.");
      }

      const blob = res;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `itinerary_${destination}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      showError("Download failed. Please try again.");
      console.error("Download failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-soft btn-info btn-sm"
        onClick={handleDownload}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        )}
        Download
      </button>
      <ToastComponent toasts={toasts} onRemove={removeToast} />
    </>
  );
}
