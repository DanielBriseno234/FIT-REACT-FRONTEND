import { handleApiResponse } from '../helpers/handleApiResponse';
import type { ApiResponse } from '../interfaces/Api/ApiResponse';
import type { UsuarioCambiarContrasena, UsuarioInputType, UsuarioInputUpdateType, UsuarioNotificationType, UsuarioOutputPaginated, UsuarioOutputType } from '../interfaces/Usuario/Usuario';

// Obtener todos los usuarios
export const obtenerUsuarios = async (page = 0, size = 10, estatus = 'ACTIVO', filtro = ''): Promise<ApiResponse<UsuarioOutputPaginated>> => {
    if (filtro.trim() !== "") {
        return handleApiResponse<UsuarioOutputPaginated>("get", "/usuarios/buscar", {
            params: { page, size, estatus, filtro }
        })
    } else {
        return handleApiResponse<UsuarioOutputPaginated>("get", "/usuarios", {
            params: { page, size, estatus }
        })
    }
};

// Registrar usuario
export const crearUsuario = async (usuarioData: UsuarioInputType, signal?: AbortSignal): Promise<ApiResponse<UsuarioOutputType>> => {
    return handleApiResponse<UsuarioOutputType>("post", "/usuarios/registro", {
        body: usuarioData
    }, signal);
}

// Modificar usuario
export const actualizarUsuario = async (id: number, usuarioData: UsuarioInputUpdateType, signal?: AbortSignal): Promise<ApiResponse<UsuarioOutputType>> => {
    return handleApiResponse<UsuarioOutputType>("put", `/usuarios/${id}`, {
        body: usuarioData
    }, signal);
}

// Obtener usuario específico
export const obtenerUsuarioEspecifico = async (id: number, signal?: AbortSignal): Promise<ApiResponse<UsuarioOutputType>> => {
    return handleApiResponse<UsuarioOutputType>("get", `/usuarios/${id}`, {}, signal);
};

// Eliminar usuario
export const eliminarUsuario = async (id: number, data: UsuarioNotificationType, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/usuarios/${id}/desactivar`, {
        body: data
    }, signal);
};

// Reactivar usuario
export const reactivarUsuario = async (id: number, data: UsuarioNotificationType, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/usuarios/${id}/reactivar`, {
        body: data
    }, signal);
};

// Bloquear usuario
export const bloquearUsuario = async (id: number, data: UsuarioNotificationType, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/usuarios/${id}/bloquear`, {
        body: data
    }, signal);
};

// Cambiar contraseña
export const cambiarContrasena = async (id: number, data: UsuarioCambiarContrasena, signal?: AbortSignal): Promise<ApiResponse<[]>> => {
    return handleApiResponse<[]>("put", `/usuarios/${id}/cambiar-contrasena`, {
        body: data
    }, signal);
}