"use client";
import { useCurrentDay } from "@/features/dashboard/store/currentDay";
import AddActivityBtn from "./add-activity-btn";
import DayMenu from "./menu/day-menu";
import Activities from "./activity";
import { DayDropdownProps } from "./types";

export const DayDropdown = ({
  dayId,
  dayNumber,
  index,
  days,
  isOpen,
  onToggle,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  isDragging,
  isDraggingOver,
}: DayDropdownProps) => {
  const setCurrentDay = useCurrentDay((state) => state.setCurrentDay);
  const currentDay = useCurrentDay((state) => state.currentDay.id);

  const handleSelectDay = (currentDay: number, dayId: number) => {
    if (currentDay !== dayId) {
      setCurrentDay(dayId);
    }
  };

  const getDragClassName = () => {
    if(!isOpen) {
      return "cursor-grab";
    } else {
      return isDragging(index) ? "opacity-50" : "opacity-100";
    }
  }

  return (
    <>
      <div
        draggable={isOpen ? false : true}
        id={`day-${dayId}-${index}`}
        className={`${getDragClassName()} `}
        onDragStart={(e) => onDragStart(e, index, dayId, dayNumber)}
        onDragOver={(e) => onDragOver(e, index)}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, index)}
      >
        <div className="flex items-center justify-between mb-4 rounded-lg ps-2 hover:bg-base-200">
          <div className="flex items-center gap-4 p-2">
            <button
              onClick={() => {
                handleSelectDay(currentDay as number, dayId);
                onToggle();
              }}
              className={`btn btn-circle btn-sm btn-ghost`}
              type="button"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <title>Collapse</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <title>Expand</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Day</p>
                <p className="text-lg">
                  {`${dayNumber >= 10 ? "" : "0"}`}
                  {dayNumber}
                </p>
              </div>
            </div>
          </div>
          <DayMenu index={index} dayId={dayId} days={days} />
        </div>
        <div
          className="ml-4 mb-4 transition-all duration-300"
          style={{
            maxHeight: isOpen ? "500px" : "0",
            opacity: isOpen ? 1 : 0,
            display: isOpen ? "block" : "none",
          }}
        >
          <Activities
            isDragging={isDragging}
            isOpen={isOpen}
            dayId={dayId}
            index={index}
          />

          <AddActivityBtn dayId={dayId} dayNumber={dayNumber} />
        </div>
      </div>
    </>
  );
};
