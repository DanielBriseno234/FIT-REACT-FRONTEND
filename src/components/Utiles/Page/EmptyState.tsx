// components/Utiles/EmptyState.jsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FaSearch, FaInbox, FaFrown } from 'react-icons/fa';

type EmptyStateProps = {
    type: "search" | "empty"
    title: string
    description: string
    actionButton?: ReactNode
}

const EmptyState: React.FC<EmptyStateProps> = ({
    type,
    title,
    description,
    actionButton
}) => {
    const icons = {
        search: <FaSearch className="text-gray-400 text-4xl mb-3" />,
        empty: <FaInbox className="text-gray-400 text-4xl mb-3" />,
        error: <FaFrown className="text-gray-400 text-4xl mb-3" />,
        default: <FaInbox className="text-gray-400 text-4xl mb-3" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
            <div className="mb-1">
                {icons[type] || icons.default}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
                {title || 'No hay resultados'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
                {description || (type === 'search'
                    ? 'No encontramos coincidencias con tu búsqueda'
                    : 'No hay elementos para mostrar')}
            </p>
            {actionButton && (
                <div className="mt-6">
                    {actionButton}
                </div>
            )}
        </motion.div>
    );
};

export default EmptyState;