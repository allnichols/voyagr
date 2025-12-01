"use client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { GoogleImageResponse } from "../../trips/components/google-image/types";

type ImageCarouselProps = {
  placeId: string | undefined | null;
};

export default function ImageCarousel({ placeId }: ImageCarouselProps) {
  const { data, isLoading, isError, isSuccess } = useQuery<GoogleImageResponse>(
    {
      queryKey: ["googleImages", placeId],
      queryFn: async () => {
        const res = await fetch(`/api/google-image?place_id=${placeId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch photos");
        }

        return res.json();
      },
      enabled: !!placeId,
    },
  );

  if (isLoading) {
    return <div className="skeleton h-full w-full" />;
  }

  if (isError) {
    return <div>Sorry no images</div>;
  }

  if (isSuccess && data?.result?.photos && data.result.photos.length > 0) {
    const images = data?.result?.photos;

    return (
      <div className="carousel w-full h-[300px]">
        {images?.map((img, idx) => {
          const imageSrc = `/api/google-image/image?image_ref=${img.photo_reference}`;

          return (
            <div
              id={`slide${idx + 1}`}
              key={img.photo_reference}
              className="carousel-item relative w-full h-[300px]"
            >
              <Image
                src={imageSrc}
                alt={"Place Photo"}
                fill
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href={`#slide${idx === 0 ? images.length : idx}`}
                  className="btn btn-circle"
                >
                  ❮
                </a>
                <a href={`#slide${idx === images.length - 1 ? 1 : idx + 2}`} className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          );
        })}
        {/* <div id="slide1" className="carousel-item relative w-full h-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
            className="w-full"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
            className="w-full"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
            className="w-full"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
            className="w-full"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide3" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div> */}
      </div>
    );
  }
}
