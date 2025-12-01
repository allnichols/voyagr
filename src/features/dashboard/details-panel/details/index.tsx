import { TripActivity } from "@prisma/client";
import { LocationIcon } from "@/components/icons/location";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function Details({ activity }: { activity: TripActivity }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <LocationIcon />
        <div>
          <p className="font-semibold mb-2">Address</p>
          <p>{activity?.address}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <PhoneIcon width={23} height={23} />
        <div>
          <p className="font-semibold mb-2">Phone</p>
          <p>{activity?.internationalPhoneNumber}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <GlobeAltIcon width={23} height={23} />
        <div className="overflow-hidden min-w-0 flex-1">
          <p className="font-semibold mb-2">Website</p>
          <a
            href={activity?.websiteUri ? activity?.websiteUri : ""}
            className="block truncate"
            target="_blank"
            rel="noopener noreferrer"
          >
            {activity?.websiteUri}
          </a>
        </div>
      </div>
    </div>
  );
}
