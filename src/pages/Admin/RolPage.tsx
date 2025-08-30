import { IoIosInformationCircleOutline } from "react-icons/io";
import LoadError from "../../components/Generales/LoadError";
import Loader from "../../components/Utiles/Loader/Loader";
import PageContent from "../../components/Utiles/Page/PageContent";
import PageHeader from "../../components/Utiles/Page/PageHeader";
import { getErrorMessage } from "../../helpers/errorHelper";
import { useRoles } from "../../hooks/useRoles"
import { Alert } from "@material-tailwind/react";
import EmptyState from "../../components/Utiles/Page/EmptyState";
import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";

const RolPage = () => {
    const { data: roles, error, isFirstLoading, refetch } = useRoles();

    const getRoleColor = (id: number) => {
        const colors = [
            "bg-gradient-to-r from-purple-500 to-indigo-600", // Admin
            "bg-gradient-to-r from-blue-500 to-teal-400",     // Recepcionista
            "bg-gradient-to-r from-green-500 to-blue-400", // Entrenador
            "bg-gradient-to-r from-amber-500 to-orange-500",  // Socio
            "bg-gradient-to-r from-pink-500 to-rose-500",     // Extra 1
            "bg-gradient-to-r from-cyan-500 to-sky-600",      // Extra 2
            "bg-gradient-to-r from-violet-500 to-fuchsia-500" // Extra 3
        ];
        return colors[id % colors.length] || colors[0];
    };

    if (isFirstLoading) {
        return (
            <Loader
                delay={0}
                message="Cargando Roles..."
            />
        );
    }

    if (error) {
        return (
            <LoadError
                titulo="Error al cargar los roles"
                mensaje={getErrorMessage(error) || "No se pudo obtener la lista de roles"}
                textoBoton='Reintentar'
                onReintentar={() => { refetch() }}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Gestión de Roles"
                description="Administra los roles de tu sistema"
            />
            <PageContent>
                <Alert
                    icon={<IoIosInformationCircleOutline className="h-6 w-6" />}
                    className="bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]"
                >
                    Por el momento, no es posible registrar o modificar los roles actuales
                </Alert>

                {!roles || roles.length === 0 ? (
                    <EmptyState
                        type="empty"
                        title="No hay roles"
                        description="No se encontraron roles disponibles"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map((rol, index) => (
                            <motion.div
                                key={rol.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                                }}
                                transition={{
                                    type: "tween",
                                    ease: "easeOut",
                                    duration: 0.3,
                                    delay: index * 0.05,
                                    // hover: { duration: 0.2 },
                                }}
                                className="rounded-xl shadow-lg overflow-hidden flex flex-col h-full relative"
                            >
                                {/* Encabezado con gradiente */}
                                <div className={`${getRoleColor(rol.id - 1)} h-20 flex items-end p-6`}>
                                    <h3 className="text-white text-2xl font-bold">{rol.nombre}</h3>
                                </div>

                                {/* Contenido del card */}
                                <div className="bg-white p-6 flex-grow flex flex-col">
                                    <p className="text-gray-600">{rol.descripcion}</p>
                                </div>

                                {/* Pie de card */}
                                <div className="px-6 pb-4 pt-3 bg-gray-50 border-t border-gray-100">
                                    <div className="flex items-center text-gray-500">
                                        <FiUsers className="mr-2" />
                                        <span className="text-sm">
                                            {rol.usuariosConRol || 0} usuario{rol.usuariosConRol !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </PageContent>
        </>
    )
}

export default RolPage