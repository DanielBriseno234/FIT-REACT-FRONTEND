import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/Utiles/Page/PageHeader';
import { NormalButton } from '../../components/Utiles/Buttons/NormalButton';
import { FaArrowLeft, FaMoneyBillWave, FaCalendarAlt, FaDoorOpen, FaDumbbell, FaCheck, FaTimes, FaBuilding, FaIdCard, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion'
import PageContent from '../../components/Utiles/Page/PageContent';
import { useEffect, useRef } from 'react';
import { useMembresia } from '../../hooks/Membresia/useMembresia';
import Loader from '../../components/Utiles/Loader/Loader';
import LoadError from '../../components/Generales/LoadError';
import { getErrorMessage } from '../../helpers/errorHelper';
import { Chip } from '@material-tailwind/react';
import Badge from '../../components/Generales/Badge';
import { formatearPrecio } from '../../helpers/formatHelpers';

const MembresiaDetallePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data: membresia, error, isLoading, refetch } = useMembresia(Number(id));

    const firstLoadRef = useRef(true);

    const isFirstLoading = isLoading && firstLoadRef.current;

    useEffect(() => {
        if (membresia) {
            firstLoadRef.current = false;
        }
    }, [membresia]);

    const getDurationText = (days: number) => {
        if (days === 1) return '1 día';
        if (days < 30) return `${days} días`;
        if (days === 30) return '1 mes';
        if (days === 90) return '3 meses';
        if (days === 180) return '6 meses';
        if (days === 365) return '1 año';
        const months = Math.round(days / 30);
        return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    };

    const getPrecioPorMes = (precio: number, dias: number) => {
        return formatearPrecio(precio / (dias / 30));
    };

    const getPrecioPorDia = (precio: number, dias: number) => {
        return formatearPrecio(precio / dias);
    };

    if (isFirstLoading) {
        return (
            <Loader
                delay={0}
                message="Cargando los detalles de la membresía..."
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

    if (!membresia) {
        return null;
    }

    return (
        <>
            <PageHeader
                title={"Detalles de la membresía"}
                description="Información detallada sobre la membresía"
                action={
                    <NormalButton
                        type="button"
                        onClick={() => navigate(-1)}
                        tooltip='Regresar a la pág anterior'
                    >
                        <FaArrowLeft />
                        Volver
                    </NormalButton>
                }
            />

            <PageContent>
                {/* Tarjeta principal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    {/* Header con información principal */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Icono de membresía */}
                            <div className="relative">
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl border-4 border-white shadow-md">
                                    <FaIdCard className="text-xl" />
                                </div>
                                <div className="absolute -bottom-2 -right-2">
                                    <Chip
                                        value={membresia.activa}
                                        color={membresia.activa === "ACTIVA" ? "green" : "red"}
                                        className="capitalize font-medium text-xs px-3 py-1 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Info básica */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{membresia.nombre}</h1>
                                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <FaMoneyBillWave className="text-gray-400" />
                                        {formatearPrecio(membresia.precio)}
                                    </div>
                                    <span className="w-px h-4 bg-gray-300"></span>
                                    <div className="flex items-center gap-1.5">
                                        <FaCalendarAlt className="text-gray-400" />
                                        {getDurationText(membresia.duracionDias)}
                                    </div>
                                    <span className="w-px h-4 bg-gray-300"></span>
                                    <div className="flex items-center gap-1.5">
                                        <FaDoorOpen className="text-gray-400" />
                                        {membresia.visitasIncluidas === 0 ? 'Visitas ilimitadas' : `${membresia.visitasIncluidas} visitas`}
                                    </div>
                                </div>
                                {membresia.descripcion && (
                                    <p className="text-gray-600 text-sm max-w-2xl">
                                        {membresia.descripcion}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="bg-gray-50 min-h-screen pt-3">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Columna izquierda - Información básica */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Tarjeta de precio y duración */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaMoneyBillWave className="text-blue-500" /> Información de Precio
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Precio total</span>
                                            <span className="font-bold text-blue-600 text-lg">{formatearPrecio(membresia.precio)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Duración</span>
                                            <span className="font-medium text-gray-900">{getDurationText(membresia.duracionDias)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Precio por mes</span>
                                            <span className="font-medium text-green-600">{getPrecioPorMes(membresia.precio, membresia.duracionDias)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Precio por día</span>
                                            <span className="font-medium text-green-600">{getPrecioPorDia(membresia.precio, membresia.duracionDias)}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Tarjeta de características */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaDumbbell className="text-green-500" /> Características
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Visitas incluidas</span>
                                            <Badge variant={membresia.visitasIncluidas === 0 ? "success" : "primary"}>
                                                {membresia.visitasIncluidas === 0 ? 'Ilimitadas' : membresia.visitasIncluidas}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Clases incluidas</span>
                                            <Badge variant={membresia.clasesIncluidas === 0 ? "success" : "primary"}>
                                                {membresia.clasesIncluidas === 0 ? 'Ilimitadas' : membresia.clasesIncluidas}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Acceso a todas las clases</span>
                                            {membresia.accesoTodasClases ? (
                                                <FaCheck className="text-green-500" />
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Acceso a todos los gimnasios</span>
                                            {membresia.accesoTodosGimnasios ? (
                                                <FaCheck className="text-green-500" />
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Columna derecha - Información detallada */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Tipos de clase permitidos */}
                                {membresia.tiposClasePermitidas && membresia.tiposClasePermitidas.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaDumbbell className="text-purple-500" /> Tipos de Clase Permitidos
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {membresia.tiposClasePermitidas.map((tipoClase) => (
                                                <div key={tipoClase.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="p-2 bg-purple-100 rounded-full">
                                                            <FaDumbbell className="text-purple-500" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">{tipoClase.nombre}</p>
                                                            <Badge
                                                                variant={tipoClase.activa === "ACTIVA" ? "success" : "danger"}
                                                                className="text-xs mt-1"
                                                            >
                                                                {tipoClase.activa}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {tipoClase.descripcion && (
                                                        <p className="text-sm text-gray-600 mt-2">{tipoClase.descripcion}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Gimnasios Permitidos */}
                                {membresia.gimnasiosPermitidos && membresia.gimnasiosPermitidos.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaBuilding className="text-orange-500" /> Gimnasios Permitidos
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {membresia.gimnasiosPermitidos.map((gimnasio) => (
                                                <div key={gimnasio.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {gimnasio.logoUrl ? (
                                                            <img src={gimnasio.logoUrl} alt={gimnasio.nombre} className="w-12 h-12 rounded-lg object-cover border" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                                <FaBuilding className="text-white text-lg" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">{gimnasio.nombre}</p>
                                                            <Badge
                                                                variant={gimnasio.activo === "ACTIVO" ? "success" : "danger"}
                                                                className="text-xs mt-1"
                                                            >
                                                                {gimnasio.activo}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <p className="text-gray-600 flex items-center gap-2">
                                                            <FaMapMarkerAlt className="text-gray-400" />
                                                            <span>{gimnasio.direccion}</span>
                                                        </p>
                                                        {gimnasio.telefono && (
                                                            <p className="text-gray-600 flex items-center gap-2">
                                                                <FaPhone className="text-gray-400" />
                                                                <span>{gimnasio.telefono}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Información adicional */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaIdCard className="text-blue-500" /> Información Adicional
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-blue-800 font-medium">ID de Membresía</p>
                                            <p className="text-gray-900 font-mono">#{membresia.id}</p>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <p className="text-green-800 font-medium">Estado</p>
                                            <Badge variant={membresia.activa === "ACTIVA" ? "success" : "danger"}>
                                                {membresia.activa}
                                            </Badge>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </PageContent>
        </>
    )
}

export default MembresiaDetallePage;