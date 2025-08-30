import type { RolOutputType } from "../interfaces/Rol/Rol";
import type { ApiResponse } from "../interfaces/Api/ApiResponse";
import { handleApiResponse } from "../helpers/handleApiResponse";

// Obtener los roles generales
export const obtenerRoles = async (): Promise<ApiResponse<RolOutputType[]>> => {
    return handleApiResponse<RolOutputType[]>("get", "/rol");
}