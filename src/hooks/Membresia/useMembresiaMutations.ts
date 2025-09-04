import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { desactivarMembresia, reactivarMembresia } from "../../api/membresia";

export const useMembresiaMutations = () => {
    const queryClient = useQueryClient();
    const controllerRef = useRef<AbortController | null>(null);

    // const addMembresiaMutation = useMutation({
    //     mutationFn: (data: MembresiaInputType) => {
    //         controllerRef.current = new AbortController();
    //         return crearMembresia(data)
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ['membresias'] });
    //     }
    // });

    // const updateMembresiaMutation = useMutation({
    //     mutationFn: ({ id, data }: { id: number; data: MembresiaInputType }) => {
    //         controllerRef.current = new AbortController();
    //         return actualizarMembresia(id, data)
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ['membresias'] });
    //     }
    // });

    const inactivateMembresiaMutation = useMutation({
        mutationFn: (id: number) => {
            controllerRef.current = new AbortController();
            return desactivarMembresia(id, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['membresias'] });
        }
    });

    const reactivateMembresiaMutation = useMutation({
        mutationFn: (id: number) => {
            controllerRef.current = new AbortController();
            return reactivarMembresia(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['membresias'] });
        }
    });

    return {
        // addMembresia: addMembresiaMutation.mutateAsync,
        // updateMembresia: updateMembresiaMutation.mutateAsync,
        inactivateMembresia: inactivateMembresiaMutation.mutateAsync,
        reactivateMembresia: reactivateMembresiaMutation.mutateAsync,
        // isAdding: addMembresiaMutation.isPending,
        // isUpdating: updateMembresiaMutation.isPending,
        isDeleting: inactivateMembresiaMutation.isPending,
        isReactivating: reactivateMembresiaMutation.isPending,
        controllerRef
    };
}