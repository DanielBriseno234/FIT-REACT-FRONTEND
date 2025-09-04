import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaSync, FaMoneyBillWave, FaCalendarAlt, FaIdCard, FaEye } from 'react-icons/fa';
import { Card, CardBody, Chip, IconButton, Tooltip } from '@material-tailwind/react';
import Tippy from '../Utiles/Providers/TippyProvider';
import Badge from '../Generales/Badge';
import type { MembresiaItem } from "../../interfaces/membresia/Membresia";
import { formatearFecha, formatearPrecio } from '../../helpers/formatHelpers';
import { useNavigate } from 'react-router-dom';

interface MembresiaCardProps {
    membresia: MembresiaItem
    onUpdate: (id: number) => void;
    onInactivate: (membresia: MembresiaItem) => void;
    onReactivate: (membresia: MembresiaItem) => void;
}

const MembresiaCard: React.FC<MembresiaCardProps> = ({
    membresia,
    onUpdate,
    onInactivate,
    onReactivate
}) => {
    const navigate = useNavigate();

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

    return (
        <Tippy
            content={membresia.nombre}
            placement="top"
            animation="perspective"
            theme="light-border"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                    y: -5,
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
                }}
                transition={{
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.3,
                }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 flex flex-col h-full"
            >
                <Card className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full transition-all duration-300 hover:shadow-lg" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {/* Header con gradiente */}
                    <div className="relative px-4 pt-2 pb-2 flex justify-between items-center bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]">
                        <Chip
                            value={membresia.activa ? "ACTIVA" : "INACTIVA"}
                            color={membresia.activa ? "green" : "red"}
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
                                    onClick={() => navigate(`/membresia/${membresia.id}`)}
                                    placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    <FaEye className="text-sm" />
                                </IconButton>
                            </Tooltip>
                            {membresia.activa === "ACTIVA" ? (
                                <>
                                    <Tooltip content="Editar membresía" placement="top">
                                        <IconButton
                                            variant="text"
                                            color="blue"
                                            size="sm"
                                            className="rounded-full hover:bg-blue-100/80 bg-white/80 shadow-sm"
                                            onClick={() => onUpdate(membresia.id)}
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <FaEdit className="text-sm" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Desactivar membresía" placement="top">
                                        <IconButton
                                            variant="text"
                                            color="red"
                                            size="sm"
                                            className="rounded-full hover:bg-red-100/80 bg-white/80 shadow-sm"
                                            onClick={() => onInactivate(membresia)}
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <FaTrash className="text-sm" />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            ) : (
                                <Tooltip content="Reactivar membresía" placement="top">
                                    <IconButton
                                        variant="text"
                                        color="green"
                                        size="sm"
                                        className="rounded-full hover:bg-green-100/80 bg-white/80 shadow-sm"
                                        onClick={() => onReactivate(membresia)}
                                        placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        <FaSync className="text-sm" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <CardBody className="px-4 py-3 flex-grow" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {/* Nombre e ID */}

                        <h3 className="font-bold text-gray-900 text-lg">
                            {membresia.nombre}
                        </h3>

                        {/* Descripción */}
                        {membresia.descripcion && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {membresia.descripcion}
                                </p>
                            </div>
                        )}

                        {/* Información de precio y duración - DISEÑO MODERNIZADO */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {/* Precio - Nuevo diseño */}
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white shadow-md">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                                        <FaMoneyBillWave className="text-white text-xs" />
                                    </div>
                                    <span className="text-xs font-medium text-white/90">PRECIO</span>
                                </div>
                                <p className="text-xl font-bold text-white">
                                    {formatearPrecio(membresia.precio)}
                                </p>
                                <div className="mt-2 h-px bg-white/30"></div>
                                <p className="text-[10px] text-white/70 mt-1 uppercase tracking-wide">Inversión total</p>
                            </div>

                            {/* Duración - Nuevo diseño */}
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white shadow-md">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                                        <FaCalendarAlt className="text-white text-xs" />
                                    </div>
                                    <span className="text-xs font-medium text-white/90">DURACIÓN</span>
                                </div>
                                <p className="text-xl font-bold text-white">
                                    {getDurationText(membresia.duracionDias)}
                                </p>
                                <div className="mt-2 h-px bg-white/30"></div>
                                <p className="text-[10px] text-white/70 mt-1">
                                    {membresia.duracionDias} días
                                </p>
                            </div>
                        </div>

                        {/* Indicador de valor - Reemplaza el badge */}
                        <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-full px-4 py-2 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <FaIdCard className="text-blue-500 text-sm" />
                                    <span className="text-xs font-medium text-gray-700">
                                        {membresia.duracionDias >= 30 ?
                                            `${formatearPrecio(membresia.precio / (membresia.duracionDias / 30))}/mes` :
                                            `${formatearPrecio(membresia.precio / membresia.duracionDias)}/día`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardBody>

                    {/* Footer */}
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                            Actualizado {formatearFecha(membresia.fechaModificacion)}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                </Card>
            </motion.div>
        </Tippy>
    );
}

export default MembresiaCard;