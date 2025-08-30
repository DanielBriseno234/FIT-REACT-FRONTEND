import jwtDecode from "jwt-decode";

// Interfaz para el payload del JWT (al menos la propiedad exp)
interface JwtPayload {
  exp: number; // tiempo de expiración en segundos desde epoch
}

// Función que revisa si un token JWT está expirado
export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() >= exp * 1000;
  } catch {
    // Si no se puede decodificar, asumimos que el token está expirado o es inválido
    return true;
  }
};
