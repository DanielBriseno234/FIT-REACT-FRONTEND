import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useConfigStore } from './store/configStore';

import { LoginPage } from './pages/Auth/LoginPage';
import { PrivateRoute } from './components/Protectores/PrivateRoute';
import { ProtectedRoute } from './components/Protectores/ProtectedRoute';
// import { useAuthInit } from './hooks/useAuthInit';
import AuthLayout from './layouts/AuthLayout';
import { SolicitudRecuperarContrasenaPage } from './pages/Auth/SolicitudRecuperarContrasenaPage';
import { VerificacionCuentaPage } from './pages/Auth/VerificacionCuentaPage';
import { RecuperarContrasenaPage } from './pages/Auth/RecuperarContrasenaPage';
import { ConfiguracionGlobalForm } from './components/Generales/ConfiguracionGlobalForm';
import SeleccionarRolComponent from './components/Generales/SeleccionarRolComponent';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';
import { EntrenadorDashboardPage } from './pages/Entrenador/EntrenadorDashboardPage';
import { SocioDashboardPage } from './pages/Socio/SocioDashboardPage';
import { RecepcionistaDashboardPage } from './pages/Recepcionista/RecepcionistaDashboardPage';
import NotFoundPage from './pages/Generales/NotFoundPage';
import ForbiddenPage from './pages/Generales/ForbiddenPage';
import DashboardLayout from './layouts/DashboardLayout';
import GimnasioDetallePage from './pages/Admin/GimnasioDetallePage';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { aplicarColoresAlDocumento } from './helpers/colorHelper';
import RolPage from './pages/Admin/RolPage';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConfiguracionGlobalPage from './pages/Admin/ConfiguracionGlobalPage';
import GimnasiosPage from './pages/Admin/GimnasiosPage';
import UsuarioPage from './pages/Admin/UsuarioPage';
import NivelAccesoPage from './pages/Admin/NivelAccesoPage';
import NivelAccesoDetallePage from './pages/Admin/NivelAccesoDetallePage';
import PerfilUsuarioPage from './pages/Generales/PerfilUsuarioPage';

const queryClient = new QueryClient();

export default function App() {
  const { cargarConfig } = useConfigStore();

  useEffect(() => {
    const obtenerConfiguracion = async () => {
      const storedConfig = localStorage.getItem('config-storage')
        ? JSON.parse(localStorage.getItem('config-storage')!)
        : null;


      if (storedConfig?.state?.configuracion) {
        aplicarColoresAlDocumento(storedConfig.state.configuracion);
      } else {
        const result = await cargarConfig();
        if (!result.success) {
          toast.error(result.mensaje);
        }
      }

    }
    obtenerConfiguracion();
  }, []);

  // useAuthInit();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas generales */}
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* Rutas de autenticación */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/solicitud-recuperacion-contrasena" element={<SolicitudRecuperarContrasenaPage />} />
            <Route path="/recuperacion-contrasena/:token" element={<RecuperarContrasenaPage />} />
            <Route path="/verificacion-usuario/:token" element={<VerificacionCuentaPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/seleccionar-rol" element={<SeleccionarRolComponent />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/configuracion-inicial" element={<ConfiguracionGlobalForm />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/perfil" element={<PerfilUsuarioPage />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />

              <Route
                path="/admin/configuracion-global"
                element={
                  <ProtectedRoute requiredPermissions={['configuracion.ver']}>
                    <ConfiguracionGlobalPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/roles"
                element={
                  <ProtectedRoute requiredPermissions={['usuario.ver']}>
                    <RolPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/niveles-acceso"
                element={
                  <ProtectedRoute requiredPermissions={['usuario.ver']}>
                    <NivelAccesoPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/niveles-acceso/:id"
                element={<NivelAccesoDetallePage />}
              />

              <Route
                path="/admin/usuarios"
                element={
                  <ProtectedRoute requiredPermissions={['usuario.ver']}>
                    <UsuarioPage />
                  </ProtectedRoute>
                }
              />

            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={['RECEPCIONISTA']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/recepcionista/*" element={<RecepcionistaDashboardPage />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={['ENTRENADOR']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/entrenador/*" element={<EntrenadorDashboardPage />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={['SOCIO']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/socio/*" element={<SocioDashboardPage />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={['ADMIN', 'RECEPCIONISTA']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/gimnasios" element={
                <ProtectedRoute requiredPermissions={['gimnasio.ver']}>
                  <GimnasiosPage />
                </ProtectedRoute>
              } />
              <Route path="/gimnasios/:id" element={<GimnasioDetallePage />} />
            </Route>
          </Route>


          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}