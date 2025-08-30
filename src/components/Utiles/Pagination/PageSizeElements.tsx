import React from 'react'

interface PageSizeElementsProps {
    pageSize: number;
    onPageSizeChange: (size: number) => void;
}

const PageSizeElements: React.FC<PageSizeElementsProps> = ({ pageSize, onPageSizeChange }) => {
    return (
        <div className="flex items-center gap-2">
            <label className="text-sm">Mostrar:</label>
            <select
                className="border rounded px-2 py-1"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
                {[1, 3, 6, 9, 12, 20].map(size => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
            por página
        </div>
    );
}

export default PageSizeElements