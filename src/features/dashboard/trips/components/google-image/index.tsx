"use client";
import Image from "next/image";
import { GoogleImageProps, GoogleImageResponse } from "./types";
import { useQuery } from "@tanstack/react-query";

export default function GoogleImage({
  placeId,
  width,
  height,
}: GoogleImageProps) {
  const { data, isLoading, isError, isSuccess } = useQuery<GoogleImageResponse>(
    {
      queryKey: ["googleImage", placeId],
      queryFn: async () => {
        const res = await fetch(`/api/google-image?place_id=${placeId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch place photos");
        }

        return res.json();
      },
      enabled: !!placeId,
    },
  );

  if (isLoading) {
    return (
      <div
        className={`skeleton h-[${height}px] w-[${width}px] rounded`}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  }

  if (isError || !data?.result?.photos || data?.result?.photos.length == 0) {
    return (
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
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    );
  }

  if (isSuccess && data?.result?.photos.length > 0) {
    const photo = data.result.photos[0];
    const photoUrl = `/api/google-image/image?image_ref=${photo.photo_reference}`;

    return (
        <Image
          src={photoUrl}
          alt={"Place photo"}
          fill
          className="object-cover rounded"
          sizes="100vw"
          unoptimized
        />
    );
  }
}
