import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { obtenerNivelesAcceso } from "../../api/nivelAcceso";

export const useNivelesAcceso = (page: number, size: number, estatus: string, filtro: string) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["nivelesAcceso", page, size, estatus, filtro],
        queryFn: () => obtenerNivelesAcceso(page, size, estatus, filtro),
        placeholderData: keepPreviousData,
        select: (response) => response.datos,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateNivelesAcceso = () => {
        queryClient.invalidateQueries({ queryKey: ["nivelesAcceso"] });
    }

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateNivelesAcceso
    };
}