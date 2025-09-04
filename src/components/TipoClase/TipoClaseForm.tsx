import { Controller, useForm } from "react-hook-form"
import type { TipoClaseInput, TipoClaseOutput } from "../../interfaces/TipoClase/TipoClase"
import { motion } from "framer-motion";
import { useCharCounter } from "../../hooks/Generales/useCharCounter"
import { Input, Textarea } from "@material-tailwind/react";
import ErrorValidationMessage from "../Utiles/Tags/ErrorValidationMessage";
import { CancelButton } from "../Utiles/Buttons/CancelButton";
import { FaSave, FaTimes } from "react-icons/fa";
import { NormalButton } from "../Utiles/Buttons/NormalButton";
import { limpiarInput } from "../../helpers/limpiezaInputs";

interface TipoClaseFormProps {
    initialData?: TipoClaseOutput | null
    onSubmit: (data: TipoClaseInput) => void
    onCancel: () => void,
    isLoading: boolean,
    mode: "add" | "update"
}

const TipoClaseForm: React.FC<TipoClaseFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading
}) => {

    // Inicialización del formulario
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch } = useForm<TipoClaseInput>({
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || ""
        },
        shouldFocusError: true
    });

    // Contadores para cada campo del formulario
    const { handleChange: handleNombreChange, Counter: NombreCounter } = useCharCounter(50, watch("nombre"));
    const { handleChange: handleDescripcionChange, Counter: DescripcionCounter } = useCharCounter(150, watch("descripcion"));

    // Funcion que se ejecuta al enviar el formulario
    const handleFormSubmit = (data: TipoClaseInput) => {
        const sanitizedData: TipoClaseInput = {
            ...data,
            nombre: limpiarInput(data.nombre),
            descripcion: limpiarInput(data.descripcion),
        };
        onSubmit(sanitizedData);
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
                    Información de Básica
                </h2>

                {/* Nombres */}
                <Controller
                    name="nombre"
                    control={control}
                    rules={{
                        required: { value: true, message: "El nombre es obligatorio" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                                {...field}
                                label="Nombre"
                                error={!!errors.nombre}
                                disabled={isSubmitting || isLoading}
                                maxLength={50}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                    handleNombreChange(e);
                                }} />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <NombreCounter />
                            </div>
                        </div>
                    )}

                />
                <ErrorValidationMessage errors={errors} name="nombre" />

                {/* Nombres */}
                <Controller
                    name="descripcion"
                    control={control}
                    rules={{
                        required: { value: true, message: "La descripción es obligatoria" },
                        maxLength: { value: 150, message: "Máximo 150 caracteres" }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Textarea
                                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} {...field}
                                label="Descripción"
                                error={!!errors.descripcion}
                                disabled={isSubmitting || isLoading}
                                maxLength={150}
                                {...register("descripcion", {
                                    onChange: (e) => handleDescripcionChange(e)
                                })} />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <DescripcionCounter />
                            </div>
                        </div>
                    )}

                />
                <ErrorValidationMessage errors={errors} name="descripcion" />
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

export default TipoClaseForm
