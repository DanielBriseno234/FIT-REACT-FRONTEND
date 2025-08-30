type RolNombre = 'ADMIN' | 'RECEPCIONISTA' | 'ENTRENADOR' | 'SOCIO';

export const rutaPorRol = (rolNombre: RolNombre | string): string => {
  switch (rolNombre.toUpperCase()) {
    case 'ADMIN':
      return '/admin';
    case 'RECEPCIONISTA':
      return '/recepcionista';
    case 'ENTRENADOR':
      return '/entrenador';
    case 'SOCIO':
      return '/socio';
    default:
      return '/not-found';
  }
};
