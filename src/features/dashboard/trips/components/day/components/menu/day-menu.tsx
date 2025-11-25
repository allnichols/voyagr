import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDay, updateDayNumbers } from "../../../itinerary/actions"; // Adjust the path as needed

type DayMenuProps = {
  index: number;
  dayId: number;
  days: { id: number; dayNumber: number; tripId: number }[];
};

export default function DayMenu({ index, dayId, days }: DayMenuProps) {
  const queryClient = useQueryClient();

  const deleteDayMutation = useMutation({
    mutationFn: async (dayId: number) => {
      return await deleteDay(dayId);
    },
    onSuccess: async () => {
      const deletedDay = days.find((day) => day.id === dayId);
      if (!deletedDay) return;

      const updatedDayNumbers = days
        .filter((day) => day.dayNumber > deletedDay.dayNumber)
        .map((day) => ({
          id: day.id,
          dayNumber: day.dayNumber - 1,
          tripId: day.tripId,
        }));

      if (updatedDayNumbers.length > 0) {
        await updateDayNumbers(deletedDay.tripId, updatedDayNumbers);
      }

      queryClient.invalidateQueries({ queryKey: ["tripDays"] });
    },
  });

  return (
    <div className="mr-2">
      <div className="dropdown dropdown-top dropdown-left z-20">
        <div
          tabIndex={index}
          role="button"
          className="btn btn-ghost btn-circle"
        >
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
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </div>
        <ul
          tabIndex={index}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xl/20"
        >
          <li
            onClick={() => {
              deleteDayMutation.mutate(dayId);
            }}
          >
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              Remove
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
