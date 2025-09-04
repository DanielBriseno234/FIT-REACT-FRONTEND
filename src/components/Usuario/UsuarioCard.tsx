import React from 'react'
import { Card, CardBody, Avatar, Typography, Chip, IconButton, Tooltip } from '@material-tailwind/react';
import {
    FaPhone,
    FaUser,
    FaExclamationTriangle,
    FaEdit,
    FaTrash,
    FaLock,
    FaSync,
    FaVenus,
    FaMars,
    FaGenderless,
    FaCrown,
    FaShieldAlt,
    FaUserTie,
    FaEye,
    FaEnvelope
} from 'react-icons/fa';
import { TbPassword } from "react-icons/tb";
import type { UsuarioItem } from '../../interfaces/Usuario/Usuario';
import Tippy from '../Utiles/Providers/TippyProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatearFecha } from '../../helpers/formatHelpers';

interface UsuarioCardProps {
    usuario: UsuarioItem
    onUpdate: (id: number) => void;
    onDelete: (usuario: UsuarioItem) => void;
    onReactivate: (usuario: UsuarioItem) => void;
    onBlock: (usuario: UsuarioItem) => void;
    onChangePass: (usuario: UsuarioItem) => void
}

const UsuarioCard: React.FC<UsuarioCardProps> = ({
    usuario,
    onUpdate,
    onDelete,
    onReactivate,
    onBlock,
    onChangePass
}) => {
    const navigate = useNavigate();

    const nombreCompleto = `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;
    const iniciales = usuario.nombres
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    // Función para verificar si la URL es base64
    const isBase64 = (str: string) => {
        if (!str) return false;
        return str.startsWith('data:image/');
    };

    // Función para obtener la URL de la imagen (base64 o URL normal)
    const getImageUrl = () => {
        if (!usuario.urlFotoPerfil) return null;
        if (isBase64(usuario.urlFotoPerfil)) {
            return usuario.urlFotoPerfil;
        }
        return usuario.urlFotoPerfil;
    };

    const getRolIcon = (rolNombre: string) => {
        if (rolNombre.toLowerCase().includes('admin')) return <FaCrown className="text-yellow-500" />;
        if (rolNombre.toLowerCase().includes('recepcionista')) return <FaUserTie className="text-blue-500" />;
        if (rolNombre.toLowerCase().includes('entrenador')) return <FaShieldAlt className="text-green-500" />;
        return <FaUser className="text-gray-500" />;
    };

    const getRolColor = (rolNombre: string) => {
        if (rolNombre.toLowerCase().includes('admin')) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (rolNombre.toLowerCase().includes('recepcionista')) return "bg-blue-100 text-blue-800 border-blue-200";
        if (rolNombre.toLowerCase().includes('entrenador')) return "bg-green-100 text-green-800 border-green-200";
        return "bg-gray-100 text-gray-800 border-gray-200";
    };

    const imageUrl = getImageUrl();

    return (
        <Tippy
            content={usuario.nombres}
            placement="top"
            animation="perspective"
            theme="light-border"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                    y: -10,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
                }}
                transition={{
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.3,
                }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 flex flex-col h-full"
            >
                <Card className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full transition-all duration-300 hover:shadow-lg" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {/* Header con información de estado */}
                    <div className="relative px-4 pt-3 pb-3 flex justify-between items-center bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]">
                        <Chip
                            value={usuario.estatus}
                            color={usuario.estatus === "ACTIVO" ? "green" : "red"}
                            size="sm"
                            variant="filled"
                            className="rounded-full capitalize font-semibold text-xs px-3 py-1 shadow-sm"
                        />

                        <div className="flex gap-1">
                            <Tooltip content="Ver usuario" placement="top">
                                <IconButton
                                    variant="text"
                                    color="blue"
                                    size="sm"
                                    className="rounded-full hover:bg-blue-100/80 bg-white/80 shadow-sm"
                                    onClick={() => navigate(`/admin/usuarios/${usuario.id}`)}
                                    placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    <FaEye className="text-sm" />
                                </IconButton>
                            </Tooltip>

                            {usuario.estatus === "ACTIVO" ? (
                                <>
                                    <Tooltip content="Cambiar Contraseña" placement="top">
                                        <IconButton
                                            variant="text"
                                            color="purple"
                                            size="sm"
                                            className="rounded-full hover:bg-blue-100/80 bg-white/80 shadow-sm"
                                            onClick={() => onChangePass(usuario)}
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <TbPassword className="text-sm" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Editar usuario" placement="top">
                                        <IconButton
                                            variant="text"
                                            color="blue"
                                            size="sm"
                                            className="rounded-full hover:bg-blue-100/80 bg-white/80 shadow-sm"
                                            onClick={() => onUpdate(usuario.id)}
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <FaEdit className="text-sm" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Bloquear usuario" placement="top">
                                        <IconButton
                                            variant="text"
                                            color="orange"
                                            size="sm"
                                            className="rounded-full hover:bg-orange-100/80 bg-white/80 shadow-sm"
                                            onClick={() => onBlock(usuario)}
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <FaLock className="text-sm" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Eliminar usuario" placement="top">
                                        <IconButton
                                            variant="text"
                                            color="red"
                                            size="sm"
                                            className="rounded-full hover:bg-red-100/80 bg-white/80 shadow-sm"
                                            onClick={() => onDelete(usuario)}
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <FaTrash className="text-sm" />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            ) : (
                                <Tooltip content="Reactivar usuario" placement="top">
                                    <IconButton
                                        variant="text"
                                        color="green"
                                        size="sm"
                                        className="rounded-full hover:bg-green-100/80 bg-white/80 shadow-sm"
                                        onClick={() => onReactivate(usuario)}
                                        placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        <FaSync className="text-sm" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <CardBody className="p-4 pt-2 flex-grow" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {/* Avatar e información básica */}
                        <div className="flex flex-col items-center mb-4">
                            <div className="mb-3 relative">
                                {imageUrl ? (
                                    <Avatar
                                        size="lg"
                                        alt={usuario.nombres}
                                        withBorder={true}
                                        color="blue"
                                        className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                                        src={usuario.urlFotoPerfil}
                                        placeholder={undefined}
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
                                ) : (
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-white font-bold text-lg shadow-md">
                                        {iniciales}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                    {usuario.genero === "MUJER" ? (
                                        <div className="p-1 bg-pink-100 rounded-full">
                                            <FaVenus className="text-pink-500 text-xs" />
                                        </div>
                                    ) : usuario.genero === "HOMBRE" ? (
                                        <div className="p-1 bg-blue-100 rounded-full">
                                            <FaMars className="text-blue-500 text-xs" />
                                        </div>
                                    ) : (
                                        <div className="p-1 bg-purple-100 rounded-full">
                                            <FaGenderless className="text-purple-500 text-xs" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Typography
                                variant="h5"
                                className="font-bold text-gray-900 mb-1 text-center text-lg"
                                placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                {usuario.nombres} {usuario.apellidoPaterno}
                            </Typography>

                            {usuario.apellidoMaterno && (
                                <Typography
                                    className="text-sm text-gray-600 text-center mb-2"
                                    placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    {usuario.apellidoMaterno}
                                </Typography>
                            )}
                        </div>

                        {/* Información de contacto - Tarjeta estilizada */}
                        <div className="mb-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-300"></div>
                                <Typography
                                    variant="h6"
                                    className="text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Información de Contacto
                                </Typography>
                                <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-transparent"></div>
                            </div>

                            <div className="space-y-2">
                                {usuario.correoElectronico && (
                                    <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-blue-100/50">
                                        <div className="p-1.5 bg-blue-100 rounded-full">
                                            <FaEnvelope className="text-blue-500 text-xs" />
                                        </div>
                                        <Typography
                                            className="text-xs text-gray-700 truncate"
                                            placeholder={undefined}
                                            title={usuario.correoElectronico} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {usuario.correoElectronico}
                                        </Typography>
                                    </div>
                                )}

                                {usuario.telefono && (
                                    <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-blue-100/50">
                                        <div className="p-1.5 bg-green-100 rounded-full">
                                            <FaPhone className="text-green-500 text-xs" />
                                        </div>
                                        <div>
                                            <Typography
                                                className="text-xs font-medium text-gray-700"
                                                placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {usuario.telefono}
                                            </Typography>
                                            <Typography
                                                className="text-[10px] text-gray-500"
                                                placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                Teléfono
                                            </Typography>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Roles y Niveles de Acceso */}
                        <div className="mb-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-300"></div>
                                <Typography
                                    variant="h6"
                                    className="text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Roles Asignados
                                </Typography>
                                <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-transparent"></div>
                            </div>

                            <div className="space-y-2">
                                {usuario.roles.length > 0 ? (
                                    usuario.roles.map((rol) => (
                                        <div
                                            key={rol.idRol}
                                            className={`rounded-lg p-2 border ${getRolColor(rol.nombreRol)} transition-colors duration-200 hover:shadow-sm`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs">
                                                    {getRolIcon(rol.nombreRol)}
                                                </div>
                                                <div className="flex-1">
                                                    <Typography
                                                        className="font-medium text-xs"
                                                        placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {rol.nombreRol}
                                                    </Typography>
                                                    <Typography
                                                        className="text-xs opacity-70"
                                                        placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        Nivel: {rol.nombreNivelAcceso}
                                                    </Typography>
                                                </div>
                                                <span className="text-xs bg-white/50 text-gray-700 px-1.5 py-0.5 rounded-full font-mono border">
                                                    #{rol.idRol}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 rounded-lg p-2 border border-amber-200">
                                        <FaExclamationTriangle className="text-xs" />
                                        <Typography
                                            className="text-xs font-medium text-center"
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            Sin roles asignados
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardBody>

                    {/* Footer */}
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                            Actualizado {formatearFecha(usuario.fechaModificacion)}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                </Card>
            </motion.div>
        </Tippy>
    );
}

export default UsuarioCard;