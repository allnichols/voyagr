import { TripActivity } from "@prisma/client";

export const mockActivity: TripActivity = {
  id: 1,
  tripDayId: 1,
  position: 1,
  timeOfDay: "",
  place: "A Great Place",
  gPlaceId: "1234",
  address: "Great Place St",
  iconMask: "asdf",
  rating: 4,
  priceLevel: "",
  userRatingCount: 1000,
  currentOpeningHours: 2,
  internationalPhoneNumber: "123-123-123",
  nationalPhoneNumber: null,
  websiteUri: null,
  types: "",
  latitude: 1.2,
  longitude: 1.4,
  createdAt: new Date(),
};