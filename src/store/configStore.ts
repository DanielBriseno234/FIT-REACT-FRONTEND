import { create } from 'zustand';
import * as configAPI from '../api/config';
import { persist } from 'zustand/middleware';
import { aplicarColoresAlDocumento } from '../helpers/colorHelper';
import type { ColoresType, ConfiguracionInputType } from '../interfaces/Configuracion/Configuracion';
import type { ConfiguracionOutputType } from '../interfaces/Configuracion/Configuracion';
import { getErrorMessage } from '../helpers/errorHelper';

//Define la respuesta del Store
type ResponseConfigStore = {
    success: boolean
    mensaje: string
    datos?: ConfiguracionOutputType
}

// Define la forma del store
type ConfigState = {
    configuracion: ConfiguracionOutputType | null;

    cargarConfig: () => Promise<ResponseConfigStore>;
    guardarConfig: (configuracionInicial: ConfiguracionInputType) => Promise<ResponseConfigStore>;
    modificarConfig: (configuracionInicial: ConfiguracionInputType) => Promise<ResponseConfigStore>;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            configuracion: null,

            cargarConfig: async () => {
                try {
                    const result = await configAPI.obtenerConfiguracion();

                    const { mensaje, datos } = result;

                    set({
                        configuracion: datos
                    })

                    return { success: true, mensaje: mensaje, datos: datos };
                } catch (error: unknown) {
                    throw new Error(getErrorMessage(error));
                }
            },
            guardarConfig: async (configuracionInicial: ConfiguracionInputType) => {

                try {
                    const result = await configAPI.guardarConfiguracion(configuracionInicial);

                    const { datos, mensaje } = result;

                    set({
                        configuracion: datos
                    });

                    const colores: ColoresType = {
                        colorPrimario: datos.colorPrimario || "#170BF4",
                        colorSecundario: datos.colorSecundario || "#3127F5",
                        colorExito: datos.colorExito || "#02A314",
                        colorError: datos.colorError || "#A30702",
                        colorDegradadoDe: datos.colorDegradadoDe || "#170BF4",
                        colorDegradadoHacia: datos.colorDegradadoHacia || "#0F079C"
                    }

                    aplicarColoresAlDocumento(colores);

                    return { success: true, mensaje: mensaje };
                } catch (error) {
                    throw new Error(getErrorMessage(error));
                }
            },

            modificarConfig: async (configuracionInicial: ConfiguracionInputType) => {
                const result = await configAPI.modificarConfig(configuracionInicial);

                try {
                    const { datos, mensaje } = result;

                    set({
                        configuracion: datos
                    });

                    const colores: ColoresType = {
                        colorPrimario: datos.colorPrimario || "#170BF4",
                        colorSecundario: datos.colorSecundario || "#3127F5",
                        colorExito: datos.colorExito || "#02A314",
                        colorError: datos.colorError || "#A30702",
                        colorDegradadoDe: datos.colorDegradadoDe || "#170BF4",
                        colorDegradadoHacia: datos.colorDegradadoHacia || "#0F079C"
                    }

                    aplicarColoresAlDocumento(colores);

                    return { success: true, mensaje: mensaje };
                } catch (error) {
                    throw new Error(getErrorMessage(error));
                }
            }
        }),
        {
            name: 'config-storage',
        }
    )
);
