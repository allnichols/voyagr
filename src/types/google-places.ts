export interface GooglePlace {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  location: Location;
  priceLevel?: PriceLevel;
  types: string[];
  rating?: number;
  iconMaskBaseUri?: string;
  iconBackgroundColor?: string;
  userRatingCount?: number;
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
}

export type Location = {
  latitude: number;
  longitude: number;
};

export enum PriceLevel {
  UNSPECIFIED = "PRICE_LEVEL_UNSPECIFIED",
  FREE = "PRICE_LEVEL_FREE",
  INEXPENSIVE = "PRICE_LEVEL_INEXPENSIVE",
  MODERATE = "PRICE_LEVEL_MODERATE",
  EXPENSIVE = "PRICE_LEVEL_EXPENSIVE",
  VERY_EXPENSIVE = "PRICE_LEVEL_VERY_EXPENSIVE",
}

export interface GooglePlacesResponse {
  query: string;
  places: GooglePlace[];
}
