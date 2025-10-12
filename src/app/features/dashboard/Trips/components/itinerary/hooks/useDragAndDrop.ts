import { useState, useRef } from "react";

interface DragItem {
  index: number;
  dayId: number;
  type: string;
}

interface DragAndDropProps {
  onReorder: (dragIndex: number, hoverIndex: number, type: string) => void;
  itemType: string;
}

export const useDragAndDrop = ({ itemType }: DragAndDropProps) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    index: number,
    dayId: number,
  ) => {
    const dragItem = { index, dayId, type: itemType };
    setDraggedItem(dragItem);

    e.dataTransfer.setData("text/plain", JSON.stringify(dragItem));
    e.dataTransfer.effectAllowed = "move";
    console.log("Drag Start", dragItem);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
    console.log("Drag Over", index, e.dataTransfer.getData("text/plain"));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Drag Enter");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Drag Leave");
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if(!data) return;

    const dragItem: DragItem = JSON.parse(data);
    if (dragItem && dragItem.type === itemType) {
      console.log("Drop", { dragItem, dropIndex });
      // Call the onReorder callback here if needed
      // onReorder(dragItem.index, dropIndex, itemType);
    }

    setDraggedItem(null);
    setDragOverIndex(null);
  }

  const isDragging = (index: number) => draggedItem?.index === index;
  const isDragOver = (index: number) => dragOverIndex === index;

  return {
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    draggedItem,
    handleDragOver,
    dragOverIndex,
    isDragging,
    isDragOver
  };
};