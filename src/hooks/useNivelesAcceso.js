import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    obtenerNivelesAcceso,
    obtenerNivelAccesoEspecifico,
    desactivarNivelAcceso,
    reactivarNivelAcceso,
    crearNivelAcceso,
    actualizarNivelAcceso
} from "../api/nivelAcceso";

export const useNivelesAcceso = ({ page, pageSize, estatus, onCloseModals, setEstatus }) => {
    const queryClient = useQueryClient();

    // Fetch con paginación y estatus
    const nivelesQuery = useQuery({
        queryKey: ["nivelesAcceso", { page, pageSize, estatus }],
        queryFn: async () => {
            const response = await obtenerNivelesAcceso(page, pageSize, estatus);
            if (!response.success) throw new Error(response.mensaje || "Error al cargar niveles de acceso");
            return response;
        },
        keepPreviousData: true,
    });

    // Helpers para factorizar repetición
    const mutationConfig = (successMsg, callback) => ({
        onSuccess: () => {
            toast.success(successMsg);
            onCloseModals();
            queryClient.invalidateQueries(["nivelesAcceso"]);
            callback?.();
        },
        onError: (error) => {
            toast.error(error.message);
            // onCloseModals?.();
        },
    });

    // Mutaciones CRUD
    const addNivel = useMutation({
        mutationFn: crearNivelAcceso,
        ...mutationConfig("Nivel registrado"),
    });

    const editNivel = useMutation({
        mutationFn: (nivel) => actualizarNivelAcceso(nivel.id, nivel),
        ...mutationConfig("Nivel modificado"),
    });

    const deactivateNivel = useMutation({
        mutationFn: desactivarNivelAcceso,
        ...mutationConfig("Nivel desactivado correctamente"),
    });

    const reactivateNivel = useMutation({
        mutationFn: reactivarNivelAcceso,
        ...mutationConfig("Nivel reactivado correctamente", () => setEstatus?.("ACTIVO")),
    });

    // Fetch específico (para edición)
    const getNivelById = async (id) => {
        const response = await obtenerNivelAccesoEspecifico(id);
        if (!response.success) throw new Error(response.mensaje);
        return response.datos;
    };

    return {
        nivelesQuery,
        addNivel,
        editNivel,
        deactivateNivel,
        reactivateNivel,
        getNivelById,
    };
};
