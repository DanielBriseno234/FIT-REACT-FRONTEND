import httpClient from "../api/httpClient";
import type { ApiResponse } from "../interfaces/Api/ApiResponse";

interface ApiCallOptions {
  body?: unknown;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// Error estructurado
class ApiException extends Error {
  estatus: "error" | "cancelled";
  fechaEjecucion: string;

  constructor(estatus: "error" | "cancelled", mensaje: string, fechaEjecucion?: string) {
    super(mensaje);
    this.estatus = estatus;
    this.fechaEjecucion = fechaEjecucion || new Date().toISOString();
  }
}

// Función genérica para peticiones
export const handleApiResponse = async <T>(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  options: ApiCallOptions = {},
  signal?: AbortSignal
): Promise<ApiResponse<T>> => {
  const { body, params, headers } = options;

  try {
    const { data } = await httpClient.request<ApiResponse<T>>({
      method,
      url,
      data: body,     // POST/PUT
      params,        // GET con query strings
      headers,       // auth tokens, etc.
      signal
    });

    return data;
  } catch (error: any) {
    // Error de red (no conecta al servidor)
    if (error?.code === "ERR_NETWORK") {
      throw new ApiException("error", "No se pudo conectar con el servidor");
    }

    if (error?.code === "ERR_CANCELED") {
      throw new ApiException("cancelled", "Proceso cancelado");
    }

    // Error con respuesta del servidor
    if (error.response) {
      const { data } = error.response as { data: ApiResponse<any> };
      throw new ApiException("error", data?.mensaje || "Error en el servidor", data?.fechaEjecucion);
    }

    // Error inesperado
    throw new ApiException("error", "Error inesperado");
  }
};
