"use client";
import { useState } from "react";
import { MapIcon } from "@heroicons/react/24/outline";
import Map from "./index";

export default function MapToggle() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="md:hidden absolute top-[-40px] right-0 z-10">
      <button
        className="btn btn-primary btn-soft"
        onClick={() => setShowMap(!showMap)}
      >
        <MapIcon className="w-5 h-5" />
        {showMap ? "Hide Map" : "Show Map"}
      </button>
      {showMap && (
        <div className="absolute top-12 right-0 w-screen h-screen z-[9999]">
          <Map />
        </div>
      )}
    </div>
  );
}