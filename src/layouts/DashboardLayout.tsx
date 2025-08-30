import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useConfigStore } from "../store/configStore";
import { FaSignOutAlt, FaExchangeAlt, FaUser } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import FilaMenu from "../components/Generales/FilaMenu";
import { getMenuItems } from "../components/Generales/ObtenerMenu";
import {
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { NormalButton } from "../components/Utiles/Buttons/NormalButton";

interface ProfileMenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const DashboardLayout = () => {
  const { user, rolActivo, logout } = useAuthStore();

  const { configuracion } = useConfigStore();

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Permisos del rol activo
  const permisos =
    user?.roles.find((r) => r.rol.nombre === rolActivo?.nombre)
      ?.nivelAcceso.permisos || [];


  const menuItems = getMenuItems(rolActivo, permisos);

  const cerrarSesion = async () => {
    const result = await logout();
    if (result.success) {
      toast.success(result.mensaje);
      navigate("/login");
    } else {
      toast.error(result.mensaje);
    }
  };

  const handleSeleccionarRol = () => {
    if (user && user.roles.length > 1) {
      navigate("/seleccionar-rol");
    }
  };

  const profileMenuItems: ProfileMenuItem[] = [
    {
      label: "Mi Perfil",
      icon: <FaUser />,
      action: () => navigate("/perfil"),
    },
    {
      label: "Cambiar Rol",
      icon: <FaExchangeAlt />,
      action: () => navigate("/seleccionar-rol"),
    },
    {
      label: "Cerrar Sesión",
      icon: <FaSignOutAlt className="text-[var(--color-error)]" />,
      action: cerrarSesion,
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full z-50 bg-gradient-to-b from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-white transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-0 md:w-16"} overflow-hidden`}
        >
          {/* Top Section */}
          <div
            className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"
              } px-2 py-2 border-b-1 border-b-[var(--color-secondary)]`}
          >
            {sidebarOpen && (
              <div className="flex items-center flex-1 min-w-0 py-1">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-1 mr-3 bg-white border-b-[var(--color-secondary)] overflow-hidden flex-shrink-0">
                  <img
                    src={
                      configuracion?.logoUrl
                        ? configuracion.logoUrl
                        : "/images/logo-default.png"
                    }
                    alt="Logo"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-md font-bold truncate max-w-[200px] md:max-w-[230px]">
                  {configuracion?.nombreFranquicia || "FITQIK"}
                </span>
              </div>
            )}
            <div className="py-1">
              <IconButton
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] md:block flex-shrink-0 transition-all duration-300"
              >
                <CiMenuBurger size={22} />
              </IconButton>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-2 space-y-1">
            {menuItems.map((item: any, index: number) => (
              <FilaMenu key={index} item={item} sidebarOpen={sidebarOpen} />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow flex items-center justify-between px-4 md:px-6 py-1 relative">
            <div className="flex items-center gap-4">
              {/* Botón hamburguesa móvil */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded hover:bg-gray-200"
              >
                <CiMenuBurger size={22} />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-md md:text-xl font-semibold text-gray-800">
                  Bienvenido, {user?.nombres || "Administrador"}
                </h1>
                <p className="text-xs text-gray-500">Panel de control</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Botón selector de rol */}
              <div className="hidden sm:block">
                <NormalButton
                  onClick={handleSeleccionarRol}
                  className="rounded-full"
                  tooltip={"Cambiar Rol"}
                >
                  <FaExchangeAlt />
                  <span className="text-xs font-medium">
                    {rolActivo?.nombre?.substring(0, 5) || "Rol"}
                  </span>
                </NormalButton>
              </div>

              {/* Avatar con menú desplegable */}
              <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                <MenuHandler>
                  <Button variant="text" color="blue-gray" className="p-2">
                    <div className="flex items-center gap-3 pl-2">
                      <div className="text-right">
                        <Typography variant="h6">{user?.nombres}</Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          {rolActivo?.nombre}
                        </Typography>
                      </div>
                      {user?.fotoPerfil ? (
                        <Avatar
                          size="md"
                          alt={user.nombres}
                          withBorder={true}
                          color="blue-gray"
                          className="p-0.5 h-10 w-10 border-0 flex items-center"
                          src={user.fotoPerfil}
                        />
                      ) : (
                        <div className="flex items-center rounded-full h-10 w-10 justify-center bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-white font-medium">
                          {user?.nombres
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Button>
                </MenuHandler>
                <MenuList className="p-1 absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 border-0">
                  {/* Encabezado */}
                  <div className="flex items-center px-2 py-2 border-b border-gray-200 gap-2">
                    {user?.fotoPerfil ? (
                      <Avatar
                        variant="circular"
                        size="md"
                        alt={user.nombres}
                        withBorder={true}
                        color="blue-gray"
                        className="p-0.5 rounded-full h-12 w-12"
                        src={user.fotoPerfil}
                      />
                    ) : (
                      <div className="flex items-center h-10 w-10 justify-center rounded-full bg-[var(--color-primary)] text-white font-medium shadow-xl ring-4 ring-green-500/30">
                        {user?.nombres
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
                        {user?.nombres || "Usuario"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[160px]">
                        {user?.email}
                      </p>
                      <p className="text-xs text-[var(--color-primary)] font-medium mt-1">
                        {rolActivo?.nombre}
                      </p>
                    </div>
                  </div>

                  {profileMenuItems.map(({ label, icon, action }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                      <MenuItem
                        key={label}
                        onClick={action}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex gap-3 items-center"
                      >
                        {icon}
                        <Typography
                          as="span"
                          variant="small"
                          className={`font-normal text-left ${isLastItem ? "text-[var(--color-error)]" : ""
                            }`}
                          color="inherit"
                        >
                          {label}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 bg-white rounded-sm p-2 m-2 overflow-y-auto">
            <Outlet />
          </main>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white border-t border-gray-200 py-3 px-4"
          >
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                © {new Date().getFullYear()}{" "}
                {configuracion?.nombreFranquicia || "FITQIK"}
              </span>
              <span>v1.0.0</span>
            </div>
          </motion.footer>
        </div>

        {/* Overlay móvil */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black opacity-40 md:hidden"
          ></div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
