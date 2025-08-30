import type { ConfiguracionInputType, ConfiguracionOutputType } from '../interfaces/Configuracion/Configuracion';
import type { ApiResponse } from '../interfaces/Api/ApiResponse';
import { handleApiResponse } from '../helpers/handleApiResponse';

// Obtener la configuración
export const obtenerConfiguracion = async (): Promise<ApiResponse<ConfiguracionOutputType>> => {
  return handleApiResponse<ConfiguracionOutputType>("get", "/configuracion-inicial");
};

// Guardar la configuración
export const guardarConfiguracion = async (configuracionInicial: ConfiguracionInputType): Promise<ApiResponse<ConfiguracionOutputType>> => {
  return handleApiResponse<ConfiguracionOutputType>("post", "/configuracion-inicial", {
    body: configuracionInicial
  });
};

// Modificar la configuración
export const modificarConfig = async (configuracionInicial: ConfiguracionInputType): Promise<ApiResponse<ConfiguracionOutputType>> => {
  return handleApiResponse<ConfiguracionOutputType>("put", "/configuracion-inicial", {
    body: configuracionInicial
  });
};
