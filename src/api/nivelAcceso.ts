import { handleApiResponse } from '../helpers/handleApiResponse';
import type { NivelAccesoInputType, NivelAccesoOutput, NivelAccesoOutputPageble } from '../interfaces/NivelAcceso/NivelAcceso';
import type { ApiResponse } from '../interfaces/Api/ApiResponse';

export const obtenerNivelesAcceso = async (page = 0, size = 10, estatus = 'ACTIVO', idRol = '0'): Promise<ApiResponse<NivelAccesoOutputPageble>> => {
    return handleApiResponse<NivelAccesoOutputPageble>("get", "/niveles-acceso", {
        params: { page, size, estatus, idRol }
    });
}

export const obtenerNivelAccesoEspecifico = async (id: number): Promise<ApiResponse<NivelAccesoOutput>> => {
    return handleApiResponse<NivelAccesoOutput>("get", `/niveles-acceso/${id}`);
}

export const crearNivelAcceso = async (nivel: NivelAccesoInputType): Promise<ApiResponse<NivelAccesoOutput>> => {
    return handleApiResponse<NivelAccesoOutput>("post", "/niveles-acceso", {
        body: nivel
    });
}

export const actualizarNivelAcceso = async (id: number, data: NivelAccesoInputType): Promise<ApiResponse<NivelAccesoOutput>> => {
    return handleApiResponse<NivelAccesoOutput>("put", `/niveles-acceso/${id}`, {
        body: data
    });
}

export const desactivarNivelAcceso = async (id: number): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/niveles-acceso/${id}/desactivar-nivel`);
};

export const reactivarNivelAcceso = async (id: number): Promise<ApiResponse<[]>> => {
    return handleApiResponse("patch", `/niveles-acceso/${id}/activar-nivel`);
};