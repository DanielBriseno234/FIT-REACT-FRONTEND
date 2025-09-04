import type { MembresiaItem } from "../../interfaces/membresia/Membresia"
import { motion, AnimatePresence } from "framer-motion"
import MembresiaCard from "./MembresiaCard"

interface MembresiaListProps {
    membresias: MembresiaItem[],
    onUpdateMembresia: (id: number) => void
    onInactivateMembresia: (membresia: MembresiaItem) => void
    onReactivateMembresia: (membresia: MembresiaItem) => void
}

const MembresiaList: React.FC<MembresiaListProps> = ({
    membresias,
    onUpdateMembresia,
    onInactivateMembresia,
    onReactivateMembresia
}) => {
    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {membresias.map(membresia => (
                            <MembresiaCard
                                membresia={membresia}
                                onUpdate={onUpdateMembresia}
                                onInactivate={onInactivateMembresia}
                                onReactivate={onReactivateMembresia}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default MembresiaList
