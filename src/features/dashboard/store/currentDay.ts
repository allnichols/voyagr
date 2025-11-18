import { create } from "zustand";

interface CurrentTripDay {
  currentDay: {
    id: number | null;
  };
  setCurrentDay: (id: number) => void;
}

export const useCurrentDay = create<CurrentTripDay>((set) => ({
  currentDay: { id: null },
  setCurrentDay: (id) =>
    set(() => ({
      currentDay: { id },
    })),
}));
