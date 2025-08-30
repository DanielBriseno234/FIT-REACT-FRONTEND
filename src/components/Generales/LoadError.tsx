import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface LoadErrorProps {
    titulo?: string
    mensaje?: string
    textoBoton?: string
    onReintentar?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
}

const LoadError: React.FC<LoadErrorProps> = ({
    titulo = "Error de conexión",
    mensaje = "No pudimos cargar los datos solicitados",
    textoBoton = "Reintentar conexión",
    onReintentar,
    className = ""
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                damping: 10,
                stiffness: 100
            }}
            className={`relative min-h-full flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-gray-100/70 shadow-2xl shadow-red-100/30 overflow-hidden ${className}`}
        >
            {/* Efecto de fondo animado */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    background: [
                        'linear-gradient(135deg, rgba(254, 226, 226, 0.3) 0%, rgba(255, 255, 255, 0) 60%',
                        'linear-gradient(135deg, rgba(254, 226, 226, 0.4) 0%, rgba(255, 255, 255, 0) 60%',
                        'linear-gradient(135deg, rgba(254, 226, 226, 0.3) 0%, rgba(255, 255, 255, 0) 60%'
                    ]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: 'reverse'
                }}
            />

            {/* Partículas flotantes */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-red-400/20 rounded-full"
                    initial={{
                        scale: 0,
                        opacity: 0,
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50
                    }}
                    animate={{
                        scale: [0, Math.random() * 0.5 + 0.5, 0],
                        opacity: [0, 0.3, 0],
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 200 - 100
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: `${Math.random() * 20 + 10}px`,
                        height: `${Math.random() * 20 + 10}px`
                    }}
                />
            ))}

            {/* Icono con efecto de alerta */}
            <motion.div
                className="mb-6 relative"
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping -z-10"></div>
                <div className="p-5 bg-gradient-to-br from-red-100 to-red-50 rounded-full shadow-inner border border-red-200/50">
                    <FiAlertTriangle className="w-14 h-14 text-red-600 drop-shadow-sm" />
                </div>
            </motion.div>

            {/* Contenido textual con efecto de aparición */}
            <motion.div
                className="text-center max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{titulo}</h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{mensaje}</p>
            </motion.div>

            {/* Botón premium con efecto */}
            <motion.button
                onClick={onReintentar}
                whileHover={{ backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg transition-colors relative overflow-hidden"
            >
                <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                >
                    <FiRefreshCw className="w-4 h-4" />
                </motion.span>
                {textoBoton}
            </motion.button>

            {/* Borde sutil animado */}
            <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent pointer-events-none"
                animate={{
                    borderColor: ['rgba(239, 68, 68, 0)', 'rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0)']
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity
                }}
            />
        </motion.div>
    );
};

export default LoadError;