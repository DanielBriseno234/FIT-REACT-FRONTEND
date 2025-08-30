import { toast } from 'react-hot-toast';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useConfigStore } from '../../store/configStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { GiMuscularTorso } from "react-icons/gi";
import { NormalButton } from '../Utiles/Buttons/NormalButton';
import { ErrorMessage } from "@hookform/error-message"

interface SolicitudFormInputs {
    email: string
}

export const SolicitudRecuperarContrasenaForm = () => {
    const navigate = useNavigate();
    const { configuracion } = useConfigStore();
    const { solicitudRecuperarContrasena } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<SolicitudFormInputs>();

    const onSubmit: SubmitHandler<SolicitudFormInputs> = async (data) => {
        const result = await solicitudRecuperarContrasena(data.email);
        if (result.success) {
            toast.success(result.mensaje);
            navigate("/login");
        } else {
            toast.error(result.mensaje);
        }
    };

    const handleVolverALogin = () => {
        navigate("/login");
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
                            <div className="p-4 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
                                <GiMuscularTorso className="text-3xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white">{configuracion?.nombreFranquicia || 'FITQIK'}</h1>
                        <p className="text-blue-200 mt-2 text-sm font-medium">Recuperar contraseña</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Instrucciones */}
                        <div className="text-blue-100 text-sm mb-4 text-center">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </div>

                        {/* Campo Email */}
                        <div>
                            <label className="flex items-center text-blue-100 text-sm font-medium mb-2">
                                <FaEnvelope className="mr-3 text-[var(--color-primary)]" />
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
                                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition duration-200 ${errors.email ? 'border-red-500' : 'border-white/20'}`}
                                    placeholder="usuario@empresa.com"
                                    autoComplete="username"
                                // disabled={loading}
                                />
                            </div>
                            <ErrorMessage errors={errors} name="email" render={({ message }) => <span className='text-red-600 text-xs italic'>{message}</span>} />
                        </div>

                        {/* Botón de Volver */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleVolverALogin}
                                className="text-xs text-[var(--color-primary)] hover:text-[var(--color-secondary)] flex items-center gap-1 transition duration-300 ease-in-out"
                            >
                                <FaArrowLeft className="text-xs" />
                                Volver al inicio de sesión
                            </button>
                        </div>

                        {/* Botón de Enviar */}
                        <NormalButton
                            disabled={isSubmitting}
                            type={'submit'}
                            fullWidth
                            tooltip='Enviar Enlace'
                        >
                            {isSubmitting ? (
                                <svg
                                    className="animate-spin h-4 w-4 text-white "
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
                                <FaPaperPlane />
                            )}

                            {isSubmitting ? "Enviando..." : "Enviar Enlace"}
                        </NormalButton>
                    </form>
                </div>
            </div>
        </div>
    );
};