import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authAPI from '../api/auth';
import * as configAPI from '../api/config';
import { rutaPorRol } from '../helpers/rutaPorRol';
import type { UsuarioOutputType } from '../interfaces/Usuario/Usuario';
import { getErrorMessage } from '../helpers/errorHelper';


/* ---------- Respuesta de acciones del store ---------- */
type ResponseAuthStore = {
  success: boolean;
  mensaje: string;
  necesitaConfiguracionInicial?: boolean;
  redirigir?: string;
}

export type RolActivo = {
  id: number
  nombre: string
  descripcion: string
}

/* ---------- Estado del Auth Store ---------- */
type AuthState = {
  user: UsuarioOutputType | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rolActivo: RolActivo | null;

  setToken: (newToken: string | null) => void;
  limpiarInfoUsuario: () => void;
  login: (email: string, contrasena: string) => Promise<ResponseAuthStore>;
  logout: () => Promise<ResponseAuthStore>;
  solicitudRecuperarContrasena: (email: string) => Promise<ResponseAuthStore>;
  verificarTokenRecuperacionContrasena: (token: string) => Promise<ResponseAuthStore>;
  recuperarContrasena: (token: string, nuevaContrasena: string, confirmacionContrasena: string) => Promise<ResponseAuthStore>;
  verificarCuenta: (token: string) => Promise<ResponseAuthStore>;
  setRolActivo: (rol: RolActivo | null) => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      rolActivo: null,

      setToken: (newToken) => set({ token: newToken }),

      limpiarInfoUsuario: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          rolActivo: null
        });
      },

      login: async (email, contrasena) => {

        try {
          const result = await authAPI.login(email, contrasena);

          const { datos } = result;

          // Datos base comunes a todos los usuarios
          const userData: UsuarioOutputType = {
            token: {
              token: datos.token.token,
              refreshToken: datos.token.refreshToken
            },
            email: datos.email,
            nombres: datos.nombres,
            apellidoPaterno: datos.apellidoPaterno,
            apellidoMaterno: datos.apellidoMaterno,
            telefono: datos.telefono,
            urlFotoPerfil: datos.urlFotoPerfil,
            genero: datos.genero,
            gimnasioRegistro: datos.gimnasioRegistro,
            roles: datos.roles,
            gimnasiosPermitidos: datos.gimnasiosPermitidos,
            estatus: datos.estatus
          };

          // Agregamos datos específicos según los roles
          datos.roles.forEach(rol => {
            const rolNombre = rol.rol.nombre.toLowerCase();

            if (rolNombre === 'recepcionista' && datos.recepcionista) {
              userData.recepcionista = {
                id: datos.recepcionista.id,
                biografia: datos.recepcionista.biografia,
                fechaContratacion: datos.recepcionista.fechaContratacion
              };
            }

            if (rolNombre === 'entrenador' && datos.entrenador) {
              userData.entrenador = {
                id: datos.entrenador.id,
                biografia: datos.entrenador.biografia,
                fechaContratacion: datos.entrenador.fechaContratacion
              };
            }

            if (rolNombre === 'socio' && datos.socio) {
              userData.socio = {
                id: datos.socio.id,
                noSocio: datos.socio.noSocio,
                fechaIngreso: datos.socio.fechaIngreso,
                fechaNacimiento: datos.socio.fechaNacimiento,
                direccion: datos.socio.direccion,
                nss: datos.socio.nss,
                tipoSangre: datos.socio.tipoSangre
              };
            }
          });

          // Actualizamos el estado global
          set({
            user: userData,
            token: datos.token.token,
            refreshToken: datos.token.refreshToken,
            isAuthenticated: true,
          });

          const esAdmin = datos.roles.some(rol => rol.rol.id === 1);

          // Solo si es administrador verificamos la configuración inicial
          if (esAdmin) {
            try {
              await configAPI.obtenerConfiguracion();
            } catch {
              return {
                success: true,
                necesitaConfiguracionInicial: true,
                redirigir: '/configuracion-inicial',
                mensaje: 'Se requiere realizar la configuración inicial'
              };
            }
          }

          // Manejo de redirección según cantidad de roles
          if (datos.roles.length > 1) {
            return {
              success: true,
              necesitaConfiguracionInicial: false,
              redirigir: '/seleccionar-rol',
              mensaje: result.mensaje
            };
          } else {
            return {
              success: true,
              necesitaConfiguracionInicial: false,
              redirigir: rutaPorRol(datos.roles[0].rol.nombre),
              mensaje: result.mensaje
            };
          }

        } catch (error) {
          return { success: false, mensaje: getErrorMessage(error) };
        }

      },

      logout: async () => {
        const { refreshToken } = useAuthStore.getState();

        try {
          const result = await authAPI.logout(refreshToken || "");
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
            rolActivo: null
          });
          return { success: true, mensaje: result.mensaje };
        } catch (error) {
          return { success: false, mensaje: getErrorMessage(error) };
        }
      },

      solicitudRecuperarContrasena: async (email) => {
        try {
          const result = await authAPI.solicitudRecuperarContrasena(email);
          return { success: true, mensaje: result.mensaje };
        } catch (error) {
          return { success: false, mensaje: getErrorMessage(error) }
        }
      },

      verificarTokenRecuperacionContrasena: async (token) => {
        try {
          const result = await authAPI.verificarTokenRecuperacionContrasena(token);
          return { success: true, mensaje: result.mensaje }
        } catch (error) {
          return { success: false, mensaje: getErrorMessage(error) }
        }
      },

      recuperarContrasena: async (token, nuevaContrasena, confirmacionContrasena) => {
        try {
          const result = await authAPI.recuperarContrasena(token, nuevaContrasena, confirmacionContrasena);
          return { success: true, mensaje: result.mensaje };
        } catch (error) {
          return { success: false, mensaje: getErrorMessage(error) };
        }

      },

      verificarCuenta: async (token) => {
        try {
          const result = await authAPI.verificarCuenta(token);
          return { success: true, mensaje: result.mensaje };
        } catch (error) {
          return { success: false, mensaje: getErrorMessage(error) };
        }
      },

      setRolActivo: (rol) => set({ rolActivo: rol }),

    }),
    {
      name: 'gym-auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rolActivo: state.rolActivo
      })
    }
  )
);