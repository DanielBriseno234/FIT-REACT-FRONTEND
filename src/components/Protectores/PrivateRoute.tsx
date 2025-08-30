import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles = [] }) => {
  const { isAuthenticated, rolActivo, user, setRolActivo } = useAuthStore();

  useEffect(() => {
    if (allowedRoles.length > 0) {
      const userRoles = user?.roles || [];
      if (!allowedRoles.includes(rolActivo?.nombre || '')) {
        const firstAllowedRole = userRoles.find(userRole =>
          allowedRoles.includes(userRole.rol.nombre)
        )?.rol;

        if (firstAllowedRole) {
          toast.success(`Rol cambiado a ${firstAllowedRole.nombre}`);
          setRolActivo(firstAllowedRole);
        }
      }
    }
  }, [allowedRoles, rolActivo, user, setRolActivo]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasAllowedRole = userRoles.some(userRole => allowedRoles.includes(userRole.rol.nombre));

    if (!hasAllowedRole) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <Outlet />;
};
