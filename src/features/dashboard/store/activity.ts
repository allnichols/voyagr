import { create } from 'zustand';

type CurrentActivity = {
    currentActivity: {
        id: number | null
    }
    setCurrentActivity: (id: number | null) => void;
}

export const useCurrentActivity = create<CurrentActivity>((set) => ({
    currentActivity: { id: null },
    setCurrentActivity(id) {
        set(() => ({
            currentActivity: { id },
        }))
    },
}))