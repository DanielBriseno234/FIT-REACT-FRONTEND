import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerUsuarioEspecifico } from "../../api/usuario";

export const useUsuario = (id: number) => {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["usuario", id],
        queryFn: () => obtenerUsuarioEspecifico(id),
        select: (response) => response.datos,
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const invalidateUsuario = () => {
        queryClient.invalidateQueries({ queryKey: ['usuario'] });
    };

    return {
        data,
        error,
        isLoading,
        refetch,
        invalidateUsuario
    };
};
