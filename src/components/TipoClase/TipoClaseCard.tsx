import Tippy from '../Utiles/Providers/TippyProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { TipoClaseItem } from "../../interfaces/TipoClase/TipoClase";
import { FaEdit, FaTrash, FaSync, FaDumbbell, FaInfoCircle } from 'react-icons/fa';
import { Card, CardBody, Chip, IconButton, Tooltip } from '@material-tailwind/react';
import Badge from '../Generales/Badge';

interface TipoClaseCardProps {
    tipoClase: TipoClaseItem
    onUpdate: (id: number) => void;
    onDelete: (tipoClase: TipoClaseItem) => void;
    onReactivate: (tipoClase: TipoClaseItem) => void;
}

const TipoClaseCard: React.FC<TipoClaseCardProps> = ({
    tipoClase,
    onUpdate,
    onDelete,
    onReactivate
}) => {
    const navigate = useNavigate();

    return (
        <Tippy
            content={tipoClase.nombre}
            placement="top"
            animation="perspective"
            theme="light-border"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                    y: -3,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                }}
                transition={{
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.2,
                }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 flex flex-col h-full"
            >
                <Card className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full transition-all duration-300 hover:shadow-lg" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {/* Header minimalista */}
                    <div className="relative px-4 pt-3 pb-3 flex justify-between items-center bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]">
                        <Chip
                            value={tipoClase.activa}
                            color={tipoClase.activa === "ACTIVA" ? "green" : "red"}
                            size="sm"
                            variant="filled"
                            className="rounded-full capitalize font-medium text-xs px-2 py-1"
                        />

                        <div className="flex gap-1">
                            {tipoClase.activa === "ACTIVA" ? (
                                <>
                                    <Tooltip content="Editar tipo de clase" placement="top">
                                        <IconButton
                                            variant="text"
                                            color="blue"
                                            size="sm"
                                            className="rounded-full hover:bg-blue-100/80 bg-white/80 shadow-sm"
                                            onClick={() => onUpdate(tipoClase.id)}
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <FaEdit className="text-sm" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Desactivar tipo de clase" placement="top">
                                        <IconButton
                                            variant="text"
                                            color="red"
                                            size="sm"
                                            className="rounded-full hover:bg-red-100/80 bg-white/80 shadow-sm"
                                            onClick={() => onDelete(tipoClase)}
                                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <FaTrash className="text-sm" />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            ) : (
                                <Tooltip content="Reactivar tipo de clase" placement="top">
                                    <IconButton
                                        variant="text"
                                        color="green"
                                        size="sm"
                                        className="rounded-full hover:bg-red-100/80 bg-white/80 shadow-sm"
                                        onClick={() => onReactivate(tipoClase)}
                                        placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        <FaSync className="text-sm" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* Contenido principal - Simplificado */}
                    <CardBody className="px-4 py-3 flex-grow" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {/* Nombre del tipo de clase */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaDumbbell className="text-blue-600 text-sm" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-base">
                                {tipoClase.nombre}
                            </h3>
                        </div>

                        {/* Descripción (si existe) */}
                        {tipoClase.descripcion && (
                            <div className="mb-1">
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {tipoClase.descripcion}
                                </p>
                            </div>
                        )}

                    </CardBody>

                    {/* Footer mínimo */}
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                            Tipo de clase
                        </span>
                        <div className={`w-2 h-2 rounded-full ${tipoClase.activa === "ACTIVA" ? "bg-green-400" : "bg-red-400"}`}></div>
                    </div>
                </Card>
            </motion.div>
        </Tippy >
    )
}

export default TipoClaseCard;