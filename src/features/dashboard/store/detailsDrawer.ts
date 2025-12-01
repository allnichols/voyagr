import { create } from 'zustand';

type DetailsDrawer = {
    isDetailsOpen: boolean;
    toggleDetailsDrawer: () => void;
}

export const useDetailsDrawer = create<DetailsDrawer>((set) => ({
    isDetailsOpen: false,
    toggleDetailsDrawer() {
        set((state) => ({ isDetailsOpen: !state.isDetailsOpen }))
    }
}))