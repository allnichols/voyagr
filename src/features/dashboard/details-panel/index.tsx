"use client";
import { useDetailsDrawer } from "@/features/dashboard/store/detailsDrawer";

export default function DetailsPanel() {
  const isDetailsOpen = useDetailsDrawer((state) => state.isDetailsOpen);
  const toggleDetailsDrawer = useDetailsDrawer(
    (state) => state.toggleDetailsDrawer,
  );

  return (
    <>
      {/* Drawer */}
      <div
        className={`
          absolute top-0 right-0 bottom-0 w-[100%] h-[99%] 
          bg-white rounded-2xl shadow-2xl z-2000 transform transition-transform duration-300 ease-in-out 
          ${isDetailsOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <div className="p-4 border-b border-base-300">
          <button
            onClick={() => toggleDetailsDrawer()}
            className="btn btn-sm btn-ghost ml-auto flex"
            aria-label="Close drawer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Drawer content */}
        <div className="p-4">
          <ul className="menu">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
