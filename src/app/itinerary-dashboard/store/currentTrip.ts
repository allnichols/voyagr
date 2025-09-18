import { create } from "zustand";

interface CurrentTripState {
    currentTrip: {
        id: number | null;
        destination: string | null;
    };
    setCurrentTripId: (id: number | null, destination: string | null) => void;
}

export const useCurrentTrip = create<CurrentTripState>((set) => ({
    currentTrip: { id: null, destination: null },
    setCurrentTripId: (id, destination) => set((state) => ({
        currentTrip: { id, destination }
    })),
}));