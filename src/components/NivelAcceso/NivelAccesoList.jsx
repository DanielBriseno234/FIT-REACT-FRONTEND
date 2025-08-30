import { motion, AnimatePresence } from "framer-motion";
import Paginacion from '../Utiles/Paginacion/Paginacion';
import NivelAccesoCard from "./NivelAccesoCard";

const NivelAccesoList = ({ niveles, pagination, onAdd, onEdit, onDelete, onReactivate, onPageChange }) => {

    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={pagination.currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {niveles.map((nivel) => (
                            <NivelAccesoCard
                                key={nivel.id}
                                nivelAcceso={nivel}
                                onEdit={() => onEdit(nivel)}
                                onDelete={() => onDelete(nivel)}
                                onReactivate={() => onReactivate(nivel)}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {pagination.totalPages > 1 && (
                <Paginacion
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                    className="mt-6"
                />
            )}
        </div>
    );
};

export default NivelAccesoList;
