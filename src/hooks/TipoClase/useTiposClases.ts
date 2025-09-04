import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerTiposClase } from "../../api/tipoClase";

export const useTiposClases = (page: number, size: number, estatus: string, filtro: string) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["tiposclases", page, size, estatus, filtro],
        queryFn: () => obtenerTiposClase(page, size, estatus, filtro),
        placeholderData: keepPreviousData,
        select: (response) => response.datos,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateTiposClases = () => {
        queryClient.invalidateQueries({ queryKey: ['tiposclases'] });
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateTiposClases
    };
};
