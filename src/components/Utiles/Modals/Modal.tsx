import { motion, AnimatePresence } from "framer-motion";
import type React from "react";
import { FiX } from "react-icons/fi";

interface ProfessionalModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    onCloseComplete?: () => void;
}

const ProfessionalModal = ({
    isOpen,
    onClose,
    children,
    title,
    size = "md",
    onCloseComplete = () => { },
}: ProfessionalModalProps) => {
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-2xl",
        "2xl": "max-w-4xl",
        full: "max-w-full",
    };

    return (
        <AnimatePresence onExitComplete={onCloseComplete}>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Fondo oscuro con blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Contenido del modal */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`relative ${sizeClasses[size]} w-full rounded-xl bg-white shadow-xl`}
                    >
                        {/* Header con gradiente azul */}
                        <div className="px-6 py-4 rounded-t-lg bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">{title}</h2>
                                <motion.button
                                    type="button"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-1 text-white hover:bg-white/20 rounded-full transition-all"
                                >
                                    <FiX className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="overflow-y-auto max-h-[65vh] p-6">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfessionalModal;
