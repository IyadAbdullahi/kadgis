import { create } from 'zustand';

type SnackVariant = 'success' | 'danger' | 'info';

interface GlobalState {
    isLoading: boolean;
    snackMessage: string | null;
    snackVariant: SnackVariant;
    showLoader: () => void;
    hideLoader: () => void;
    showSnack: (message: string, variant?: SnackVariant) => void;
    hideSnack: () => void;
}

export const useActivityStore = create<GlobalState>((set) => ({
    isLoading: false,
    snackMessage: null,
    snackVariant: 'info', // Default variant
    showLoader: () => set({ isLoading: true }),
    hideLoader: () => set({ isLoading: false }),
    showSnack: (message: string, variant: SnackVariant = 'info') => {
        set({ snackMessage: message, snackVariant: variant });
        setTimeout(() => set({ snackMessage: null }), 6000); // Auto-hide after 3 seconds
    },
    hideSnack: () => set({ snackMessage: null }),
}));