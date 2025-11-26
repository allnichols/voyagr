import { GooglePlace } from "@/types/google-places";
import { TripActivity } from "@prisma/client";

export type GoogleImageProps = {
  placeId: number | string | null;
  width: number;
  height: number;
  place?: GooglePlace | TripActivity;
};

interface GooglePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

export type GoogleImageResponse = {
  result?: {
    photos?: GooglePhoto[];
  };
  error?: string;
};
