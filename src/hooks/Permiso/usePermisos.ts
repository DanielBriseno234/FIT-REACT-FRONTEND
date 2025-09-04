import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { obtenerPermisosPorRol } from "../../api/permisos";

export const usePermisos = (idRol: number) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["permisos", idRol],
        queryFn: () => obtenerPermisosPorRol(idRol),
        placeholderData: keepPreviousData,
        select: (response) => response.datos,
        enabled: !!idRol,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidatePermisos = () => {
        queryClient.invalidateQueries({ queryKey: ["permisos"] });
    }

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidatePermisos
    };
}