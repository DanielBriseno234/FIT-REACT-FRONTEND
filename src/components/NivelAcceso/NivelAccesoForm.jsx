import { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Select from "react-select";
import { motion } from "framer-motion";
import { FaTimes, FaSave } from "react-icons/fa";
import { toast } from "react-hot-toast";

import { useRolesData } from "../../hooks/useRolesData";
import { usePermisosData } from "../../hooks/usePermisosData";

import CancelButton from "../Utiles/Botones/CancelButton";
import NormalButton from "../Utiles/Botones/NormalButton";
import { InputField } from "../Utiles/Formulario/InputField";
import { TextareaField } from "../Utiles/Formulario/TextareaField";


// ----- Constantes -----
const FORM_DEFAULT_VALUES = {
    nombre: "",
    descripcion: "",
    rol: null,
    permisos: [],
};

const VALIDATION_RULES = {
    rol: { required: "Debes seleccionar un rol" },
    permisos: {
        validate: (value) => value?.length > 0 || "Se requiere al menos un permiso",
    },
};

const ANIMATION_VARIANTS = {
    delayedSection: (delay) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay },
    }),
};

// ----- Componentes internos -----
const FormSection = ({ title, children, delay = 0 }) => (
    <motion.div
        {...ANIMATION_VARIANTS.delayedSection(delay)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
            {title}
        </h2>
        {children}
    </motion.div>
);

const RolSelector = ({ control, rolesOptions, isLoading, disabled, onRolChange, errorGlobal }) => (
    <Controller
        name="rol"
        control={control}
        rules={VALIDATION_RULES.rol}
        render={({ field, fieldState: { error } }) => (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol asociado <span className="text-red-500">*</span>
                </label>
                <Select
                    {...field}
                    options={rolesOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Selecciona un rol..."
                    isClearable
                    isLoading={isLoading}
                    isDisabled={disabled || isLoading}
                    noOptionsMessage={() => "No hay roles disponibles"}
                    onChange={(selected) => {
                        field.onChange(selected);
                        onRolChange?.(selected);
                    }}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                {errorGlobal && <p className="mt-1 text-sm text-red-600">{errorGlobal}</p>}
            </div>
        )}
    />
);

const PermisosSelector = ({
    control,
    permisosOptions,
    isLoading,
    rolSeleccionado,
    disabled,
    errorGlobal,
}) => {
    const placeholder = !rolSeleccionado
        ? "Seleccione un rol para ver los permisos"
        : isLoading
            ? "Cargando permisos..."
            : "Seleccione los permisos para el rol";

    const helpText = rolSeleccionado
        ? `Permisos disponibles para el rol ${rolSeleccionado.label}`
        : "Selecciona un rol para ver sus permisos disponibles";

    return (
        <Controller
            name="permisos"
            control={control}
            rules={VALIDATION_RULES.permisos}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Permisos <span className="text-red-500">*</span>
                    </label>
                    <Select
                        {...field}
                        isMulti
                        options={permisosOptions}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder={placeholder}
                        closeMenuOnSelect={false}
                        isLoading={isLoading}
                        isDisabled={disabled || !rolSeleccionado}
                        noOptionsMessage={() => "No hay permisos disponibles"}
                    />
                    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                    {errorGlobal && <p className="mt-1 text-sm text-red-600">{errorGlobal}</p>}
                    <p className="text-sm text-gray-500 mt-2">{helpText}</p>
                </div>
            )}
        />
    );
};

const ActionButtons = ({ onCancel, isSubmitting, isFormReady }) => (
    <motion.div
        {...ANIMATION_VARIANTS.delayedSection(0.2)}
        className="flex justify-end gap-4 pt-4"
    >
        <CancelButton
            type="button"
            onClick={onCancel}
            icon={<FaTimes className="mr-2" />}
            text="Cancelar"
            variant="secondary"
            className="px-6 py-3"
            tooltip="Cancelar"
        />
        <NormalButton
            type="submit"
            icon={<FaSave className="mr-2" />}
            text={isSubmitting ? "Guardando..." : "Guardar"}
            variant="primary"
            disabled={isSubmitting || !isFormReady}
            className="px-6 py-3"
            tooltip="Guardar"
        />
    </motion.div>
);

