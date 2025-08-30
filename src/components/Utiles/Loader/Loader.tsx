import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
    variant?: "orbit" | "holographic"
    size?: "small" | "medium" | "large" | "xlarge"
    className?: string
    fullScreen?: boolean
    message?: string
    overlayColor?: string
    delay?: number
}

const Loader = ({
    variant = "orbit",
    size = "medium",
    className = "",
    fullScreen = false,
    message = "Cargando...",
    overlayColor = "bg-gray-50 bg-opacity-70",
    delay = 1
}: LoaderProps) => {
    // Tamaños
    const sizes = {
        "small": "h-10 w-10",
        "medium": "h-16 w-16",
        "large": "h-24 w-24",
        "xlarge": "h-32 w-32"
    };

    // Variantes premium
    const variants = {
        "orbit": (
            <div className={`relative ${sizes[size]} mx-auto ${className}`}>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-[var(--color-primary)]/15 border-t-transparent animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--color-secondary)] animate-orbit"></div>
            </div>
        ),
        "holographic": (
            <div className={`relative ${sizes[size]} mx-auto ${className}`}>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)] border-r-[var(--color-primary)]/15 border-b-[var(--color-primary)]/60 border-l-[var(--color-primary)]/50 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[var(--color-primary)]/50 border-r-[var(--color-primary)]/60 border-b-[var(--color-primary)]/15 border-l-[var(--color-primary)] animate-spin-reverse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/5 h-1/5 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] animate-pulse"></div>
            </div>
        ),
    };

    // Contenido base del loader
    const loaderContent = (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay, duration: 0.5 }}
            className="flex flex-col items-center justify-center"
        >
            {variants[variant] || variants.orbit}
            {message && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.3 }}
                    className="mt-4 text-[var(--color-secondary)] font-medium text-center"
                >
                    {message}
                </motion.p>
            )}
        </motion.div>
    );

    return (
        <AnimatePresence>
            <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay, duration: 0.5 }}
                className={fullScreen ?
                    `fixed inset-0 flex items-center justify-center z-50 ${overlayColor}` :
                    "flex items-center justify-center w-full h-full"}
            >
                {loaderContent}
            </motion.div>
        </AnimatePresence>
    );
};

export default Loader;