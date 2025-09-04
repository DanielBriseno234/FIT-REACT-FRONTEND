import { QueryClient, useQuery, keepPreviousData } from "@tanstack/react-query";
import { obtenerMembresias } from "../../api/membresia";

export const useMembresias = (page: number, size: number, estatus: string, filtro: string) => {
    const queryClient = new QueryClient();

    const {
        data,
        error,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["membresias", page, size, estatus, filtro],
        queryFn: () => obtenerMembresias(page, size, estatus, filtro),
        placeholderData: keepPreviousData,
        select: (response) => response.datos,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateMembresias = () => {
        queryClient.invalidateQueries({ queryKey: ["membresias"] })
    }

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateMembresias
    };
}