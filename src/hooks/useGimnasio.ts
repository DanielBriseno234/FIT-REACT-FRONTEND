import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerGimnasioEspecifico } from "../api/gym";

export const useGimnasio = (id: number) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["gimnasio", id],
        queryFn: () => obtenerGimnasioEspecifico(id),
        select: (response) => response.datos,
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateGimnasio = () => {
        queryClient.invalidateQueries({ queryKey: ['gimnasio'] });
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateGimnasio
    };
};
