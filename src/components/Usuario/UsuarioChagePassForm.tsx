import React, { useState } from 'react'
import type { UsuarioCambiarContrasena, UsuarioItem } from '../../interfaces/Usuario/Usuario'
import { Controller, useForm } from 'react-hook-form';
import { useCharCounter } from '../../hooks/Generales/useCharCounter';
import { motion } from "framer-motion";
import { Input } from '@material-tailwind/react';
import ErrorValidationMessage from '../Utiles/Tags/ErrorValidationMessage';
import { FaEye, FaEyeSlash, FaSave, FaTimes } from 'react-icons/fa';
import { CancelButton } from '../Utiles/Buttons/CancelButton';
import { NormalButton } from '../Utiles/Buttons/NormalButton';

interface UsuarioChangePassFormProps {
    usuario: UsuarioItem
    onSubmit: (data: UsuarioCambiarContrasena) => void
    onCancel: () => void
}

const UsuarioChagePassForm: React.FC<UsuarioChangePassFormProps> = ({
    usuario,
    onSubmit,
    onCancel
}) => {
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

    // Inicialización del formulario
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch } = useForm<UsuarioCambiarContrasena>({
        shouldFocusError: true
    });

    const { handleChange: handleNuevaContrasenaChange, Counter: NuevaContrasenaCounter } = useCharCounter(35, watch("nuevaContrasena"));
    const { handleChange: handleConfirmacionContrasenaChange, Counter: ConfirmacionContrasenaCounter } = useCharCounter(35, watch("confirmacionContrasena"));

    // Funcion que se ejecuta al enviar el formulario
    const handleFormSubmit = (data: UsuarioCambiarContrasena) => {
        onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-4"
            >
                <p className='text-xs italic text-justify'>Este proceso reemplazará la contraseña actual del usuario {usuario.nombres} {usuario.apellidoPaterno} {usuario.apellidoMaterno}. La contraseña anterior dejará de ser válida y el usuario solo podrá acceder con la nueva contraseña que se le asigne.</p>
                {/* Nueva contrasena */}
                <Controller
                    name="nuevaContrasena"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "La contraseña es obligatoria"
                        }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                                {...field}
                                type={viewPassword ? 'text' : 'password'}
                                id="nuevaContrasena"
                                label="Nueva Contraseña"
                                error={!!errors.nuevaContrasena}
                                placeholder="nuevaContrasena"
                                disabled={isSubmitting}
                                maxLength={35}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleNuevaContrasenaChange(e);
                                }}
                            />
                            <div className="absolute right-8 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <NuevaContrasenaCounter />
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewPassword(!viewPassword)}
                                className="absolute right-3 bottom-3 text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition duration-300 ease-in-out"
                                disabled={isSubmitting}
                            >
                                {viewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {/* </div> */}
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="nuevaContrasena" />

                {/* Confirmación contrasena */}
                <Controller
                    name="confirmacionContrasena"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "La confirmación de contraseña es obligatoria"
                        },
                        validate: (value) =>
                            value === watch("nuevaContrasena") || "Las contraseñas no coinciden"
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                                {...field}
                                type={viewConfirmPassword ? 'text' : 'password'}
                                id="confirmacionContrasena"
                                label="Confirmacion Contraseña"
                                error={!!errors.confirmacionContrasena}
                                placeholder="confirmacionContrasena"
                                disabled={isSubmitting}
                                maxLength={35}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleConfirmacionContrasenaChange(e);
                                }}
                            />
                            <div className="absolute right-8 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <ConfirmacionContrasenaCounter />
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
                                className="absolute right-3 bottom-3 text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition duration-300 ease-in-out"
                                disabled={isSubmitting}
                            >
                                {viewConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="confirmacionContrasena" />
            </motion.div>

            {/* Botones */}
            <div className="flex justify-between md:justify-end gap-4">
                <CancelButton type="button" onClick={onCancel} tooltip="Cancelar">
                    <FaTimes /> Cancelar
                </CancelButton>
                <NormalButton type="submit" tooltip="Guardar" disabled={isSubmitting}>
                    {isSubmitting ?
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        : <FaSave />}
                    {isSubmitting ? "Guardando..." : "Guardar"}
                </NormalButton>
            </div>
        </form>
    )
}

export default UsuarioChagePassForm
