import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import type { TipoClaseInput } from "../../interfaces/TipoClase/TipoClase";
import { actualizarTipoClase, crearTipoClase, eliminarTipoClase, reactivarTipoClase } from "../../api/tipoClase";

export const useTipoClaseMutations = () => {
    const queryClient = useQueryClient();
    const controllerRef = useRef<AbortController | null>(null);

    const addTipoClaseMutation = useMutation({
        mutationFn: (data: TipoClaseInput) => {
            controllerRef.current = new AbortController();
            return crearTipoClase(data, controllerRef.current.signal)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiposclases'] });
        }
    });

    const updateTipoClaseMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: TipoClaseInput }) => {
            controllerRef.current = new AbortController();
            return actualizarTipoClase(id, data, controllerRef.current.signal)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiposclases'] });
        }
    });

    const deleteTipoClaseMutation = useMutation({
        mutationFn: (id: number) => {
            controllerRef.current = new AbortController();
            return eliminarTipoClase(id, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiposclases'] });
        }
    });

    const reactivateTipoClaseMutation = useMutation({
        mutationFn: (id: number) => {
            controllerRef.current = new AbortController();
            return reactivarTipoClase(id, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiposclases'] });
        }
    });

    return {
        addTipoClase: addTipoClaseMutation.mutateAsync,
        updateTipoClase: updateTipoClaseMutation.mutateAsync,
        deleteTipoClase: deleteTipoClaseMutation.mutateAsync,
        reactivateTipoClase: reactivateTipoClaseMutation.mutateAsync,
        isAdding: addTipoClaseMutation.isPending,
        isUpdating: updateTipoClaseMutation.isPending,
        isDeleting: deleteTipoClaseMutation.isPending,
        isReactivating: reactivateTipoClaseMutation.isPending,
        controllerRef
    };
}