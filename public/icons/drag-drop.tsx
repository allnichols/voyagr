export function DragAndDropIndicator() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Drag and drop indicator"
    >
      {/* Left column */}
      <circle cx={7} cy={6} r={1.5} fill="currentColor" />
      <circle cx={7} cy={12} r={1.5} fill="currentColor" />
      <circle cx={7} cy={18} r={1.5} fill="currentColor" />
      {/* Right column */}
      <circle cx={17} cy={6} r={1.5} fill="currentColor" />
      <circle cx={17} cy={12} r={1.5} fill="currentColor" />
      <circle cx={17} cy={18} r={1.5} fill="currentColor" />
    </svg>
  );
}