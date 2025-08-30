import { create } from 'zustand';
import * as gymAPI from '../api/gym';
import { getErrorMessage } from '../helpers/errorHelper';
import type { GimnasioInputType, GimnasioItem, GimnasioOutputType } from '../interfaces/Gimnasio/Gimnasio';

type ResponseGymStore = {
    success: boolean
    mensaje: string
    datos?: GimnasioOutputType
}

type GymState = {
    gimnasios: GimnasioOutputType | GimnasioItem[] | []

    obtenerGimnasios: (page: number, size: number, estatus: string) => Promise<ResponseGymStore>
    buscarGimnasio: (page: number, size: number, estatus: string, filtro: string) => Promise<ResponseGymStore>
    obtenerGimnasioEspecifico: (id: number) => Promise<ResponseGymStore>
    crearGimnasio: (nuevoGimnasio: GimnasioInputType) => Promise<ResponseGymStore>
    actualizarGimnasio: (id: number, gimnasioActualizado: GimnasioInputType) => Promise<ResponseGymStore>
    eliminarGimnasio: (id: number) => Promise<ResponseGymStore>
    reactivarGimnasio: (id: number) => Promise<ResponseGymStore>
}

export const useGymStore = create<GymState>((set) => ({
    gimnasios: [],
    pagination: {
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 3
    },

    // Obtener todos los gimnasios
    obtenerGimnasios: async (page = 0, size = 3, estatus = 'ACTIVO') => {
        try {
            const result = await gymAPI.obtenerGimnasios(page, size, estatus);
            set({
                gimnasios: result.datos.content,
                // pagination: {
                //     currentPage: result.datos.number,
                //     totalPages: result.datos.totalPages,
                //     totalElements: result.datos.totalElements,
                //     pageSize: result.datos.size
                // }
            });
            return { success: true, mensaje: result.mensaje };
        } catch (error) {
            return { success: false, mensaje: getErrorMessage(error) };
        }
    },

    buscarGimnasio: async (page = 0, size = 3, estatus = 'ACTIVO', filtro = '') => {
        try {
            const result = await gymAPI.buscarGimnasio(page, size, estatus, filtro);
            set({
                gimnasios: result.datos.content,
                // pagination: {
                //     currentPage: result.datos.number,
                //     totalPages: result.datos.totalPages,
                //     totalElements: result.datos.totalElements,
                //     pageSize: result.datos.size
                // }
            });
            return { success: true, mensaje: result.mensaje };
        } catch (error) {
            return { success: false, mensaje: getErrorMessage(error) };
        }
    },

    //Obtener un gimnasio por su id
    obtenerGimnasioEspecifico: async (id) => {
        try {
            const result = await gymAPI.obtenerGimnasioEspecifico(id);
            return { success: true, mensaje: result.mensaje, datos: result.datos };
        } catch (error) {
            return { success: false, mensaje: getErrorMessage(error) };
        }
    },

    // Crear nuevo gimnasio
    crearGimnasio: async (nuevoGimnasio) => {
        try {
            const result = await gymAPI.crearGimnasio(nuevoGimnasio);
            await useGymStore.getState().obtenerGimnasios(0, 3, "ACTIVO");
            return { success: true, mensaje: result.mensaje };
        } catch (error) {
            return { success: false, mensaje: getErrorMessage(error) }
        }
    },

    // Actualizar gimnasio
    actualizarGimnasio: async (id, gimnasio) => {
        try {
            const result = await gymAPI.actualizarGimnasio(id, gimnasio);
            await useGymStore.getState().obtenerGimnasios(0, 3, "ACTIVO");
            return { success: false, mensaje: result.mensaje };
        } catch (error) {
            return { success: false, mensaje: getErrorMessage(error) };
        }
    },

    // Eliminar gimnasio
    eliminarGimnasio: async (id) => {
        try {
            const result = await gymAPI.eliminarGimnasio(id);
            await useGymStore.getState().obtenerGimnasios(0, 3, 'ACTIVO');
            return { success: true, mensaje: result.mensaje };
        } catch (error) {
            return { success: true, mensaje: getErrorMessage(error) };
        }
    },

    // Reactivar el gimnasio
    reactivarGimnasio: async (id) => {
        try {
            const result = await gymAPI.reactivarGimnasio(id);
            await useGymStore.getState().obtenerGimnasios(0, 3, 'ACTIVO');
            return { success: true, mensaje: result.mensaje };
        } catch (error) {
            return { success: true, mensaje: getErrorMessage(error) };
        }
    }
}));