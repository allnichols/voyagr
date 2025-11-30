import { TripActivity } from "@prisma/client";
import dynamic from "next/dynamic";
import GoogleImage from "../../../google-image";
import { useDetailsDrawer } from "@/features/dashboard/store/detailsDrawer";
import { useCurrentActivity } from "@/features/dashboard/store/activity";

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function MarkerPopup({ activity }: { activity: TripActivity }) {
  const toggleDetailsPanel = useDetailsDrawer(
    (state) => state.toggleDetailsDrawer,
  );
  const setCurrentActivity = useCurrentActivity(
    (state) => state.setCurrentActivity,
  );

  return (
    <Popup>
      <div className="card max-w-[300px] min-w-[300px]">
        <figure className="relative h-[175px] px-10 pt-10 w-full">
          <GoogleImage placeId={activity.gPlaceId} />
        </figure>
        <div className="card-body items-start gap-0">
          <h2 className="card-title">{activity.place}</h2>
          <p className="text-grey">{activity.address}</p>
          <div className="card-actions">
            <button
              className="btn btn-sm btn-outline btn-info"
              onClick={() => {
                toggleDetailsPanel();
                setCurrentActivity(activity.id);
              }}
            >
              View More
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
