import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useConfigStore } from '../../store/configStore';
import { useAuthStore } from '../../store/authStore';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaExchangeAlt, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { GiMuscularTorso } from "react-icons/gi";
import { NormalButton } from '../Utiles/Buttons/NormalButton';

interface RecuperarContrasenaInputs {
    nuevaContrasena: string
    confirmacionContrasena: string
}

export const RecuperarContrasenaForm = () => {
    const navigate = useNavigate();

    const { token } = useParams<{ token: string }>();
    const safeToken: string = token!;


    const [verNuevaContrasena, setVerNuevaContrasena] = useState(false);
    const [verConfirmacionContrasena, setVerConfirmacionContrasena] = useState(false);
    const [tokenValido, setTokenValido] = useState(true);
    const [loadingToken, setLoadingToken] = useState(true);
    const [mensajeVerificacionToken, setMensajeVerificacionToken] = useState('');

    const { configuracion } = useConfigStore();
    const { recuperarContrasena, verificarTokenRecuperacionContrasena } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<RecuperarContrasenaInputs>();

    const onSubmit: SubmitHandler<RecuperarContrasenaInputs> = async (data) => {
        const { nuevaContrasena, confirmacionContrasena } = data;

        if (nuevaContrasena !== confirmacionContrasena) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        const result = await recuperarContrasena(safeToken, nuevaContrasena, confirmacionContrasena);

        if (result.success) {
            toast.success(result.mensaje);
            navigate("/login");
        } else {
            toast.error(result.mensaje);
        }
    };

    useEffect(() => {
        const validarToken = async () => {
            const result = await verificarTokenRecuperacionContrasena(safeToken);
            setTokenValido(result.success);
            setMensajeVerificacionToken(result.mensaje);
            setLoadingToken(false);
        };
        validarToken();
    }, [token, verificarTokenRecuperacionContrasena]);

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
                            <div className="p-4 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
                                <GiMuscularTorso className="text-3xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white">{configuracion?.nombreFranquicia || 'FITQIK'}</h1>
                        <p className="text-blue-200 mt-2 text-sm font-medium">Restablecer contraseña</p>
                    </div>

                    {/* Contenido principal */}
                    <div className="space-y-4">
                        {loadingToken ? (
                            <div className="flex flex-col items-center text-blue-100">
                                <FaSpinner className="animate-spin text-2xl mb-2" />
                                <p className="font-medium">Verificando enlace...</p>
                            </div>
                        ) : tokenValido ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Nueva Contraseña */}
                                <div>
                                    <label className="flex items-center text-blue-100 text-sm font-medium mb-2">
                                        <FaLock className="mr-3 text-blue-300" />
                                        Nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={verNuevaContrasena ? 'text' : 'password'}
                                            {...register('nuevaContrasena', {
                                                required: 'Este campo es requerido',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Mínimo 6 caracteres'
                                                }
                                            })}
                                            className={`w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition duration-200 ${errors.nuevaContrasena ? 'border-red-500' : 'border-white/20'}`}
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                        // disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setVerNuevaContrasena(!verNuevaContrasena)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                                        // disabled={loading}
                                        >
                                            {verNuevaContrasena ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.nuevaContrasena && (
                                        <p className="mt-1 text-xs text-red-300 font-medium">{errors.nuevaContrasena.message}</p>
                                    )}
                                </div>

                                {/* Confirmación Contraseña */}
                                <div>
                                    <label className="flex items-center text-blue-100 text-sm font-medium mb-2">
                                        <FaLock className="mr-3 text-blue-300" />
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={verConfirmacionContrasena ? 'text' : 'password'}
                                            {...register('confirmacionContrasena', {
                                                required: 'Este campo es requerido',
                                                validate: value =>
                                                    value === watch('nuevaContrasena') || 'Las contraseñas no coinciden'
                                            })}
                                            className={`w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition duration-200 ${errors.confirmacionContrasena ? 'border-red-500' : 'border-white/20'}`}
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                        // disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setVerConfirmacionContrasena(!verConfirmacionContrasena)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                                        // disabled={loading}
                                        >
                                            {verConfirmacionContrasena ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.confirmacionContrasena && (
                                        <p className="mt-1 text-xs text-red-300 font-medium">{errors.confirmacionContrasena.message}</p>
                                    )}
                                </div>

                                {/* Botón de Cambiar Contraseña */}
                                <NormalButton
                                    type={'submit'}
                                    disabled={isSubmitting}
                                    className={'w-full justify-center border-0'}
                                    tooltip='Cambiar Contraseña'
                                >
                                    {isSubmitting ? (
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <FaExchangeAlt />
                                    )}
                                    {isSubmitting ? 'Procesando...' : 'Cambiar Contraseña'}
                                </NormalButton>
                            </form>
                        ) : (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-4 rounded-md">
                                <div className="flex flex-col items-center">
                                    <FaTimesCircle className="text-3xl mb-2 text-red-400" />
                                    <p className="text-lg font-semibold mb-1">Enlace inválido o expirado</p>
                                    {mensajeVerificacionToken && (
                                        <p className="mt-2 text-sm italic text-red-300">{mensajeVerificacionToken}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};