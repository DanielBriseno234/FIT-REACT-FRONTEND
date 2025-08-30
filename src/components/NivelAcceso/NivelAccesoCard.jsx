import { FiUsers } from 'react-icons/fi';
import Tippy from "../Utiles/Providers/TippyProvider";
import { motion } from 'framer-motion';
import { IconButton } from '@material-tailwind/react';
import Badge from '../Generales/Badge';
import NormalButton from '../Utiles/Botones/NormalButton';
import { IoMdSettings } from 'react-icons/io';
import { FaEye } from 'react-icons/fa';
import { MdDomainDisabled } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const NivelAccesoCard = ({ onEdit, onDelete, onReactivate, nivelAcceso }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/admin/niveles-acceso/${nivelAcceso.id}`);
    };

    return (
        <Tippy
            content={nivelAcceso.nombre}
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
                    hover: {
                        duration: 0.1
                    }
                }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 flex flex-col h-full"
            >
                {/* Header con color de fondo y acciones principales */}
                <div className="relative h-30 bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] p-5 flex flex-col justify-between">
                    {/* Estado y acciones rápidas */}
                    <div className="flex justify-between items-start">
                        <Badge
                            variant={nivelAcceso.activo ? 'success' : 'danger'}
                            className={`backdrop-blur-sm rounded-lg ${nivelAcceso.activo == 'ACTIVO' ? 'bg-green-600/80' : "bg-red-600/80"} shadow-md`}
                        >
                            {nivelAcceso.activo}
                        </Badge>

                        <div className="flex space-x-1">
                            {nivelAcceso.activo == "ACTIVO" ? (
                                nivelAcceso.id > 4 && (
                                    <Tippy content="Desactivar Gimnasio" placement="top" animation="scale">
                                        <IconButton
                                            ripple={true}
                                            onClick={() => onDelete(nivelAcceso)}
                                            className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
                                        >
                                            <MdDomainDisabled className="text-white w-4 h-4" />
                                        </IconButton>
                                    </Tippy>
                                )
                            ) : (
                                <Tippy content="Reactivar Gimnasio" placement="top" animation="scale">
                                    <IconButton
                                        ripple={true}
                                        onClick={() => onReactivate(nivelAcceso)}
                                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
                                    >
                                        <MdRestartAlt className="text-white w-4 h-4" />
                                    </IconButton>
                                </Tippy>
                            )}

                        </div>
                    </div>

                    {/* Nombre del nivel */}
                    <div className="mt-4">
                        <h3 className="text-xl font-bold text-white line-clamp-2">
                            {nivelAcceso.nombre}
                        </h3>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-5 flex-grow flex flex-col">
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">ROL ASOCIADO</h4>
                        <p className="text-gray-800 font-medium">{nivelAcceso.rol?.nombre || 'Sin rol'}</p>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPCIÓN DEL ROL</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">
                            {nivelAcceso.rol?.descripcion || 'No hay descripción disponible'}
                        </p>
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-center text-gray-500">
                            <FiUsers className="mr-2" />
                            <span className="text-sm">
                                {nivelAcceso.usuariosConNivel || 0} usuario{nivelAcceso.usuariosConNivel !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer con acciones secundarias */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <NormalButton
                        text='Gestionar'
                        icon={<IoMdSettings />}
                        onClick={onEdit}
                        tooltip='Gestionar Nivel'
                    />

                    <NormalButton
                        text='Ver Más'
                        icon={<FaEye />}
                        onClick={handleViewDetails}
                        tooltip='Ver Más'
                    />
                </div>
            </motion.div>
        </Tippy>
    );
};

export default NivelAccesoCard;