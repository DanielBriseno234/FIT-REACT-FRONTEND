import React from 'react'
import type { UsuarioItem } from '../../interfaces/Usuario/Usuario'
import UsuarioCard from './UsuarioCard'
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from '../../store/authStore'

interface UsuarioListProps {
    usuarios: UsuarioItem[]
    onUpdateUsuario: (id: number) => void
    onDeleteUsuario: (usuario: UsuarioItem) => void
    onReactivateUsuario: (usuario: UsuarioItem) => void
    onBlockUsuario: (usuario: UsuarioItem) => void
    onChangePassUsuario: (usuario: UsuarioItem) => void
}

const UsuarioList: React.FC<UsuarioListProps> = ({
    usuarios,
    onUpdateUsuario,
    onDeleteUsuario,
    onReactivateUsuario,
    onBlockUsuario,
    onChangePassUsuario
}) => {
    const { user } = useAuthStore();

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {usuarios
                            .filter(usuario => usuario.id !== user?.id)
                            .map(usuario => (
                                <UsuarioCard
                                    key={usuario.id}
                                    usuario={usuario}
                                    onUpdate={onUpdateUsuario}
                                    onDelete={onDeleteUsuario}
                                    onReactivate={onReactivateUsuario}
                                    onBlock={onBlockUsuario}
                                    onChangePass={onChangePassUsuario}
                                />
                            ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default UsuarioList
