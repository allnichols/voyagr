import { GooglePlace } from "@/types/google-places";

export type GoogleImageProps = {
    place: GooglePlace;
     width: number; 
     height: number;
}

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
}