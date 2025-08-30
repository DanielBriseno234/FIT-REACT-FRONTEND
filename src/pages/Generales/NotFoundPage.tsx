import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { rutaPorRol } from '../../helpers/rutaPorRol';
import { FaLock, FaHome, FaArrowLeft } from 'react-icons/fa';

export default function NotFoundPage() {
    const navigate = useNavigate();

    const { rolActivo, isAuthenticated } = useAuthStore();

    const handleRegresar = () => {
        if (isAuthenticated && rolActivo) {
            navigate(rutaPorRol(rolActivo.nombre));
        } else {
            navigate('/login');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* Diseño de fondo geométrico */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/15 rounded-full mix-blend-multiply opacity-40 transform translate-x-1/2 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-primary)]/30 rounded-full mix-blend-multiply opacity-30 transform -translate-x-1/3 translate-y-1/4"></div>
            </div>

            {/* Tarjeta principal con diseño asimétrico */}
            <motion.div
                className="relative bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md border-l-4 border-[var(--color-primary)] z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Patrón diagonal decorativo */}
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent transform skew-x-12 origin-top-right"></div>

                <div className="relative px-8 py-10 text-center">
                    {/* Icono de candado con animación */}
                    <div className="mb-8 flex justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 3, -3, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/15 animate-ping opacity-75"></div>
                                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary)]/15 border-4 border-[var(--color-primary)]/30 shadow-inner">
                                    <FaLock className="text-3xl text-[var(--color-primary)]" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Texto con énfasis jerárquico */}
                    <div className="mb-8">
                        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
                        <div className="w-20 h-1 bg-[var(--color-primary)]/80 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-medium text-gray-600">Página no disponible</h2>
                    </div>

                    {/* Mensaje con contenedor destacado */}
                    <motion.div
                        className="mb-8 px-6 py-4 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/15"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="text-gray-600">
                            La página que buscas no existe o ha sido movida a otra ubicación.
                        </p>
                    </motion.div>

                    {/* Botones con diseño moderno */}
                    <div className="flex flex-col space-y-4">
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleRegresar}
                            className="w-full py-3 px-6 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-lg font-medium shadow-md transition-all"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FaHome /> Página principal
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(-1)}
                            className="text-[var(--color-primary)] hover:text-[var(--color-secondary)]font-medium py-2 transition-colors flex items-center justify-center gap-1"
                        >
                            <FaArrowLeft /> Volver atrás
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}