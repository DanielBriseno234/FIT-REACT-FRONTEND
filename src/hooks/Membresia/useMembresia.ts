import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerMembresiaEspecifica } from "../../api/membresia";

export const useMembresia = (id: number) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["membresia", id],
        queryFn: () => obtenerMembresiaEspecifica(id),
        select: (response) => response.datos,
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateMembresia = () => {
        queryClient.invalidateQueries({ queryKey: ['membresia'] });
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateMembresia
    };
};
