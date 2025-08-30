import type { ApiResponse } from '../interfaces/Api/ApiResponse';
import { handleApiResponse } from '../helpers/handleApiResponse';
import type { UsuarioOutputType } from '../interfaces/Usuario/Usuario';

// Iniciar Sesión
export const login = async (email: string, contrasena: string) => {
  return handleApiResponse<UsuarioOutputType>("post", "/auth/login", {
    body: { email, contrasena }
  });
}

// Cerrar Sesión
export const logout = async (refreshToken: string): Promise<ApiResponse<[]>> => {
  return handleApiResponse<[]>("post", "/auth/logout", {
    body: { refreshToken }
  });
}

// Solicitar un nuevo token
export const refreshToken = async (refreshToken: string): Promise<ApiResponse<string>> => {
  return handleApiResponse<string>("post", "/auth/refresh-token", {
    body: { refreshToken }
  });
}

// Verificar la cuenta del usuario
export const verificarCuenta = async (token: string): Promise<ApiResponse<[]>> => {
  return handleApiResponse<[]>("get", `/verificacion-usuario/${token}`);
}

// Solicitud para recuperar la contraseña
export const solicitudRecuperarContrasena = async (email: string): Promise<ApiResponse<[]>> => {
  return handleApiResponse<[]>("post", "/recuperacion-contrasena", {
    body: { email }
  });
}

// Verificar si el token de recuperacion es valido
export const verificarTokenRecuperacionContrasena = async (token: string): Promise<ApiResponse<[]>> => {
  return handleApiResponse<[]>("get", `/recuperacion-contrasena/${token}`);
}

// Recuperacion de contraseña
export const recuperarContrasena = async (token: string, nuevaContrasena: string, confirmacionContrasena: string): Promise<ApiResponse<[]>> => {
  return handleApiResponse<[]>("put", `/recuperacion-contrasena/${token}`, {
    body: { nuevaContrasena, confirmacionContrasena }
  });
}