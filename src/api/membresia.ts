import { handleApiResponse } from "../helpers/handleApiResponse";
import type { ApiResponse } from "../interfaces/Api/ApiResponse";
import type { MembresiaOutputPaginated, MembresiaOutputType } from "../interfaces/membresia/Membresia";

// Obtener todas las membresias
export const obtenerMembresias = async (page = 0, size = 10, estatus = "ACTIVA", filtro = ""): Promise<ApiResponse<MembresiaOutputPaginated>> => {
    if (filtro.trim() !== "") {
        return handleApiResponse<MembresiaOutputPaginated>("get", "/membresias/buscar", {
            params: { page, size, estatus, filtro }
        });
    } else {
        return handleApiResponse<MembresiaOutputPaginated>("get", "/membresias", {
            params: { page, size, estatus }
        });
    }
}


// Registrar membresía

// Modificar membresía

// Obtener una membresía especifica
export const obtenerMembresiaEspecifica = async (id: number, signal?: AbortSignal): Promise<ApiResponse<MembresiaOutputType>> => {
    return handleApiResponse<MembresiaOutputType>("get", `/membresias/${id}`, {}, signal);
};

// Desactivar membresia
export const desactivarMembresia = async (id: number, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/membresias/${id}/desactivar`, {}, signal);
};

// Reactivar membresía
export const reactivarMembresia = async (id: number, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/membresias/${id}/activar`, {}, signal);
};