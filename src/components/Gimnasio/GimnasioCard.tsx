import { FiEdit, FiMapPin, FiPhone } from 'react-icons/fi';
import type { GimnasioItem } from '../../interfaces/Gimnasio/Gimnasio';
import Badge from '../Generales/Badge';
import Tippy from '../Utiles/Providers/TippyProvider';
import { motion } from 'framer-motion';
import { IconButton } from '@material-tailwind/react';
import { MdDomainDisabled, MdRestartAlt } from 'react-icons/md';
import { NormalButton } from '../Utiles/Buttons/NormalButton';
import { IoMdSettings } from 'react-icons/io';
import { FaEdit, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface GimnasioCardProps {
    gimnasio: GimnasioItem
    onUpdate: (id: number) => void;
    onDelete: (gimnasio: GimnasioItem) => void;
    onReactivate: (gimnasio: GimnasioItem) => void
}

const GimnasioCard: React.FC<GimnasioCardProps> = ({
    gimnasio,
    onUpdate,
    onDelete,
    onReactivate,
}) => {
    const navigate = useNavigate();

    return (
        <Tippy
            content={gimnasio.nombre}
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
                {/* Header con imagen y gradiente */}
                <div className="relative h-52 overflow-hidden shadow-lg">
                    <img
                        src={gimnasio.logoUrl || '/images/gym-default.jpg'}
                        alt={gimnasio.nombre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                    />

                    {/* Badge de estado */}
                    <div className="absolute top-3 left-3 z-20">
                        <Badge
                            variant={gimnasio.activo ? 'success' : 'danger'}
                            className={`backdrop-blur-sm rounded-lg ${gimnasio.activo == 'ACTIVO' ? 'bg-green-600/80' : "bg-red-600/80"} shadow-md`}
                        >
                            {gimnasio.activo == 'ACTIVO' ?
                                <span className="text-green-50 font-medium">Activo</span> :
                                <span className="text-red-50 font-medium">Inactivo</span>}
                        </Badge>
                    </div>

                    {/* Acciones flotantes */}
                    <div className="absolute top-3 right-3 z-20 flex space-x-2">
                        {gimnasio.activo == 'ACTIVO' ? (
                            <>
                                <Tippy content="Editar Gimnasio" placement="top" animation="scale">
                                    <IconButton
                                        variant="gradient"
                                        color="blue"
                                        size="md"
                                        className="rounded-full hover:shadow-md transition-all duration-300"
                                        onClick={() => onUpdate(gimnasio.id)}
                                        placeholder={undefined}
                                        onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                    >
                                        <FaEdit className="text-base" />
                                    </IconButton>
                                </Tippy>
                                <Tippy content="Desactivar Gimnasio" placement="top" animation="scale">
                                    <IconButton
                                        variant="gradient"
                                        color="red"
                                        size="md"
                                        onClick={() => onDelete(gimnasio)}
                                        className="rounded-full hover:shadow-md transition-all duration-300"
                                        placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                    >
                                        <MdDomainDisabled className="text-base" />
                                    </IconButton>
                                </Tippy>
                            </>
                        ) : (
                            <Tippy content="Reactivar Gimnasio" placement="top" animation="scale">
                                <IconButton
                                    variant="gradient"
                                    color="green"
                                    size="md"
                                    onClick={() => onReactivate(gimnasio)}
                                    className="rounded-full hover:shadow-md transition-all duration-300"
                                    placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                >
                                    <MdRestartAlt className="text-base" />
                                </IconButton>
                            </Tippy>
                        )}
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                            {gimnasio.nombre}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="p-2 mr-3 bg-gray-200 rounded-lg">
                                <FiMapPin className="text-[var(--color-primary)] w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dirección</h4>
                                <p className="text-gray-700 line-clamp-2">
                                    {gimnasio.direccion}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="p-2 mr-3 bg-gray-200 rounded-lg">
                                <FiPhone className="text-[var(--color-primary)] w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</h4>
                                <p className="text-gray-700">
                                    {gimnasio.telefono}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer fijo */}
                <div className={`px-5 py-3 bg-gray-50 border-t border-gray-100 flex ${gimnasio.activo === "ACTIVO" ? "justify-between" : "justify-end"} items-center`}>
                    {gimnasio.activo == 'ACTIVO' && (
                        <NormalButton
                            onClick={() => onUpdate(gimnasio.id)}
                            tooltip='Gestionar Gimnasio'
                        >
                            <IoMdSettings />
                            Gestionar
                        </NormalButton>
                    )}

                    <NormalButton
                        onClick={() => navigate(`/gimnasios/${gimnasio.id}`)}
                        tooltip='Ver Más'
                    >
                        <FaEye />
                        Ver Más
                    </NormalButton>
                </div>
            </motion.div>
        </Tippy>
    )
}

export default GimnasioCard