import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { actualizarUsuario, bloquearUsuario, cambiarContrasena, crearUsuario, eliminarUsuario, reactivarUsuario } from "../../api/usuario";
import type { UsuarioCambiarContrasena, UsuarioInputType, UsuarioInputUpdateType, UsuarioNotificationType } from '../../interfaces/Usuario/Usuario';

export const useUsuarioMutations = () => {
    const queryClient = useQueryClient();
    const controllerRef = useRef<AbortController | null>(null);

    const addUsuarioMutation = useMutation({
        mutationFn: (data: UsuarioInputType) => {
            controllerRef.current = new AbortController();
            return crearUsuario(data, controllerRef.current.signal)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        }
    });

    const updateUsuarioMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UsuarioInputUpdateType }) => {
            controllerRef.current = new AbortController();
            return actualizarUsuario(id, data, controllerRef.current.signal)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        }
    });

    const deleteUsuarioMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UsuarioNotificationType }) => {
            controllerRef.current = new AbortController();
            return eliminarUsuario(id, data, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        }
    });

    const reactivateUsuarioMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UsuarioNotificationType }) => {
            controllerRef.current = new AbortController();
            return reactivarUsuario(id, data, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        }
    });

    const blockUsuarioMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UsuarioNotificationType }) => {
            controllerRef.current = new AbortController();
            return bloquearUsuario(id, data, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        }
    });

    const changePassUsuarioMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UsuarioCambiarContrasena }) => {
            controllerRef.current = new AbortController();
            return cambiarContrasena(id, data, controllerRef.current.signal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        }
    });

    return {
        addUsuario: addUsuarioMutation.mutateAsync,
        updateUsuario: updateUsuarioMutation.mutateAsync,
        deleteUsuario: deleteUsuarioMutation.mutateAsync,
        reactivateUsuario: reactivateUsuarioMutation.mutateAsync,
        blockUsuario: blockUsuarioMutation.mutateAsync,
        changePassUsuario: changePassUsuarioMutation.mutateAsync,
        isAdding: addUsuarioMutation.isPending,
        isUpdating: updateUsuarioMutation.isPending,
        isDeleting: deleteUsuarioMutation.isPending,
        isReactivating: reactivateUsuarioMutation.isPending,
        isBlocking: blockUsuarioMutation.isPending,
        isChangingPass: changePassUsuarioMutation.isPending,
        controllerRef
    };
}