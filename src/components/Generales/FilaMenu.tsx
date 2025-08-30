import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import type { ReactNode } from 'react'; // Importar ReactNode

// Definir las interfaces para los items del menú
export interface MenuSubItem {
    path: string;
    label: string;
    icon?: ReactNode;
}

export interface MenuItem {
    path?: string; // Opcional porque puede tener subItems
    label: string;
    icon: ReactNode;
    subItems?: MenuSubItem[];
}

interface MenuItemProps {
    sidebarOpen: boolean;
    item: MenuItem; // Tipo definido
}

const MenuItem = ({ item, sidebarOpen }: MenuItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (item.subItems) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center w-full text-sm px-4 py-2 hover:bg-[var(--color-secondary)] transition-colors ${sidebarOpen ? 'justify-between' : 'justify-center'
                        }`}
                >
                    <div className="flex items-center">
                        {item.icon}
                        {sidebarOpen && <span className="ml-3">{item.label}</span>}
                    </div>
                    {sidebarOpen && (isOpen ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />)}
                </button>

                {isOpen && sidebarOpen && (
                    <div className="space-y-1">
                        {item.subItems.map((subItem, index) => (
                            <Link
                                key={index}
                                to={subItem.path}
                                className="flex items-center px-6 py-2 text-sm hover:bg-[var(--color-secondary)] transition-colors"
                            >
                                {subItem.icon && <span className="mr-3">{subItem.icon}</span>}
                                {subItem.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Validar que item.path existe cuando no hay subItems
    if (!item.path) {
        return null;
    }

    return (
        <Link
            to={item.path}
            className={`flex items-center px-4 py-2 text-sm hover:bg-[var(--color-secondary)] transition-colors ${sidebarOpen ? '' : 'justify-center'}`}
        >
            {item.icon}
            {sidebarOpen && <span className="ml-3">{item.label}</span>}
        </Link>
    );
};

export default MenuItem;