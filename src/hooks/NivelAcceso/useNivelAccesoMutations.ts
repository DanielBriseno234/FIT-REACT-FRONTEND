import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NivelAccesoInputType } from "../../interfaces/NivelAcceso/NivelAcceso";
import { useRef } from "react";
import { actualizarNivelAcceso, crearNivelAcceso, desactivarNivelAcceso, reactivarNivelAcceso } from "../../api/nivelAcceso";

export const useNivelAccesoMutations = () => {
    const queryClient = useQueryClient();
    const controllerRef = useRef<AbortController | null>(null);

    const addNivelAccesoMutation = useMutation({
        mutationFn: (data: NivelAccesoInputType) => {
            controllerRef.current = new AbortController();
            return crearNivelAcceso(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nivelesAcceso'] });
        }
    });

    const updateNivelAccesoMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: NivelAccesoInputType }) => {
            controllerRef.current = new AbortController();
            return actualizarNivelAcceso(id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nivelesAcceso'] });
        }
    });

    const deleteNivelAccesoMutation = useMutation({
        mutationFn: (id: number) => {
            controllerRef.current = new AbortController();
            return desactivarNivelAcceso(id, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nivelesAcceso'] });
        }
    });

    const reactivateNivelAccesoMutation = useMutation({
        mutationFn: (id: number) => {
            controllerRef.current = new AbortController();
            return reactivarNivelAcceso(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nivelesAcceso'] });
        }
    });

    return {
        addNivelAcceso: addNivelAccesoMutation.mutateAsync,
        updateNivelAcceso: updateNivelAccesoMutation.mutateAsync,
        deleteNivelAcceso: deleteNivelAccesoMutation.mutateAsync,
        reactivateNivelAcceso: reactivateNivelAccesoMutation.mutateAsync,
        isAdding: addNivelAccesoMutation.isPending,
        isUpdating: updateNivelAccesoMutation.isPending,
        isDeleting: deleteNivelAccesoMutation.isPending,
        isReactivating: reactivateNivelAccesoMutation.isPending,
        controllerRef
    };
}