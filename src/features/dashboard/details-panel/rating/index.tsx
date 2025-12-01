import { TripActivity } from "@prisma/client";

export default function Rating({ activity }: { activity: TripActivity }) {
  return (
    <div className="flex gap-2">
      <div className="rating rating-md rating-half">
        {Array.from({ length: 11 }, (_, i) => i * 0.5).map((star) => {
          const isHidden = star === 0 ? "rating-hidden" : "";
          const isChecked = activity?.rating ? star <= activity.rating : false;
          const maskClass = star % 1 !== 0 ? "mask-half-1" : "mask-half-2";
          const bgColor = isChecked ? "bg-yellow-500" : "";

          const className = isHidden
            ? isHidden
            : `mask mask-star-2 ${maskClass} ${bgColor}`;

          return (
            <input
              key={star}
              type="radio"
              name="rating-11"
              className={className + " pointer-events-none"}
              aria-label={`${star} star`}
              defaultChecked={isChecked}
              disabled
              readOnly
            />
          );
        })}
      </div>
      <p>({activity?.userRatingCount})</p>
    </div>
  );
}
