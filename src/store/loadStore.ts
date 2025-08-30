import { create } from "zustand";

interface LoadState {
    loading: boolean;
    loadingComponent: boolean;
    loadingGeneral: boolean;
    errorCarga: string | null;

    setLoading: (loading: boolean) => void;
    setLoadingComponent: (loadingComponent: boolean) => void;
    setLoadingGeneral: (loadingGeneral: boolean) => void;
    setErrorCarga: (errorCarga: string | null) => void;
}

export const useLoadStore = create<LoadState>((set) => ({
    loading: false,
    loadingComponent: false,
    loadingGeneral: false,
    errorCarga: null,

    setLoading: (loading) => set({ loading }),
    setLoadingComponent: (loadingComponent) => set({ loadingComponent }),
    setLoadingGeneral: (loadingGeneral) => set({ loadingGeneral }),
    setErrorCarga: (errorCarga) => set({ errorCarga }),
}));
