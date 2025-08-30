import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { obtenerGimnasios } from "../api/gym";

export const useGimnasios = (page: number, size: number, estatus: string, filtro: string) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["gimnasios", page, size, estatus, filtro], // clave única
        queryFn: () => obtenerGimnasios(page, size, estatus, filtro), // sin parámetros extras
        placeholderData: keepPreviousData,
        select: (response) => response.datos,
        staleTime: 1000 * 60 * 5,
        retry: false,

    });

    const invalidateGimnasios = () => {
        queryClient.invalidateQueries({ queryKey: ['gimnasios'] });
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateGimnasios
    };
};
