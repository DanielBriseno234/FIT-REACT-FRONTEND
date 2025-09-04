import type { TipoClaseItem } from "../../interfaces/TipoClase/TipoClase"
import { motion, AnimatePresence } from "framer-motion"
import TipoClaseCard from "./TipoClaseCard"

interface TipoClaseListProps {
    tiposClases: TipoClaseItem[]
    onUpdateTipoClase: (id: number) => void
    onDeleteTipoClase: (tipoClase: TipoClaseItem) => void
    onReactivateTipoClase: (tipoClase: TipoClaseItem) => void
}

const TipoClaseList: React.FC<TipoClaseListProps> = ({
    tiposClases,
    onUpdateTipoClase,
    onDeleteTipoClase,
    onReactivateTipoClase
}) => {
    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                <motion.div
                    // key={pagination.currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {tiposClases.map(tipoClase => (
                            <TipoClaseCard
                                key={tipoClase.id}
                                tipoClase={tipoClase}
                                onUpdate={onUpdateTipoClase}
                                onDelete={onDeleteTipoClase}
                                onReactivate={onReactivateTipoClase}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default TipoClaseList