// ----- Componente principal -----
const NivelAccesoForm = ({
    nivelAccesoExistente = null,
    onAdd = () => { },
    onEdit = () => { },
    onCancel = () => { },
}) => {
    // Roles: carga automática
    const {
        rolesOptions,
        isLoading: rolesLoading,
        error: rolesError,
        refetch: refetchRoles,
    } = useRolesData();

    const methods = useForm({ defaultValues: FORM_DEFAULT_VALUES, mode: "onBlur" });
    const { handleSubmit, control, watch, setValue, reset } = methods;

    const rolSeleccionado = watch("rol");
    const rolId = rolSeleccionado?.value ?? null;

    // Permisos: query dependiente del rol
    const {
        permisosOptions,
        isLoading: permisosLoading,
        error: permisosError,
        refetch: refetchPermisos,
    } = usePermisosData(rolId);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = Boolean(nivelAccesoExistente);
    const isFormReady = !rolesLoading && !permisosLoading && !!rolSeleccionado;

    // Prefill en modo edición (primero rol y campos base)
    useEffect(() => {
        if (!isEditMode || rolesLoading || !rolesOptions?.length) return;

        const { nombre, descripcion, rol } = nivelAccesoExistente || {};
        const selectedRol =
            rolesOptions.find((r) => r.value === rol?.id) ||
            null;

        reset({
            nombre: nombre || "",
            descripcion: descripcion || "",
            rol: selectedRol,
            permisos: [],
        });
    }, [isEditMode, nivelAccesoExistente, rolesLoading, rolesOptions, reset]);

    // Cuando hay rol (y permisos cargados), setear permisos del existente
    useEffect(() => {
        if (!isEditMode) return;
        if (!rolSeleccionado?.value) return;
        if (permisosLoading) return;

        const permisosExistentes = nivelAccesoExistente?.permisos || [];
        if (!permisosExistentes.length) return;

        // Intentar mapear contra permisosOptions; fallback a {value,label} del backend
        const mapped = permisosExistentes
            .map((p) => {
                const opt = permisosOptions?.find((o) => o.value === p.idPermiso);
                return opt || { value: p.idPermiso, label: p.descripcion };
            })
            .filter(Boolean);

        setValue("permisos", mapped);
    }, [
        isEditMode,
        nivelAccesoExistente,
        rolSeleccionado,
        permisosLoading,
        permisosOptions,
        setValue,
    ]);

    const handleRolChange = (rol) => {
        // Limpiar permisos al cambiar de rol
        setValue("permisos", []);
        setValue("rol", rol);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = {
                nombre: data.nombre,
                descripcion: data.descripcion,
                idRol: data.rol.value,
                permisos: data.permisos.map((p) => p.value),
            };

            if (isEditMode) {
                await onEdit({ id: nivelAccesoExistente.id, ...formData });
            } else {
                await onAdd(formData);
            }
        } catch (error) {
            // Los errores ya se manejan en los hooks de mutación
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormSection title="Información básica">
                    <div className="grid grid-cols-1 gap-6">
                        <InputField
                            name="nombre"
                            label="Nombre del nivel"
                            placeholder="Ej: Super Administrador"
                            required
                            maxLength={40}
                            showCounter
                            disabled={isSubmitting}
                        />
                        <TextareaField
                            name="descripcion"
                            label="Descripción"
                            placeholder="Ej: Nivel con acceso completo al sistema"
                            required
                            maxLength={150}
                            rows={3}
                            showCounter
                            disabled={isSubmitting}
                        />
                    </div>
                </FormSection>

                <FormSection title="Rol asociado" delay={0.1}>
                    <RolSelector
                        control={control}
                        rolesOptions={rolesOptions}
                        isLoading={rolesLoading}
                        disabled={isSubmitting}
                        onRolChange={handleRolChange}
                        errorGlobal={
                            rolesError
                                ? "No se pudieron cargar los roles. Intenta nuevamente."
                                : undefined
                        }
                    />
                    {rolesError && (
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => refetchRoles()}
                                className="text-sm text-[var(--color-primary)] hover:underline"
                            >
                                Reintentar cargar roles
                            </button>
                        </div>
                    )}
                </FormSection>

                <FormSection title="Permisos asignados" delay={0.15}>
                    <PermisosSelector
                        control={control}
                        permisosOptions={permisosOptions}
                        isLoading={permisosLoading}
                        rolSeleccionado={rolSeleccionado}
                        disabled={isSubmitting}
                        errorGlobal={
                            permisosError
                                ? "No se pudieron cargar los permisos para el rol seleccionado."
                                : undefined
                        }
                    />
                    {permisosError && (
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => refetchPermisos()}
                                className="text-sm text-[var(--color-primary)] hover:underline"
                            >
                                Reintentar cargar permisos
                            </button>
                        </div>
                    )}
                </FormSection>

                <ActionButtons
                    onCancel={onCancel}
                    isSubmitting={isSubmitting}
                    isFormReady={isFormReady}
                />
            </form>
        </FormProvider>
    );
};

export default NivelAccesoForm;
