import type React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisibleButtons = 5;

    const getPageNumbers = () => {
        const half = Math.floor(maxVisibleButtons / 2);
        let start = Math.max(currentPage - half, 0);
        const end = Math.min(start + maxVisibleButtons - 1, totalPages - 1);

        if (end - start + 1 < maxVisibleButtons) {
            start = Math.max(end - maxVisibleButtons + 1, 0);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="flex justify-center items-center space-x-1">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-md ${currentPage === page
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'hover:bg-gray-100'
                        }`}
                >
                    {page + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;