import { handleApiResponse } from '../helpers/handleApiResponse';
import type { NivelAccesoInputType, NivelAccesoOutput, NivelAccesoOutputPageble } from '../interfaces/NivelAcceso/NivelAcceso';
import type { ApiResponse } from '../interfaces/Api/ApiResponse';

export const obtenerNivelesAcceso = async (page = 0, size = 10, estatus = 'ACTIVO', filtro = "", idRol = '0'): Promise<ApiResponse<NivelAccesoOutputPageble>> => {
    if (filtro.trim() !== "") {
        return handleApiResponse<NivelAccesoOutputPageble>("get", "/niveles-acceso/buscar", {
            params: { page, size, estatus, idRol, filtro }
        });
    } else {
        return handleApiResponse<NivelAccesoOutputPageble>("get", "/niveles-acceso", {
            params: { page, size, estatus, idRol }
        });
    }
}

export const obtenerNivelAccesoEspecifico = async (id: number, signal?: AbortSignal): Promise<ApiResponse<NivelAccesoOutput>> => {
    return handleApiResponse<NivelAccesoOutput>("get", `/niveles-acceso/${id}`, {}, signal);
}

export const crearNivelAcceso = async (nivel: NivelAccesoInputType, signal?: AbortSignal): Promise<ApiResponse<NivelAccesoOutput>> => {
    return handleApiResponse<NivelAccesoOutput>("post", "/niveles-acceso", {
        body: nivel
    }, signal);
}

export const actualizarNivelAcceso = async (id: number, data: NivelAccesoInputType, signal?: AbortSignal): Promise<ApiResponse<NivelAccesoOutput>> => {
    return handleApiResponse<NivelAccesoOutput>("put", `/niveles-acceso/${id}`, {
        body: data
    }, signal);
}

export const desactivarNivelAcceso = async (id: number, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/niveles-acceso/${id}/desactivar-nivel`, {}, signal);
};

export const reactivarNivelAcceso = async (id: number, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse("put", `/niveles-acceso/${id}/activar-nivel`, {}, signal);
};