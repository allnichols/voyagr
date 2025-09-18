import { create } from "zustand";

interface CurrentTripState {
    currentTripId: number | null;
    setCurrentTripId: (id: number | null) => void;
}

export const useCurrentTrip = create<CurrentTripState>((set) => ({
    currentTripId: null,
    setCurrentTripId: (id) => set({ currentTripId: id })
}))