import { useQuery } from "@tanstack/react-query";
import { downloadItinerary } from "../api";

type DownloadItineraryProps = {
  tripId: number | string;
};

export default function DownloadItinerary({ tripId }: DownloadItineraryProps) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["downloadItinerary", tripId],
    queryFn: () => downloadItinerary(tripId),
    enabled: false,
  });

  const handleOpenModal = () => {
    const modal = document.getElementById(
      "download-modal",
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
    refetch();
  };

  return (
    <>
      <button className="btn btn-soft btn-info btn-sm" onClick={handleOpenModal}>
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
        Download
      </button>
      <dialog id="download-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          {isLoading && <p>Preparing your download...</p>}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
