// hooks/useRolesData.js
import { useQuery } from "@tanstack/react-query";
import { obtenerRoles } from "../api/rol";

export const useRolesData = () => {
    const rolesQuery = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const response = await obtenerRoles();
            if (!response.success) {
                throw new Error(response.mensaje || "Error al cargar los roles");
            }

            const formattedRoles = response.datos.map((rol) => ({
                value: rol.id,
                label: rol.nombre,
                ...rol,
            }));

            return {
                raw: response.datos,
                options: formattedRoles,
            };
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    return {
        rolesOptions: rolesQuery.data?.options ?? [],
        roles: rolesQuery.data?.raw ?? [],
        isLoading: rolesQuery.isLoading,
        error: rolesQuery.error,
        refetch: rolesQuery.refetch,
    };
};
