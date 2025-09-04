import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { rutaPorRol } from '../../helpers/rutaPorRol';
import { motion } from 'framer-motion';
import { FaArrowRight, FaUserShield } from 'react-icons/fa';
import { GiMuscularTorso } from "react-icons/gi";
import type { Rol } from '../../interfaces/Usuario/UsuarioLogin';

export default function SeleccionarRolComponent() {
  const navigate = useNavigate();
  const { user, setRolActivo } = useAuthStore();
  const roles = user?.roles || [];

  const handleSeleccionar = (rol: Rol) => {
    setRolActivo(rol);
    navigate(rutaPorRol(rol.nombre));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 w-full max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Barra superior con gradiente */}
        <div className="h-1.5 bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]"></div>

        {/* Contenido principal */}
        <div className="px-8 py-10">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-[var(--color-primary)] border border-[var(--color-secondary)] backdrop-blur-sm">
                <GiMuscularTorso className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.nombres || 'Usuario'}</h1>
            <p className="text-[var(--color-primary)] mt-2 text-sm font-medium tracking-wider">SELECCIONA TU ROL</p>
          </div>

          {/* Mensaje descriptivo */}
          <p className="text-center text-gray-600 mb-8 w-full mx-auto">
            Tu cuenta tiene acceso a múltiples perfiles. Selecciona el rol con el que deseas continuar.
          </p>

          {/* Grid de roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map(({ rol }) => (
              <motion.div
                key={rol.id}
                className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center border border-[var(--color-primary)] shadow-sm
                           hover:shadow-md hover:border-[var(--color-secondary)] transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSeleccionar(rol)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSeleccionar(rol); }}
                aria-label={`Seleccionar rol ${rol.nombre}`}
              >
                <div className="mb-4 p-3 rounded-full bg-[var(--color-primary)] border border-[var(--color-secondary)]">
                  <FaUserShield className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{rol.nombre}</h3>
                <p className="text-sm text-gray-500 mt-2 min-h-[3rem]">
                  {rol.descripcion || 'Acceso al sistema'}
                </p>
                <div className="mt-3 flex items-center text-[var(--color-primary)] group">
                  <span className="text-sm font-medium mr-2 group-hover:mr-3 transition-all">Seleccionar</span>
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}