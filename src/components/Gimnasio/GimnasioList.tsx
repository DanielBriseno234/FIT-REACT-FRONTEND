import type React from "react"
import type { GimnasioItem } from "../../interfaces/Gimnasio/Gimnasio"
import { motion, AnimatePresence } from "framer-motion"
import GimnasioCard from "./GimnasioCard"

interface GimnasioListProps {
    gimnasios: GimnasioItem[]
    onUpdateGimnasio: (id: number) => void
    onDeleteGimnasio: (gimnasio: GimnasioItem) => void
    onReactivateGimnasio: (gimnasio: GimnasioItem) => void
}

const GimnasioList: React.FC<GimnasioListProps> = ({
    gimnasios,
    onUpdateGimnasio,
    onDeleteGimnasio,
    onReactivateGimnasio
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {gimnasios?.map(gimnasio => (
                            <GimnasioCard
                                key={gimnasio.id}
                                gimnasio={gimnasio}
                                onUpdate={onUpdateGimnasio}
                                onDelete={onDeleteGimnasio}
                                onReactivate={onReactivateGimnasio}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default GimnasioList