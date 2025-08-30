import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerRoles } from "../api/rol";

export const useRoles = () => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["roles"],
        queryFn: () => obtenerRoles(),
        select: (response) => response.datos,
        staleTime: 1000 * 6 * 5,
        retry: false
    });

    const invalidateRoles = () => {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
    }

    const isFirstLoading = isLoading && !data;

    return {
        data,
        isLoading,
        isFirstLoading,
        error,
        refetch,
        invalidateRoles
    };
}