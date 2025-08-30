import { useParams } from 'react-router-dom';
import { useConfigStore } from '../../store/configStore';
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { GiMuscularTorso } from "react-icons/gi";

export const VerificacionUsuarioForm = () => {
    const { token } = useParams<{ token: string }>();
    const safeToken: string = token!;
    const { configuracion } = useConfigStore();
    const { verificarCuenta } = useAuthStore();

    const [verificado, setVerificado] = useState(false);
    const [mensajeVerificacion, setMensajeVerificacion] = useState('');

    useEffect(() => {
        const verificar = async () => {
            const resultado = await verificarCuenta(safeToken);
            setVerificado(resultado.success);
            setMensajeVerificacion(resultado.mensaje);
        };

        if (token) {
            verificar();
        }
    }, [token, verificarCuenta]);

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
                        <p className="text-blue-200 mt-2 text-sm font-medium">Verificación de cuenta</p>
                    </div>

                    {/* Contenido */}
                    <div className="text-center space-y-4">
                        {
                            // loading ? (
                            //     <div className="flex flex-col items-center text-blue-100">
                            //         <FaSpinner className="animate-spin text-2xl mb-2" />
                            //         <p className="font-medium">Verificando tu cuenta...</p>
                            //     </div>
                            // ) : 
                            verificado ? (
                                <div className="bg-green-500/10 border border-green-500/20 text-green-100 px-4 py-4 rounded-md">
                                    <div className="flex flex-col items-center">
                                        <FaCheckCircle className="text-3xl mb-2 text-green-400" />
                                        <p className="text-lg font-semibold mb-1">¡Verificación exitosa!</p>
                                        <p className="text-sm">Tu cuenta ha sido verificada correctamente.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-4 rounded-md">
                                    <div className="flex flex-col items-center">
                                        <FaTimesCircle className="text-3xl mb-2 text-red-400" />
                                        <p className="text-lg font-semibold mb-1">No se pudo verificar la cuenta</p>
                                        {mensajeVerificacion && (
                                            <p className="mt-2 text-sm italic text-red-300">{mensajeVerificacion}</p>
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