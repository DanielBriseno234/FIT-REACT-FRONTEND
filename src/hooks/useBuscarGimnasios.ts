import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { buscarGimnasio } from "../api/gym";

export const useBuscarGimnasios = (page: number, size: number, estatus: string, filtro: string) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["buscar-gimnasios", page, size, estatus, filtro], // cambia si cambia el filtro
        queryFn: () => buscarGimnasio(page, size, estatus, filtro),
        select: (response) => response.datos, // igual que en useGimnasios
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
        retry: false,
        enabled: filtro.trim().length > 0, // solo busca si hay filtro
    });

    const invalidateBuscar = () => {
        queryClient.invalidateQueries({ queryKey: ["buscar-gimnasios"] });
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateBuscar,
    };
};
