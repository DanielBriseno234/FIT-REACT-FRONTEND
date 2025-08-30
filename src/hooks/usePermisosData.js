import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { obtenerPermisosPorRol } from "../api/permisos";

/**
 * Hook para obtener permisos según el rol seleccionado.
 * Se dispara automáticamente cuando rolId es válido.
 * @param {number|string|null} rolId ID del rol seleccionado
 */
export const usePermisosData = (rolId) => {
    const permisosQuery = useQuery({
        queryKey: ["permisos", rolId],
        queryFn: async () => {
            const response = await obtenerPermisosPorRol(rolId);

            if (!response.success) {
                toast.error(response.mensaje || "Error al cargar los permisos");
                return [];
            }

            const formattedPermisos = response.datos.map((permiso) => ({
                value: permiso.idPermiso,
                label: permiso.descripcion,
                ...permiso,
            }));

            return {
                raw: response.datos,
                options: formattedPermisos,
            };
        },
        enabled: !!rolId, // solo ejecuta si hay un rol seleccionado
        staleTime: 0, // siempre fresco
        onError: () => {
            toast.error("Error al cargar los permisos");
        },
    });

    return {
        permisosOptions: permisosQuery.data?.options ?? [],
        permisos: permisosQuery.data?.raw ?? [],
        isLoading: permisosQuery.isLoading,
        error: permisosQuery.error,
        refetch: permisosQuery.refetch,
    };
};
