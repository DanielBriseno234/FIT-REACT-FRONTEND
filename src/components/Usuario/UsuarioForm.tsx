import { Controller, useForm } from "react-hook-form"
import { motion } from "framer-motion";
import type { UsuarioInputType, UsuarioInputUpdateType, UsuarioOutputType } from "../../interfaces/Usuario/Usuario"
import { Input, Select, Option } from "@material-tailwind/react";
import { useCharCounter } from "../../hooks/Generales/useCharCounter";
import ErrorValidationMessage from "../Utiles/Tags/ErrorValidationMessage";
import { CancelButton } from "../Utiles/Buttons/CancelButton";
import { FaSave, FaTimes } from "react-icons/fa";
import { NormalButton } from "../Utiles/Buttons/NormalButton";
import { useGimnasiosSelect } from "../../hooks/Gimnasio/useGimnasiosSelect";
import FormSkeleton from "../Utiles/Loader/FormSkeleton";
import LoadError from "../Generales/LoadError";
import { getErrorMessage } from "../../helpers/errorHelper";
import { useEffect } from "react";
import ReactSelect from "react-select";

interface UsuarioFormProps {
    initialData?: UsuarioOutputType | null
    onSubmit: (data: UsuarioInputType | UsuarioInputUpdateType) => void
    onCancel: () => void,
    isLoading: boolean,
    mode: "add" | "update"
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
    mode
}) => {
    // Hook para cargar los gimnasios
    const { data: listaGimnasios, error: errorListaGimnasios, isLoading: isLoadingListaGimnasios } = useGimnasiosSelect();

    // Inicialización del formulario
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch, reset } = useForm<UsuarioInputType | UsuarioInputUpdateType>({
        defaultValues: {
            email: initialData?.email || "",
            nombres: initialData?.nombres || "",
            contrasena: "",
            apellidoPaterno: initialData?.apellidoPaterno || "",
            apellidoMaterno: initialData?.apellidoMaterno || "",
            telefono: initialData?.telefono || "",
            genero: initialData?.genero || "",
            idGimnasioRegistro: initialData?.gimnasioRegistro?.id || 0,
            gimnasiosPermitidosIds: initialData?.gimnasiosPermitidos?.map(gim => gim.id) || [],
            rolesIds: initialData?.roles?.map(rol => ({ rolId: rol?.idRol, nivelAccesoId: rol?.idNivelAcceso })) || [],
            recepcionista: initialData?.recepcionista,
            entrenador: initialData?.entrenador
        },
        shouldFocusError: true
    });

    // Contadores para cada campo del formulario
    const { handleChange: handleEmailChange, Counter: EmailCounter } = useCharCounter(100, watch("email"));
    const { handleChange: handleContrasenaChange, Counter: ContrasenaCounter } = useCharCounter(30, watch("contrasena"));
    const { handleChange: handleNombresChange, Counter: NombresCounter } = useCharCounter(60, watch("nombres"));
    const { handleChange: handleAPaternoChange, Counter: APaternoCounter } = useCharCounter(40, watch("apellidoPaterno"));
    const { handleChange: handleAMaternoChange, Counter: AMaternoCounter } = useCharCounter(40, watch("apellidoMaterno"));
    const { handleChange: handleTelefonoChange, Counter: TelefonoCounter } = useCharCounter(10, watch("telefono"));

    // Funcion que se ejecuta al enviar el formulario
    const handleFormSubmit = (data: UsuarioInputType | UsuarioInputUpdateType) => {
        console.log(data)
        //onSubmit(data);
    }

    const h = watch("gimnasiosPermitidosIds");

    useEffect(() => {
        console.log(h)
    }, [h]);

    if (isLoadingListaGimnasios) {
        return (
            <FormSkeleton delay={0} />
        );
    }

    if (errorListaGimnasios) {
        return (
            <LoadError
                titulo="Error al cargar el usuario"
                mensaje={getErrorMessage(errorListaGimnasios) || "No se pudo obtener el formulario del usuario"}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
                    Información de Sesión
                </h2>

                {/* Email */}
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: { value: true, message: "El email es obligatorio" },
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ingrese un email válido" }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                {...field}
                                id="email"
                                label="Email"
                                error={!!errors.email}
                                disabled={isSubmitting || isLoading || mode === "update"} // email no editable en update
                                maxLength={100}
                                onChange={(e) => {
                                    field.onChange(e.target.value)
                                    handleEmailChange(e)
                                }}
                            />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <EmailCounter />
                            </div>
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="email" />

                {/* Contraseña (solo agregar) */}
                {mode === "add" && (
                    <>
                        <Controller
                            name="contrasena"
                            control={control}
                            rules={{
                                required: { value: true, message: "La contraseña es obligatoria" },
                                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: "Debe incluir mayúscula, minúscula y número" }
                            }}
                            render={({ field }) => (
                                <div className="relative">
                                    <Input {...field}
                                        type="password"
                                        label="Contraseña"
                                        error={!!errors.contrasena}
                                        disabled={isSubmitting || isLoading}
                                        maxLength={30}
                                        onChange={(e) => {
                                            field.onChange(e.target.value)
                                            handleContrasenaChange(e)
                                        }}
                                    />
                                    <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                        <ContrasenaCounter />
                                    </div>
                                </div>
                            )}
                        />
                        <ErrorValidationMessage errors={errors} name="contrasena" />
                    </>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
                    Información Básica
                </h2>
                {/* Nombres */}
                <Controller
                    name="nombres"
                    control={control}
                    rules={{
                        required: { value: true, message: "Los nombres son obligatorios" },
                        maxLength: { value: 60, message: "Máximo 50 caracteres" }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input {...field}
                                label="Nombres"
                                error={!!errors.nombres}
                                disabled={isSubmitting || isLoading}
                                maxLength={60}
                                onChange={(e) => {
                                    field.onChange(e.target.value)
                                    handleNombresChange(e)
                                }}
                            />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <NombresCounter />
                            </div>
                        </div>
                    )}

                />
                <ErrorValidationMessage errors={errors} name="nombres" />

                {/* Apellido Paterno */}
                <Controller
                    name="apellidoPaterno"
                    control={control}
                    rules={{
                        required: { value: true, message: "El apellido paterno es obligatorio" },
                        maxLength: { value: 40, message: "Máximo 40 caracteres" }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input {...field}
                                label="Apellido Paterno"
                                error={!!errors.apellidoPaterno}
                                disabled={isSubmitting || isLoading}
                                maxLength={40}
                                onChange={(e) => {
                                    field.onChange(e.target.value)
                                    handleAPaternoChange(e)
                                }}
                            />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <APaternoCounter />
                            </div>
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="apellidoPaterno" />

                {/* Apellido Materno */}
                <Controller
                    name="apellidoMaterno"
                    control={control}
                    rules={{
                        required: { value: true, message: "El apellido materno es obligatorio" },
                        maxLength: { value: 40, message: "Máximo 40 caracteres" }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input {...field}
                                label="Apellido Materno"
                                error={!!errors.apellidoMaterno}
                                disabled={isSubmitting || isLoading}
                                maxLength={40}
                                onChange={(e) => {
                                    field.onChange(e.target.value)
                                    handleAMaternoChange(e)
                                }}
                            />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <AMaternoCounter />
                            </div>
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="apellidoMaterno" />

                {/* Género */}
                <Controller
                    name="genero"
                    control={control}
                    rules={{ required: { value: true, message: "Seleccione un género" } }}
                    render={({ field }) => (
                        <Select {...field} label="Género" error={!!errors.genero}>
                            <Option value="HOMBRE">Hombre</Option>
                            <Option value="MUJER">Mujer</Option>
                            <Option value="OTRO">Otro</Option>
                        </Select>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="genero" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
                    Información de Contacto
                </h2>
                {/* Teléfono */}
                <Controller
                    name="telefono"
                    control={control}
                    rules={{
                        required: { value: true, message: "El teléfono es obligatorio" },
                        pattern: { value: /^[0-9]{10}$/, message: "Debe tener 10 dígitos numéricos" },
                        maxLength: { value: 10, message: "Solo se permiten 10 números" }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input {...field}
                                label="Teléfono"
                                error={!!errors.telefono}
                                disabled={isSubmitting || isLoading}
                                maxLength={10}
                                onChange={(e) => {
                                    field.onChange(e.target.value)
                                    handleTelefonoChange(e)
                                }}
                            />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <TelefonoCounter />
                            </div>
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="telefono" />
            </motion.div>

            {/* TODO: Aquí se agregan selects/multi-selects para rolesIds, gimnasioRegistro y gimnasiosPermitidosIds */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
                    Información de Contacto
                </h2>
                {/* Gimnasios */}
                <Controller
                    name="idGimnasioRegistro"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "El gimnasio registro es obligatorio"
                        },
                        validate: value => value !== 0 || "El gimnasio registro es obligatorio"
                    }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                            label='Gimnasio Registro'
                            error={!!errors.idGimnasioRegistro}
                            onChange={(value) => {
                                field.onChange(value)
                                console.log(value)
                            }}
                            value={String(field.value)}
                        >
                            {listaGimnasios && listaGimnasios.length ? (
                                listaGimnasios.map(gimnasio => <Option key={gimnasio.id} value={gimnasio.id.toString()}>{gimnasio.nombre}</Option>)
                            ) : (
                                <Option value='' disabled>Sin Gimnasios</Option>
                            )}
                        </Select>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="idGimnasioRegistro" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
                    Gimnasios Permitidos
                </h2>

                {/* <Controller
                    name="gimnasiosPermitidosIds"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                            {listaGimnasios?.map((gim) => (
                                <label key={gim.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={gim.id}
                                        checked={field.value.includes(gim.id)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            if (checked) {
                                                field.onChange([...field.value, gim.id]);
                                            } else {
                                                field.onChange(field.value.filter((id: number) => id !== gim.id));
                                            }
                                        }}
                                        disabled={isSubmitting || isLoading}
                                    />
                                    <span>{gim.nombre}</span>
                                </label>
                            ))}
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="gimnasiosPermitidosIds" /> */}
                <Controller
                    name="gimnasiosPermitidosIds"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Debes seleccionar por lo menos un gimnasio"
                        },
                    }}
                    render={({ field }) => {
                        // Transformamos los datos a la forma que React Select entiende
                        const options = listaGimnasios?.map(gim => ({
                            value: gim.id,
                            label: gim.nombre
                        })) || [];

                        // Para inicializar valores seleccionados
                        const selectedValues = options.filter(opt => field.value.includes(opt.value));

                        return (
                            <ReactSelect
                                isMulti
                                isSearchable
                                options={options}
                                value={selectedValues}
                                onChange={(selected) => {
                                    const ids = selected ? selected.map(item => item.value) : [];
                                    field.onChange(ids);
                                }}
                                isDisabled={isSubmitting || isLoading}
                                placeholder="Selecciona gimnasios..."
                                closeMenuOnSelect={false}
                                noOptionsMessage={() => "Sin Gimnasios"}
                            />
                        );
                    }}
                />
                <ErrorValidationMessage errors={errors} name="gimnasiosPermitidosIds" />
            </motion.div>



            {/* Botones */}
            <div className="flex justify-between md:justify-end gap-4">
                <CancelButton type="button" onClick={onCancel} tooltip="Cancelar">
                    <FaTimes /> Cancelar
                </CancelButton>
                <NormalButton type="submit" tooltip="Guardar" disabled={isSubmitting || isLoading}>
                    {isSubmitting || isLoading ?
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        : <FaSave />}
                    {isSubmitting || isLoading ? "Guardando..." : "Guardar"}
                </NormalButton>
            </div>
        </form>
    )
}

export default UsuarioForm
