import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import { useConfigStore } from '../../store/configStore';
import { FaLock, FaEye, FaEyeSlash, FaEnvelope, FaSignInAlt, FaKey } from 'react-icons/fa';
import { GiMuscularTorso } from "react-icons/gi";
import { NormalButton } from '../Utiles/Buttons/NormalButton';
import ErrorValidationMessage from '../Utiles/Tags/ErrorValidationMessage';

type LoginInputs = {
    email: string;
    contrasena: string;
}

export const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { configuracion } = useConfigStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginInputs>();

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        const result = await login(data.email, data.contrasena);

        if (!result.success) {
            toast.error(result.mensaje);
        } else {
            toast.success(result.mensaje);
            if (result.redirigir) {
                navigate(result.redirigir);
            }
        }
    };

    const handleOlvideContrasena = () => {
        navigate('/solicitud-recuperacion-contrasena');
    };

    return (
        <div className="w-[90%] sm:max-w-md mx-auto my-8">
            {/* Contenedor con efecto vidrio */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                {/* Barra superior sutil */}
                <div className="h-1 bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]"></div>

                {/* Contenido del formulario */}
                <div className="px-8 py-8">
                    {/* Encabezado minimalista */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/3    0 backdrop-blur-sm">
                                <GiMuscularTorso className="text-3xl text-[var(--color-primary)]" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white">{configuracion?.nombreFranquicia || 'FITQIK'}</h1>
                        <p className="text-blue-200 mt-2 text-sm font-medium">Acceso seguro</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Campo Email */}
                        <div>
                            <label className="flex items-center text-blue-100 text-sm font-medium mb-2">
                                <FaEnvelope className="mr-3 text-[var(--color-primary)] opacity-70" />
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Este campo es requerido',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Correo electrónico inválido'
                                        }
                                    })}
                                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition duration-200 ease-in-out ${errors.email ? 'border-red-500' : 'border-white/20'}`}
                                    placeholder="usuario@empresa.com"
                                    autoComplete="username"
                                // disabled={loading}
                                />
                            </div>
                            <ErrorValidationMessage errors={errors} name="email" />
                        </div>

                        {/* Campo Contraseña */}
                        <div>
                            <label className="flex items-center text-blue-100 text-sm font-medium mb-2">
                                <FaLock className="mr-3 text-[var(--color-primary)] opacity-70" />
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('contrasena', {
                                        required: 'Este campo es requerido',
                                        minLength: {
                                            value: 6,
                                            message: 'Mínimo 6 caracteres'
                                        }
                                    })}
                                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition ease-in-out duration-200 ${errors.email ? 'border-red-500' : 'border-white/20'}`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                // disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition duration-300 ease-in-out"
                                // disabled={loading}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <ErrorValidationMessage errors={errors} name="contrasena" />
                        </div>

                        {/* Olvidé contraseña */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleOlvideContrasena}
                                className="text-xs text-[var(--color-primary)] hover:text-[var(--color-secondary)] flex items-center gap-1 transition duration-300 ease-in-out"
                            >
                                <FaKey className="text-xs" />
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {/* Botón de Login */}
                        <NormalButton
                            disabled={isSubmitting}
                            type={'submit'}
                            tooltip={'Iniciar Sesión'}
                            fullWidth
                        >
                            {isSubmitting ?
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                : <FaSignInAlt />}
                            {isSubmitting ? "Iniciando Sesión..." : "Iniciar Sesión"}
                        </NormalButton>
                    </form>
                </div>
            </div>
        </div>
    );
};