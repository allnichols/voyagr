export type DayDropdownProps = {
    dayId: number;
      dayNumber: number;
      index: number;
      days: { id: number; dayNumber: number; tripId: number }[];
      isOpen: boolean;
      onToggle: () => void;
      onDragStart: (
        e: React.DragEvent,
        index: number,
        dayId: number,
        dayNumber?: number,
        activityId?: number,
      ) => void;
      onDragOver: (e: React.DragEvent, index: number) => void;
      onDragEnter: (e: React.DragEvent) => void;
      onDragLeave: (e: React.DragEvent) => void;
      onDrop: (e: React.DragEvent, dropIndex: number) => void;
      isDragging: (index: number) => boolean;
      isDraggingOver: (index: number) => boolean;
}