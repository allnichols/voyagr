import { GooglePlace } from "@/types/google-places";
import { getPriceLevelIcons } from "../../utils";
import GoogleImage from "../../../google-image";

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
          <div className="w-[55px] h-[55px] relative">
            <GoogleImage placeId={place.id} width={55} height={55} />
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
