import { FaHome, FaUsers } from 'react-icons/fa';
import { FaUserGroup } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineVerifiedUser, MdSupervisedUserCircle } from 'react-icons/md';
import { PiBuildingOffice } from "react-icons/pi";
import type { ReactNode } from 'react';
import type { RolActivo } from '../../store/authStore';

// export type RolNombre = 'ADMIN' | 'RECEPCIONISTA' | 'ENTRENADOR' | 'SOCIO';

export interface Permiso {
    nombre: string;
}

export interface MenuSubItem {
    path: string;
    label: string;
    icon: ReactNode;
    roles: string[];
    permiso?: string | null;
}

export interface MenuItem {
    path?: string;
    label: string;
    icon: ReactNode;
    roles: string[];
    permiso?: string | null;
    subItems?: MenuSubItem[];
}

export const getMenuItems = (rolActivo: RolActivo | null, permissions: Permiso[] = []): MenuItem[] => {
    // Función para verificar permisos
    const tienePermiso = (perm: string | null | undefined): boolean => {
        if (!perm) return true; // Si no requiere permiso, se permite
        if (!Array.isArray(permissions)) return false;
        return permissions.some(p => p.nombre === perm);
    };

    // Verificar si el rol está activo y tiene nombre
    const nombreRol = rolActivo?.nombre;
    if (!nombreRol) return [];

    const menuItems: MenuItem[] = [
        {
            path: `/${nombreRol.toLowerCase()}`,
            icon: <FaHome />,
            label: "Dashboard",
            roles: ['ADMIN', 'RECEPCIONISTA', 'ENTRENADOR', 'SOCIO'],
            permiso: null
        },
        {
            path: '/admin/configuracion-global',
            icon: <IoMdSettings />,
            label: "Configuración Global",
            roles: ['ADMIN'],
            permiso: 'configuracion.ver'
        },
        {
            path: '/gimnasios',
            icon: <PiBuildingOffice />,
            label: "Gimnasios",
            roles: ['ADMIN', 'RECEPCIONISTA'],
            permiso: undefined // Puede ser undefined o null
        },
        {
            label: "Usuarios y Permisos",
            icon: <FaUsers />,
            roles: ['ADMIN'],
            subItems: [
                {
                    path: "/admin/roles",
                    label: "Roles",
                    icon: <MdSupervisedUserCircle />,
                    roles: ['ADMIN'],
                    permiso: 'usuario.ver'
                },
                {
                    path: "/admin/niveles-acceso",
                    label: "Niveles Acceso",
                    icon: <MdOutlineVerifiedUser />,
                    roles: ['ADMIN'],
                    permiso: 'usuario.ver'
                },
                {
                    path: "/admin/usuarios",
                    label: "Usuarios",
                    icon: <FaUserGroup />,
                    roles: ['ADMIN'],
                    permiso: 'usuario.ver'
                }
            ]
        }
    ];

    return menuItems.filter(item => {
        const tieneRol = item.roles.includes(nombreRol);

        // Si tiene submenús → mostrar si al menos uno es válido
        if (item.subItems) {
            const subItemsValidos = item.subItems.some(sub =>
                sub.roles.includes(nombreRol) &&
                tienePermiso(sub.permiso)
            );
            return tieneRol && subItemsValidos;
        }

        // Si no tiene submenús → validar normalmente
        return tieneRol && tienePermiso(item.permiso);
    });
};