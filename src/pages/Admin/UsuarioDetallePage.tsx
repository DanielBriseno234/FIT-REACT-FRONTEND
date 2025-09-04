import { useEffect, useRef } from 'react'
import PageHeader from '../../components/Utiles/Page/PageHeader'
import { NormalButton } from '../../components/Utiles/Buttons/NormalButton'
import { FaArrowLeft, FaEnvelope, FaPhone, FaVenus, FaMars, FaGenderless, FaDumbbell, FaIdCard, FaCalendarAlt, FaInfoCircle, FaCrown, FaShieldAlt, FaUserTie, FaBuilding, FaUser, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useUsuario } from '../../hooks/Usuario/useUsuario'
import Loader from '../../components/Utiles/Loader/Loader'
import LoadError from '../../components/Generales/LoadError'
import { getErrorMessage } from '../../helpers/errorHelper'
import EmptyState from '../../components/Utiles/Page/EmptyState'
import PageContent from '../../components/Utiles/Page/PageContent'
import { motion } from 'framer-motion'
import { Chip } from '@material-tailwind/react'
import Badge from '../../components/Generales/Badge'
import { formatearFecha } from '../../helpers/formatHelpers'

const UsuarioDetallePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data: usuario, error, isLoading, refetch } = useUsuario(Number(id));

    const firstLoadRef = useRef(true);

    const isFirstLoading = isLoading && firstLoadRef.current;

    useEffect(() => {
        if (usuario) {
            firstLoadRef.current = false;
        }
    }, [usuario]);

    const getRolIcon = (rolNombre: string) => {
        if (rolNombre.toLowerCase().includes('admin')) return <FaCrown className="text-yellow-500" />;
        if (rolNombre.toLowerCase().includes('gerente')) return <FaUserTie className="text-blue-500" />;
        if (rolNombre.toLowerCase().includes('seguridad')) return <FaShieldAlt className="text-green-500" />;
        return <FaIdCard className="text-purple-500" />;
    };

    const getRolColor = (rolNombre: string) => {
        if (rolNombre.toLowerCase().includes('admin')) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (rolNombre.toLowerCase().includes('gerente')) return "bg-blue-100 text-blue-800 border-blue-200";
        if (rolNombre.toLowerCase().includes('seguridad')) return "bg-green-100 text-green-800 border-green-200";
        return "bg-purple-100 text-purple-800 border-purple-200";
    };

    if (isFirstLoading) {
        return (
            <Loader
                delay={0}
                message="Cargando los detalles del usuario..."
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

    if (!usuario) {
        return (
            <EmptyState
                type={'empty'}
                title={'No se encontró el usuario'}
                description={'Al parecer no encontramos el usuario que estabas buscando'}
            />
        );
    }

    const nombreCompleto = `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;
    const iniciales = usuario.nombres
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    const generoIcon = usuario.genero === "MUJER" ?
        <FaVenus className="text-pink-500" /> :
        usuario.genero === "HOMBRE" ?
            <FaMars className="text-blue-500" /> :
            <FaGenderless className="text-purple-500" />;

    return (
        <>
            <PageHeader
                title={"Detalles del Usuario"}
                description="Información detallada sobre el usuario"
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
                    {/* Header con avatar */}
                    <div className="bg-gradient-to-r from-[var(--color-primary)]/10 via-white to-[var(--color-primary)]/10 p-8 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                {usuario.urlFotoPerfil ? (
                                    <img
                                        src={usuario.urlFotoPerfil}
                                        alt={nombreCompleto}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-white font-bold text-2xl border-4 border-white shadow-md">
                                        {iniciales}
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2">
                                    <Chip
                                        value={usuario.estatus}
                                        color={usuario.estatus === "ACTIVO" ? "green" : "red"}
                                        className="capitalize font-medium text-xs px-3 py-1 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Info básica */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center md:text-left">{nombreCompleto}</h1>
                                <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-center gap-4 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">{generoIcon} {usuario.genero.toLowerCase()}</div>
                                    <span className="w-px h-4 bg-gray-300"></span>
                                    <div className="flex items-center gap-1.5"><FaEnvelope className="text-gray-400" /> {usuario.email}</div>
                                    {usuario.telefono && (
                                        <>
                                            <span className="w-px h-4 bg-gray-300"></span>
                                            <div className="flex items-center gap-1.5"><FaPhone className="text-gray-400" /> {usuario.telefono}</div>
                                        </>
                                    )}
                                </div>
                                {usuario.gimnasioRegistro && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaBuilding className="text-gray-400" />
                                        Registrado en: <span className="font-medium">{usuario.gimnasioRegistro.nombre}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal - REDISEÑADO */}
                    <div className="bg-gray-50 min-h-screen">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Columna izquierda - Información de contacto */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Tarjeta de contacto */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FaUser className="text-blue-600 text-lg" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <FaEnvelope className="text-gray-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Email</p>
                                                <p className="text-gray-900">{usuario.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <FaPhone className="text-gray-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Teléfono</p>
                                                <p className="text-gray-900">{usuario.telefono || "No especificado"}</p>
                                            </div>
                                        </div>

                                        {usuario.gimnasioRegistro && (
                                            <div className="flex items-start gap-3">
                                                <FaBuilding className="text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">Gimnasio de Registro</p>
                                                    <p className="text-gray-900 font-medium">{usuario.gimnasioRegistro.nombre}</p>
                                                    <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                                                        <FaMapMarkerAlt className="text-xs" />
                                                        {usuario.gimnasioRegistro.direccion}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Estadísticas o información adicional */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                                >
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FaClock className="text-purple-600 text-lg" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Información de Registro</h3>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Estado</span>
                                            <Badge variant={usuario.estatus === "ACTIVO" ? "success" : "danger"}>
                                                {usuario.estatus}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Género</span>
                                            <span className="font-medium capitalize">{usuario.genero.toLowerCase()}</span>
                                        </div>
                                        {usuario.fechaRegistro && (
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-gray-500">Fecha Registro</span>
                                                <span className="font-medium">{formatearFecha(String(usuario.fechaRegistro))}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Columna derecha - Roles y permisos */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Roles y permisos */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <FaIdCard className="text-indigo-600 text-lg" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Roles y Permisos</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {usuario.roles.map((rol) => (
                                            <div key={rol.idRol} className={`p-4 rounded-lg border ${getRolColor(rol.nombreRol)} transition-transform hover:scale-[1.02]`}>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="text-lg">{getRolIcon(rol.nombreRol)}</div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900">{rol.nombreRol}</p>
                                                        <p className="text-xs text-gray-500">Nivel: {rol.nombreNivelAcceso}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-gray-200/50">
                                                    <span className="text-xs bg-white/50 text-gray-700 px-2 py-1 rounded-full">
                                                        ID: #{rol.idRol}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Info específica de rol */}
                                {(usuario.recepcionista || usuario.entrenador) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <FaInfoCircle className="text-green-600 text-lg" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">Información Específica de Rol</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {usuario.recepcionista && (
                                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-green-200 rounded-full">
                                                            <FaUserTie className="text-green-700 text-lg" />
                                                        </div>
                                                        <h4 className="font-semibold text-gray-900">Recepcionista</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">{usuario.recepcionista.biografia || "Sin biografía disponible"}</p>
                                                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-100/50 px-3 py-2 rounded-lg">
                                                        <FaCalendarAlt />
                                                        <span>Contratado: {formatearFecha(String(usuario.recepcionista.fechaContratacion))}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {usuario.entrenador && (
                                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-200">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-orange-200 rounded-full">
                                                            <FaDumbbell className="text-orange-700 text-lg" />
                                                        </div>
                                                        <h4 className="font-semibold text-gray-900">Entrenador</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">{usuario.entrenador.biografia || "Sin biografía disponible"}</p>
                                                    <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-100/50 px-3 py-2 rounded-lg">
                                                        <FaCalendarAlt />
                                                        <span>Contratado: {formatearFecha(String(usuario.entrenador.fechaContratacion))}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Gimnasios Permitidos */}
                                {usuario.gimnasiosPermitidos && usuario.gimnasiosPermitidos.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <FaBuilding className="text-purple-600 text-lg" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">Gimnasios Permitidos</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {usuario.gimnasiosPermitidos.map((gimnasio) => (
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
                            </div>
                        </div>
                    </div>
                </motion.div>
            </PageContent>
        </>
    );
}

export default UsuarioDetallePage;