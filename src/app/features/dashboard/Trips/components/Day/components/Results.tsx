import { GooglePlace } from "@/types/google-places";
import Image from "next/image";
import { getPriceLevelIcons } from "../utils";

export function GooglePlaceResults({
  places,
  onSelect,
}: {
  places: GooglePlace[];
  onSelect: (place: GooglePlace) => void;
}) {
  if (places.length === 0) {
    return <p className="text-center">No results found</p>;
  }
  
  return (
    <ul className="list">
      {places.map((place) => (
        <li key={place.id} className="list-row items-center">
          <div>
            {place.iconMaskBaseUri ? (
              <div className="w-4 h-4 bg-base-200">
                <Image
                  width={15}
                  height={15}
                  src={`${place.iconMaskBaseUri}.png`}
                  alt="Place icon"
                />
              </div>
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
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            )}
          </div>
          <div>
            <p>{place.displayName.text}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 flex items-center">
                {place.rating ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block h-4 w-4 mr-1"
                      fill="#fde68a"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    {place.rating}
                  </>
                ) : (
                  ""
                )}
              </p>
              -
              <div className="text-xs text-gray-500">
                {getPriceLevelIcons(place.priceLevel)}
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm btn-soft rounded-2xl"
            onClick={() => onSelect(place)}
          >
            Add
          </button>
        </li>
      ))}
    </ul>
  );
}