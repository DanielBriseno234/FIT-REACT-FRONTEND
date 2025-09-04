import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerNivelAccesoEspecifico } from "../../api/nivelAcceso";

export const useNivelAcceso = (id: number) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["nivelAcceso", id],
        queryFn: () => obtenerNivelAccesoEspecifico(id),
        select: response => response.datos,
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateNivelAcceso = () => {
        queryClient.invalidateQueries({ queryKey: ["nivelAcceso"] })
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateNivelAcceso
    };
}