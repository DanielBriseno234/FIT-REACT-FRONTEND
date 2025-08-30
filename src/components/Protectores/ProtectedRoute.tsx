import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermissions?: string[];
}

export const ProtectedRoute = ({
    children,
    requiredPermissions = [],
}: ProtectedRouteProps) => {
    const { rolActivo, user } = useAuthStore();
    const location = useLocation();

    // Verificar si hay usuario autenticado
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si no se requieren permisos, permitir acceso
    if (!requiredPermissions.length) {
        return <>{children}</>;
    }

    // Validar roles del usuario
    if (!user.roles || !Array.isArray(user.roles)) {
        return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    // Obtener rol activo y permisos
    const activeRole = user.roles.find(
        (r) => r.rol?.nombre === rolActivo?.nombre
    );
    const userPermissions =
        activeRole?.nivelAcceso?.permisos?.map((p) => p.nombre) || [];

    // Validar si el usuario tiene todos los permisos requeridos
    const hasAllPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
        return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
