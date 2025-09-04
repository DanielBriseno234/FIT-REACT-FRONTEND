import { handleApiResponse } from '../helpers/handleApiResponse';
import type { ApiResponse } from '../interfaces/Api/ApiResponse';
import type { TipoClaseInput, TipoClaseOutput, TipoClaseOutputPaginated } from '../interfaces/TipoClase/TipoClase';

// Obtener todos los TiposClase
export const obtenerTiposClase = async (page = 0, size = 10, estatus = 'ACTIVO', filtro = ''): Promise<ApiResponse<TipoClaseOutputPaginated>> => {
    if (filtro.trim() !== "") {
        return handleApiResponse<TipoClaseOutputPaginated>("get", "/tipos-clase/buscar", {
            params: { page, size, estatus, filtro }
        })
    } else {
        return handleApiResponse<TipoClaseOutputPaginated>("get", "/tipos-clase", {
            params: { page, size, estatus }
        })
    }
};

// Registrar Tipo Clase
export const crearTipoClase = async (data: TipoClaseInput, signal?: AbortSignal): Promise<ApiResponse<TipoClaseOutput>> => {
    return handleApiResponse<TipoClaseOutput>("post", "/tipos-clase", {
        body: data
    }, signal);
}

// Modificar Tipo Clase
export const actualizarTipoClase = async (id: number, data: TipoClaseInput, signal?: AbortSignal): Promise<ApiResponse<TipoClaseOutput>> => {
    return handleApiResponse<TipoClaseOutput>("put", `/tipos-clase/${id}`, {
        body: data
    }, signal);
}

// Obtener Tipo Clase específico
export const obtenerTipoClaseEspecifico = async (id: number, signal?: AbortSignal): Promise<ApiResponse<TipoClaseOutput>> => {
    return handleApiResponse<TipoClaseOutput>("get", `/tipos-clase/${id}`, {}, signal);
};

// Eliminar Tipo Clase
export const eliminarTipoClase = async (id: number, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/tipos-clase/${id}/desactivar`, {}, signal);
};

// Reactivar Tipo Clase
export const reactivarTipoClase = async (id: number, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/tipos-clase/${id}/activar`, {}, signal);
};
