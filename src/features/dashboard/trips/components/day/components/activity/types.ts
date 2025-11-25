import { DragItem } from '@/features/dashboard/trips/components/itinerary/hooks/useDragAndDrop';

type ActivityDragAndDrop = {
  handleDragStart: (
    e: React.DragEvent<Element>,
    index: number,
    dayId: number,
    activityId?: number,
  ) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, dropIndex: number) => void;
  draggedItem: DragItem | null;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  dragOverIndex: number | null;
  isDragging: (index: number) => boolean;
  isDragOver: (index: number) => boolean;
};

export type ActivityProps = {
//   activity: any;
  isDragging: (index: number) => boolean;
  index: number;
  isOpen: boolean;
  dayId: number;
};