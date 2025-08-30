import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GimnasioInputType } from "../interfaces/Gimnasio/Gimnasio";
import { actualizarGimnasio, crearGimnasio, eliminarGimnasio, reactivarGimnasio } from "../api/gym";
import { useRef } from "react";

export const useGimnasioMutations = () => {
    const queryClient = useQueryClient();
    const controllerRef = useRef<AbortController | null>(null);

    const addGimnasioMutation = useMutation({
        mutationFn: (data: GimnasioInputType) => {
            controllerRef.current = new AbortController();
            return crearGimnasio(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gimnasios'] });
        }
    });

    const updateGimnasioMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: GimnasioInputType }) => {
            controllerRef.current = new AbortController();
            return actualizarGimnasio(id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gimnasios'] });
        }
    });

    const deleteGimnasioMutation = useMutation({
        mutationFn: (id: number) => {
            controllerRef.current = new AbortController();
            return eliminarGimnasio(id, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gimnasios'] });
        }
    });

    const reactivateGimnasioMutation = useMutation({
        mutationFn: (id: number) => {
            controllerRef.current = new AbortController();
            return reactivarGimnasio(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gimnasios'] });
        }
    });

    return {
        addGimnasio: addGimnasioMutation.mutateAsync,
        updateGimnasio: updateGimnasioMutation.mutateAsync,
        deleteGimnasio: deleteGimnasioMutation.mutateAsync,
        reactivateGimnasio: reactivateGimnasioMutation.mutateAsync,
        isAdding: addGimnasioMutation.isPending,
        isUpdating: updateGimnasioMutation.isPending,
        isDeleting: deleteGimnasioMutation.isPending,
        isReactivating: reactivateGimnasioMutation.isPending,
        controllerRef
    };
}