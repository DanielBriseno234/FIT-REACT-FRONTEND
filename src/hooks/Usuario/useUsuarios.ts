import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { obtenerUsuarios } from "../../api/usuario";

export const useUsuarios = (page: number, size: number, estatus: string, filtro: string) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["usuarios", page, size, estatus, filtro],
        queryFn: () => obtenerUsuarios(page, size, estatus, filtro),
        placeholderData: keepPreviousData,
        select: (response) => response.datos,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateUsuarios = () => {
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateUsuarios
    };
}