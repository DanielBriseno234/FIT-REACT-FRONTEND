import { FiUsers, FiEdit, FiClock, FiCheckCircle, FiFileText, FiShield } from 'react-icons/fi';
import { MdOutlineAdminPanelSettings, MdOutlineSecurity } from 'react-icons/md';
import PageContent from '../Utiles/Pagina/PageContent';
import { useNavigate } from "react-router-dom";
import NormalButton from '../Utiles/Botones/NormalButton';
import PageHeader from '../Utiles/Pagina/PageHeader';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import Badge from '../Generales/Badge';
import { formatearFecha } from '../../helpers/formatHelpers';

const NivelAccesoDetails = ({ nivelAcceso }) => {
    const navigate = useNavigate();

    if (!nivelAcceso) return null;

    return (
        <>
            <PageHeader
                title={nivelAcceso.nombre || "Detalles del Nivel de Acceso"}
                description="Información detallada sobre los permisos y configuración"
                action={
                    <NormalButton
                        type="button"
                        onClick={() => navigate(-1)}
                        text="Volver"
                        tooltip='Regresar a la pág anterior'
                        icon={<FaArrowLeft className="mr-2" />}
                        className="hover:bg-gray-100 transition-colors"
                        aria-label="Volver a la página anterior"
                    />
                }
            />

            <PageContent>
                {/* Tarjeta principal - Versión mejorada */}
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
                                <div className="mt-4 text-white/90">
                                    <p className="text-sm font-medium">ID: {nivelAcceso.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información principal - Mejor estructura visual */}
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
                                            <p className="text-gray-800 pl-9">{formatearFecha(nivelAcceso.fechaRegistro)}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <FiFileText className="text-[var(--color-primary)] mr-3" />
                                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Modificación</h3>
                                            </div>
                                            <p className="text-gray-800 pl-9">{formatearFecha(nivelAcceso.fechaModificacion)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sección de permisos - Versión mejorada */}
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

                    {/* Lista de permisos mejorada */}
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
    );
};

export default NivelAccesoDetails;