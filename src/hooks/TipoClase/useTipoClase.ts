import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerTipoClaseEspecifico } from "../../api/tipoClase";

export const useTipoClase = (id: number) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["tipoclase", id],
        queryFn: () => obtenerTipoClaseEspecifico(id),
        select: (response) => response.datos,
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateTipoClase = () => {
        queryClient.invalidateQueries({ queryKey: ['tipoclase'] });
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateTipoClase
    };
};
