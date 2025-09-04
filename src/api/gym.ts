import { handleApiResponse } from '../helpers/handleApiResponse';
import type { ApiResponse } from '../interfaces/Api/ApiResponse';
import type { GimnasioInputType, GimnasioOutputPaginated, GimnasioOutputType } from '../interfaces/Gimnasio/Gimnasio';
import type { UsuarioListType } from '../interfaces/Usuario/Usuario';

// Obtener todos los gimnasios
export const obtenerGimnasios = async (page = 0, size = 10, estatus = 'ACTIVO', filtro = ''): Promise<ApiResponse<GimnasioOutputPaginated>> => {
    if (filtro.trim() !== "") {
        return handleApiResponse<GimnasioOutputPaginated>("get", "/gimnasios/buscar", {
            params: { page, size, estatus, filtro }
        })
    } else {
        return handleApiResponse<GimnasioOutputPaginated>("get", "/gimnasios", {
            params: { page, size, estatus }
        })
    }
};

// Obtener todos los gimnasios sin paginacion para selects
export const obtenerTodosGimnasios = async (): Promise<ApiResponse<UsuarioListType[]>> => {
    return handleApiResponse<UsuarioListType[]>("get", "/gimnasios/all", {});
}

// Buscar gimnasios
export const buscarGimnasio = async (page = 0, size = 10, estatus = 'ACTIVO', filtro = ''): Promise<ApiResponse<GimnasioOutputPaginated>> => {
    return handleApiResponse<GimnasioOutputPaginated>("get", "/gimnasios/buscar", {
        params: { page, size, estatus, filtro }
    })
};

// Crear gimnasio
export const crearGimnasio = async (gimnasioData: GimnasioInputType, signal?: AbortSignal): Promise<ApiResponse<GimnasioOutputType>> => {
    return handleApiResponse<GimnasioOutputType>("post", "/gimnasios", {
        body: gimnasioData
    }, signal);
};

// Obtener gimnasio específico
export const obtenerGimnasioEspecifico = async (id: number, signal?: AbortSignal): Promise<ApiResponse<GimnasioOutputType>> => {
    return handleApiResponse<GimnasioOutputType>("get", `/gimnasios/${id}`, {}, signal);
};

// Actualizar gimnasio
export const actualizarGimnasio = async (id: number, gimnasioData: GimnasioInputType, signal?: AbortSignal): Promise<ApiResponse<GimnasioOutputType>> => {
    return handleApiResponse<GimnasioOutputType>("put", `/gimnasios/${id}`, {
        body: gimnasioData
    }, signal);
};

// Eliminar gimnasio
export const eliminarGimnasio = async (id: number, signal?: AbortSignal): Promise<ApiResponse<GimnasioOutputType>> => {
    return handleApiResponse<GimnasioOutputType>("patch", `/gimnasios/${id}/desactivar`, {}, signal);
};


// Reactivar gimnasio
export const reactivarGimnasio = async (id: number, signal?: AbortSignal): Promise<ApiResponse<GimnasioOutputType>> => {
    return handleApiResponse<GimnasioOutputType>("patch", `/gimnasios/${id}/activar`, {}, signal);
};
