import { handleApiResponse } from "../helpers/handleApiResponse";
import type { ApiResponse } from "../interfaces/Api/ApiResponse";
import type { PermisoOutputType } from "../interfaces/Permisos/Permisos";

// Obtener los permisos filtrados por rol
export const obtenerPermisosPorRol = async (idRol: number): Promise<ApiResponse<PermisoOutputType>> => {
    return handleApiResponse<PermisoOutputType>("get", "/permisos", {
        params: { idRol }
    })
}