import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../../components/Utiles/Loader/Loader";
import { useNivelAcceso } from "../../hooks/NivelAcceso/useNivelAcceso";
import LoadError from "../../components/Generales/LoadError";
import { getErrorMessage } from "../../helpers/errorHelper";
import EmptyState from "../../components/Utiles/Page/EmptyState";
import PageHeader from "../../components/Utiles/Page/PageHeader";
import { NormalButton } from "../../components/Utiles/Buttons/NormalButton";
import { FaArrowLeft } from "react-icons/fa";
import PageContent from "../../components/Utiles/Page/PageContent";
import { motion } from 'framer-motion';
import { MdOutlineAdminPanelSettings, MdOutlineSecurity } from "react-icons/md";
import Badge from "../../components/Generales/Badge";
import { FiCheckCircle, FiClock, FiFileText, FiShield, FiUsers } from "react-icons/fi";
import { formatearFecha } from "../../helpers/formatHelpers";

const NivelAccesoDetallePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: nivelAcceso, error, isLoading, refetch } = useNivelAcceso(Number(id));

    const firstLoadRef = useRef(true);

    const isFirstLoading = isLoading && firstLoadRef.current;

    useEffect(() => {
        if (nivelAcceso) {
            firstLoadRef.current = false;
        }
    }, [nivelAcceso]);

    if (isFirstLoading) {
        return (
            <Loader
                delay={0}
                message="Cargando los detalles del nivel de acceso..."
            />
        );
    }

    if (error) {
        return (
            <LoadError
                titulo="Error al cargar detalles"
                mensaje={getErrorMessage(error) || "No se pudo obtener la información"}
                textoBoton='Reintentar'
                onReintentar={() => { refetch() }}
            />
        );
    }

    if (!nivelAcceso) {
        return (
            <EmptyState
                type={'empty'}
                title={'No se encontró el nivel de acceso'}
                description={'Al parecer no encontramos el nivel de acceso que estabas buscando'}
            />
        );
    }

    return (
        <>
            <PageHeader
                title={nivelAcceso.nombre || "Detalles del Gimnasio"}
                description="Información detallada sobre el nivel de acceso"
                action={
                    <NormalButton
                        type="button"
                        onClick={() => navigate(-1)}
                        tooltip='Regresar a la pág anterior'
                        className="hover:bg-gray-100 transition-colors"
                    >
                        <FaArrowLeft />
                        Volver
                    </NormalButton>
                }
            />

            <PageContent>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8"
                >
                    <div className="flex flex-col lg:flex-row">
                        {/* Sección izquierda - Mejorada con más jerarquía */}
                        <div className="lg:w-1/4 bg-gradient-to-br lg:rounded-l-2xl  from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] p-8 flex flex-col items-center justify-center relative">
                            <div className="absolute inset-0 bg-white/5"></div>
                            <div className="relative z-10 text-center">
                                <div className="bg-white/20 backdrop-blur-md rounded-full w-28 h-28 flex items-center justify-center mb-5 mx-auto border-2 border-white/30">
                                    <MdOutlineAdminPanelSettings className="text-white w-14 h-14" />
                                </div>
                                <Badge
                                    variant={nivelAcceso.activo === 'ACTIVO' ? 'success' : 'danger'}
                                    className={`backdrop-blur-md ${nivelAcceso.activo === 'ACTIVO' ? 'bg-green-600/70' : "bg-red-600/60"} border border-white/20 shadow-sm`}
                                >
                                    {nivelAcceso.activo === 'ACTIVO' ?
                                        <span className="text-green-100">Activo</span> :
                                        <span className="text-red-100">Inactivo</span>}
                                </Badge>
                            </div>
                        </div>

                        {/* Información principal */}
                        <div className="lg:w-3/4 p-8">
                            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{nivelAcceso.nombre}</h2>
                                    {nivelAcceso.descripcion && (
                                        <p className="text-gray-600 text-lg">{nivelAcceso.descripcion}</p>
                                    )}
                                </div>
                            </div>

                            {/* Grid de información mejorado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tarjeta de Rol Asociado */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <div className="flex items-center mb-3">
                                        <FiShield className="text-[var(--color-primary)] mr-3 text-xl" />
                                        <h3 className="text-lg font-semibold text-gray-800">Rol Asociado</h3>
                                    </div>
                                    <div className="pl-9">
                                        <p className="text-gray-800 font-medium text-lg mb-1">{nivelAcceso.rol?.nombre || 'No especificado'}</p>
                                        <p className="text-gray-500 text-sm">{nivelAcceso.rol?.usuariosConRol || 0} usuarios con este rol</p>
                                    </div>
                                </div>

                                {/* Tarjeta de Usuarios */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <div className="flex items-center mb-3">
                                        <FiUsers className="text-[var(--color-primary)] mr-3 text-xl" />
                                        <h3 className="text-lg font-semibold text-gray-800">Usuarios</h3>
                                    </div>
                                    <div className="pl-9">
                                        <p className="text-gray-800 font-medium text-lg">
                                            {nivelAcceso.usuariosConNivel || 0} usuario{nivelAcceso.usuariosConNivel !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Tarjeta de Fechas */}
                                <div className="md:col-span-2 bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <FiClock className="text-[var(--color-primary)] mr-3" />
                                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Registro</h3>
                                            </div>
                                            <p className="text-gray-800 pl-9">{formatearFecha(String(nivelAcceso.fechaRegistro))}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <FiFileText className="text-[var(--color-primary)] mr-3" />
                                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Modificación</h3>
                                            </div>
                                            <p className="text-gray-800 pl-9">{formatearFecha(String(nivelAcceso.fechaModificacion))}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sección de permisos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                >
                    {/* Header de permisos con acciones */}
                    <div className="border-b border-gray-100 p-6 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center">
                            <MdOutlineSecurity className="text-[var(--color-primary)] mr-3 text-2xl" />
                            <h3 className="text-xl font-semibold text-gray-900">
                                Permisos asignados <span className="text-gray-500">({nivelAcceso.permisos?.length || 0})</span>
                            </h3>
                        </div>
                    </div>

                    {/* Lista de permisos */}
                    <div className="p-6">
                        {nivelAcceso.permisos && nivelAcceso.permisos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {nivelAcceso.permisos.map((permiso) => (
                                    <div
                                        key={permiso.idPermiso}
                                        className="group border border-gray-200 rounded-xl p-5 hover:border-[var(--color-primary)]/30 transition-all hover:shadow-sm bg-white"
                                    >
                                        <div className="flex items-start">
                                            <div className="bg-green-100/80 group-hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 transition-colors">
                                                <FiCheckCircle className="text-green-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-1">{permiso.descripcion}</h4>
                                                {permiso.descripcion ? (
                                                    <p className="text-sm text-gray-500">{permiso.nombre}</p>
                                                ) : (
                                                    <p className="text-sm text-gray-400">Sin descripción</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center bg-gray-50">
                                <FiFileText className="mx-auto text-gray-300 w-10 h-10 mb-4" />
                                <h4 className="text-lg font-medium text-gray-500 mb-2">No hay permisos asignados</h4>
                                <p className="text-gray-400">Este nivel de acceso no tiene permisos configurados</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </PageContent>
        </>
    )
}

export default NivelAccesoDetallePage

// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import Loader from "../../components/Utiles/Loader/Loader";
// import LoadError from "../../components/Generales/ErrorCarga";
// import NivelAccesoDetails from "../../components/NivelAcceso/NivelAccesoDetails";
// import { obtenerNivelAccesoEspecifico } from "../../api/nivelAcceso"; // Asegúrate de tener esta función en tu API

// const NivelAccesoDetallePage = () => {
//     const { id } = useParams();

//     // Consulta para obtener el nivel de acceso
//     const {
//         data: nivelAcceso,
//         isLoading,
//         isError,
//         error,
//         refetch,
//     } = useQuery({
//         queryKey: ["nivelAcceso", id],
//         queryFn: () => obtenerNivelAccesoEspecifico(id),
//         enabled: !!id, // Solo ejecuta si hay un ID válido
//     });

//     // Render states
//     if (isLoading) {
//         return <Loader message="Cargando detalles del nivel de acceso..." />;
//     }

//     if (isError) {
//         return (
//             <LoadError
//                 titulo="Error al cargar la información del nivel de acceso"
//                 mensaje={error.message || "Ocurrió un error inesperado"}
//                 textoBoton="Reintentar"
//                 onReintentar={refetch} // React Query maneja el reintento automáticamente
//             />
//         );
//     }

//     return <NivelAccesoDetails nivelAcceso={nivelAcceso?.datos} />;
// };

// export default NivelAccesoDetallePage;