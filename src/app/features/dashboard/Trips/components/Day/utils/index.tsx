import { PriceLevel } from "@/types/google-places";

const DollarIcon = ({ className = "size-4" }: { className?: string }) => {
    return (
         <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={className}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
    )
}
export function getPriceLevelIcons(priceLevel: PriceLevel | undefined) {
    const levels = {
        [PriceLevel.UNSPECIFIED]: 0,
        [PriceLevel.FREE]: 1,
        [PriceLevel.INEXPENSIVE]: 2,
        [PriceLevel.MODERATE]: 3,
        [PriceLevel.EXPENSIVE]: 4,
        [PriceLevel.VERY_EXPENSIVE]: 5,
    }

    if(priceLevel === PriceLevel.FREE) {
        return <span className="text-green-500">Price: FREE!</span>
    }

    if(priceLevel === undefined) {
        return <span className="text-gray-500">Price: N/A</span>
    }

    const level = priceLevel != undefined ? levels[priceLevel] : 0;

    return (
        <div className="flex items-center gap-0.5">
            Price:
            {Array.from({ length: level }).map((_, idx) => {
                return <DollarIcon key={idx} className="size-4" />
            })}

        </div>
    )
}
