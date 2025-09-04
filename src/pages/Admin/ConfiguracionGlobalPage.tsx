import { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useCharCounter } from '../../hooks/Generales/useCharCounter';
import { FaImage, FaQuoteLeft, FaUser, FaPen, FaSave, FaTimes, FaPalette, FaInfoCircle, FaEye } from 'react-icons/fa';
import { CancelButton } from '../../components/Utiles/Buttons/CancelButton';
import { NormalButton } from '../../components/Utiles/Buttons/NormalButton';
import Loader from '../../components/Utiles/Loader/Loader';
import PageHeader from '../../components/Utiles/Page/PageHeader';
import PageContent from '../../components/Utiles/Page/PageContent';
import LoadError from '../../components/Generales/LoadError';
import { ChromePicker, type ColorResult } from 'react-color';
import ProfessionalModal from '../../components/Utiles/Modals/Modal';
import { type ColoresType, type ConfiguracionInputType } from '../../interfaces/Configuracion/Configuracion';
import { getErrorMessage } from '../../helpers/errorHelper';
import useConfig from '../../hooks/Configuracion/useConfig';
import { useConfigMutations } from '../../hooks/Configuracion/useConfigMutations';

const ConfiguracionGlobalPage = () => {
    const { config: configuracion, isFirstLoading, error, refetch } = useConfig();
    const { updateConfig, isUpdating } = useConfigMutations();

    const defaultValues: ConfiguracionInputType = {
        nombreFranquicia: configuracion?.nombreFranquicia || '',
        mostrarFraseMotivacional: configuracion?.mostrarFraseMotivacional || false,
        fraseMotivacional: configuracion?.fraseMotivacional || '',
        autorFraseMotivacional: configuracion?.autorFraseMotivacional || '',
        colorPrimario: configuracion?.colorPrimario || '#170BF4',
        colorSecundario: configuracion?.colorSecundario || '#3127F5',
        colorExito: configuracion?.colorExito || '#02A314',
        colorError: configuracion?.colorError || '#A30702',
        colorDegradadoDe: configuracion?.colorDegradadoDe || '#170BF4',
        colorDegradadoHacia: configuracion?.colorDegradadoHacia || '#0F079C'
    }
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm<ConfiguracionInputType>(
        {
            defaultValues: defaultValues
        }
    );

    const [editMode, setEditMode] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoBase64, setLogoBase64] = useState<string | null>(null);
    const [fondoPreview, setFondoPreview] = useState<string | null>(null);
    const [fondoBase64, setFondoBase64] = useState<string | null>(null);
    const [colors, setColors] = useState<ColoresType>(
        {
            colorPrimario: configuracion?.colorPrimario || '#170BF4',
            colorSecundario: configuracion?.colorSecundario || '#3127F5',
            colorExito: configuracion?.colorExito || '#02A314',
            colorError: configuracion?.colorError || '#A30702',
            colorDegradadoDe: configuracion?.colorDegradadoDe || '#170BF4',
            colorDegradadoHacia: configuracion?.colorDegradadoHacia || '#0F079C'
        }
    );
    const [showPreview, setShowPreview] = useState(false);
    const [previewColors, setPreviewColors] = useState<ColoresType>(
        {
            colorPrimario: configuracion?.colorPrimario || '#170BF4',
            colorSecundario: configuracion?.colorSecundario || '#3127F5',
            colorExito: configuracion?.colorExito || '#02A314',
            colorError: configuracion?.colorError || '#A30702',
            colorDegradadoDe: configuracion?.colorDegradadoDe || '#170BF4',
            colorDegradadoHacia: configuracion?.colorDegradadoHacia || '#0F079C'
        }
    );

    const { handleChange: handleNombreChange, Counter: NombreCounter } = useCharCounter(25, configuracion?.nombreFranquicia);
    const { handleChange: handleFraseChange, Counter: FraseCounter } = useCharCounter(100, configuracion?.fraseMotivacional);
    const { handleChange: handleAutorChange, Counter: AutorCounter } = useCharCounter(40, configuracion?.autorFraseMotivacional);

    // // Inicializar valores del formulario
    useEffect(() => {
        if (!configuracion) return;
        reset(defaultValues);
        setColors({
            colorPrimario: configuracion.colorPrimario,
            colorSecundario: configuracion.colorSecundario,
            colorExito: configuracion.colorExito,
            colorError: configuracion.colorError,
            colorDegradadoDe: configuracion.colorDegradadoDe,
            colorDegradadoHacia: configuracion.colorDegradadoHacia,
        });

        setLogoPreview(configuracion.logoUrl ?? null);
        setFondoPreview(configuracion.fondoLoginUrl ?? null);

    }, [configuracion]);

    const handlePrevisualizarColores = () => {
        const currentValues = getValues();
        setPreviewColors(
            {
                colorPrimario: currentValues.colorPrimario || colors.colorPrimario,
                colorSecundario: currentValues.colorSecundario || colors.colorSecundario,
                colorExito: currentValues.colorExito || colors.colorExito,
                colorError: currentValues.colorError || colors.colorError,
                colorDegradadoDe: currentValues.colorDegradadoDe || colors.colorDegradadoDe,
                colorDegradadoHacia: currentValues.colorDegradadoHacia || colors.colorDegradadoHacia
            }
        );
        setShowPreview(true);
    };

    const handleClosePrevisualizarColores = () => {
        setShowPreview(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'logo' | 'fondo') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            toast.error('Solo se permiten imágenes (JPEG, PNG)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('La imagen no debe exceder 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (tipo === 'logo') {
                setLogoPreview(result);
                setLogoBase64(result);
            } else {
                setFondoPreview(result);
                setFondoBase64(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const onSubmit: SubmitHandler<ConfiguracionInputType> = async (data) => {
        const payload: ConfiguracionInputType = {
            ...data,
            logoUrl: logoBase64 || configuracion?.logoUrl || '',
            fondoLoginUrl: fondoBase64 || configuracion?.fondoLoginUrl || '',
            mostrarFraseMotivacional: Boolean(data.mostrarFraseMotivacional)
        };

        try {
            const result = await updateConfig(payload);

            toast.success(result.mensaje);
            setEditMode(false);
            setLogoBase64(null);
            setFondoBase64(null);
            document.body.classList.remove('editing');

        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const mostrarFrase = watch('mostrarFraseMotivacional', configuracion?.mostrarFraseMotivacional || false);

    if (isFirstLoading) {
        return (
            <Loader
                delay={0}
                message="Cargando la configuración..."
            />
        );
    }

    if (error) {
        return (
            <LoadError
                titulo="Error al cargar la configuración"
                mensaje={getErrorMessage(error) || "No se pudo obtener la información de tu configuracion"}
                textoBoton='Reintentar'
                onReintentar={() => { refetch() }}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Configuración Global"
                description="Personaliza la apariencia y comportamiento de tu plataforma"
                action={
                    !editMode ? (
                        <NormalButton
                            type={"button"}
                            onClick={() => {
                                setEditMode(true);
                                document.body.classList.add('editing');
                            }}
                            tooltip={'Editar Configuración'}
                        >
                            <FaPen />
                            Editar
                        </NormalButton>
                    ) : (
                        <CancelButton
                            onClick={() => {
                                setEditMode(false);
                                reset();
                                setLogoPreview(configuracion?.logoUrl || null);
                                setFondoPreview(configuracion?.fondoLoginUrl || null);
                                setLogoBase64(null);
                                setFondoBase64(null);
                                document.body.classList.remove('editing');
                            }}
                            tooltip={'Cancelar'}
                        >
                            <FaTimes />
                            Cancelar
                        </CancelButton>
                    )
                }
            />

            <PageContent contentStyles='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <div className="hidden md:block lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                        <div className="flex items-center mb-5">
                            <FaPalette className="text-[var(--color-primary)] text-xl mr-3" />
                            <h2 className="text-lg font-semibold text-gray-800">Personalización Visual</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></div>
                                Nombre De La Franquicia
                            </li>
                            <li className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></div>
                                Mensajes Motivacionales
                            </li>
                            <li className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></div>
                                Branding y Logo
                            </li>
                            <li className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></div>
                                Fondo de Login
                            </li>
                            <li className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></div>
                                Paleta de Colores
                            </li>
                        </ul>

                        <div className="mt-5 p-4 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20">
                            <div className="flex items-start">
                                <FaInfoCircle className="text-[var(--color-primary)] mt-1 mr-3 flex-shrink-0" />
                                <p className="text-sm text-[var(--color-primary)]">
                                    Los cambios se reflejarán inmediatamente en toda la plataforma después de guardar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-8">

                            {/* Sección de Información Básica */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg mr-4">
                                        <FaPen className="text-[var(--color-primary)] text-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">Información Básica</h2>
                                        <p className="text-gray-500 text-sm">Configura los detalles de tu franquicia</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre de la Franquicia
                                        </label>
                                        {editMode ? (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    maxLength={25}
                                                    {...register('nombreFranquicia', {
                                                        required: 'Este campo es obligatorio',
                                                        onChange: (e) => handleNombreChange(e)
                                                    })}
                                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${errors.nombreFranquicia ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    disabled={isUpdating}
                                                />
                                                <div className="absolute right-2 bottom-2 bg-white px-1 rounded">
                                                    <NombreCounter />
                                                </div>
                                                {errors.nombreFranquicia && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.nombreFranquicia.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                                {configuracion?.nombreFranquicia || 'No especificado'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center mb-4">
                                            <input
                                                type="checkbox"
                                                id="mostrarFrase"
                                                {...register('mostrarFraseMotivacional')}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                disabled={!editMode || isUpdating}
                                            />
                                            <label htmlFor="mostrarFrase" className="ml-3 text-sm font-medium text-gray-700">
                                                Mostrar frase motivacional en el login
                                            </label>
                                        </div>

                                        {mostrarFrase && (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Frase Motivacional
                                                    </label>
                                                    {editMode ? (
                                                        <div className="relative">
                                                            <FaQuoteLeft className="absolute left-3 top-3.5 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                maxLength={100}
                                                                {...register('fraseMotivacional', {
                                                                    onChange: (e) => handleFraseChange(e)
                                                                })}
                                                                className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                                                disabled={isUpdating}
                                                            />
                                                            <div className="absolute right-2 bottom-2 bg-white px-1 rounded">
                                                                <FraseCounter />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                                            {configuracion?.fraseMotivacional || 'No especificada'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Autor de la Frase
                                                    </label>
                                                    {editMode ? (
                                                        <div className="relative">
                                                            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                maxLength={40}
                                                                {...register('autorFraseMotivacional', {
                                                                    onChange: (e) => handleAutorChange(e)
                                                                })}
                                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                                                disabled={isUpdating}
                                                            />
                                                            <div className="absolute right-2 bottom-2 bg-white px-1 rounded">
                                                                <AutorCounter />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                                            {configuracion?.autorFraseMotivacional || 'No especificado'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Sección de Branding */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex flex-col items-center md:items-start md:flex-row mb-6">
                                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg mb-4 md:mb-0 md:mr-4">
                                        <FaImage className="text-[var(--color-primary)] text-lg" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="text-xl font-semibold text-gray-800">Branding y Logo</h2>
                                        <p className="text-gray-500 text-sm">Personaliza la identidad visual de tu plataforma</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center sm:text-left">
                                            Logo Principal
                                        </label>
                                        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
                                            {logoPreview && (
                                                <div className="flex-shrink-0 mx-auto md:mx-0">
                                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo actual"
                                                            className="w-full h-full object-contain p-2"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex-1 w-full md:w-auto">
                                                {editMode && (
                                                    <>
                                                        <label className="block mb-2 text-sm font-medium text-gray-700 text-center sm:text-left">
                                                            {logoPreview ? 'Cambiar logo' : 'Subir logo'}
                                                        </label>
                                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                                            <label className="cursor-pointer w-full sm:w-auto">
                                                                <div className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 text-center">
                                                                    Seleccionar archivo
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleFileChange(e, 'logo')}
                                                                    className="hidden"
                                                                    disabled={isUpdating}
                                                                />
                                                            </label>
                                                            <span className="text-xs text-gray-500 text-center sm:text-left">JPEG, PNG (max 2MB)</span>
                                                        </div>
                                                        <p className="mt-2 text-xs text-gray-500 text-center sm:text-left">
                                                            Recomendado: 300x300px, fondo transparente
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Sección de Fondo de Login */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex flex-col items-center md:items-start md:flex-row mb-6">
                                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg mb-4 md:mb-0 md:mr-4">
                                        <FaImage className="text-[var(--color-primary)] text-lg" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="text-xl font-semibold text-gray-800">Fondo de Login</h2>
                                        <p className="text-gray-500 text-sm">Personaliza la pantalla de inicio de sesión</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center sm:text-left">
                                            Imagen de Fondo
                                        </label>
                                        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
                                            {fondoPreview && (
                                                <div className="flex-shrink-0 mx-auto md:mx-0">
                                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={fondoPreview}
                                                            alt="Fondo actual"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex-1 w-full md:w-auto">
                                                {editMode && (
                                                    <>
                                                        <label className="block mb-2 text-sm font-medium text-gray-700 text-center sm:text-left">
                                                            {fondoPreview ? 'Cambiar fondo' : 'Subir fondo'}
                                                        </label>
                                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                                            <label className="cursor-pointer w-full sm:w-auto">
                                                                <div className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 text-center">
                                                                    Seleccionar archivo
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleFileChange(e, 'fondo')}
                                                                    className="hidden"
                                                                    disabled={isUpdating}
                                                                />
                                                            </label>
                                                            <span className="text-xs text-gray-500 text-center sm:text-left">JPEG, PNG (max 2MB)</span>
                                                        </div>
                                                        <p className="mt-2 text-xs text-gray-500 text-center sm:text-left">
                                                            Recomendado: 1920x1080px, alta calidad
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Sección de Paleta de Colores */}

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.3 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg mr-4">
                                        <FaPalette className="text-[var(--color-primary)] text-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">Paleta de Colores</h2>
                                        <p className="text-gray-500 text-sm">
                                            {editMode ? 'Personaliza los colores principales de tu plataforma' : 'Colores actuales de tu plataforma'}
                                        </p>
                                    </div>
                                </div>

                                {editMode ? (
                                    <div className='px-4'>
                                        <div className="flex flex-wrap justify-center sm:justify-between gap-4 text-center mb-4">
                                            <Controller
                                                name="colorPrimario"
                                                control={control}
                                                render={({ field }) => (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Color Primario
                                                            <span className='block text-xs text-gray-400'>
                                                                (Botones, Detalles)
                                                            </span>
                                                        </label>
                                                        <ChromePicker
                                                            disableAlpha={true}
                                                            color={field.value}
                                                            onChangeComplete={(color: ColorResult) => field.onChange(color.hex)}
                                                        />
                                                    </div>
                                                )}
                                            />

                                            <Controller
                                                name="colorSecundario"
                                                control={control}
                                                render={({ field }) => (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Color Secundario
                                                            <span className='block text-xs text-gray-400'>
                                                                (Bordes, Cursor Encima)
                                                            </span>
                                                        </label>
                                                        <ChromePicker
                                                            disableAlpha={true}
                                                            color={field.value}
                                                            onChangeComplete={(color: ColorResult) => field.onChange(color.hex)}
                                                        />
                                                    </div>
                                                )}
                                            />

                                            <Controller
                                                name="colorExito"
                                                control={control}
                                                render={({ field }) => (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Color Confirmación
                                                            <span className='block text-xs text-gray-400'>
                                                                (Alertas o etiquetas de confirmación)
                                                            </span>
                                                        </label>
                                                        <ChromePicker
                                                            disableAlpha={true}
                                                            color={field.value}
                                                            onChangeComplete={(color: ColorResult) => field.onChange(color.hex)}
                                                        />
                                                    </div>
                                                )}
                                            />

                                            <Controller
                                                name="colorError"
                                                control={control}
                                                render={({ field }) => (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Color Error
                                                            <span className='block text-xs text-gray-400'>
                                                                (Alertas, etiquetas de error)
                                                            </span>
                                                        </label>
                                                        <ChromePicker
                                                            disableAlpha={true}
                                                            color={field.value}
                                                            onChangeComplete={(color: ColorResult) => field.onChange(color.hex)}
                                                        />
                                                    </div>
                                                )}
                                            />

                                            <Controller
                                                name="colorDegradadoDe"
                                                control={control}
                                                render={({ field }) => (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Degradado De
                                                            <span className='block text-xs text-gray-400'>
                                                                (Degradado Inicial)
                                                            </span>
                                                        </label>
                                                        <ChromePicker
                                                            disableAlpha={true}
                                                            color={field.value}
                                                            onChangeComplete={(color: ColorResult) => field.onChange(color.hex)}
                                                        />
                                                    </div>
                                                )}
                                            />

                                            <Controller
                                                name="colorDegradadoHacia"
                                                control={control}
                                                render={({ field }) => (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Color Degradado Hacia
                                                            <span className='block text-xs text-gray-400'>
                                                                (Degradado Final)
                                                            </span>
                                                        </label>
                                                        <ChromePicker
                                                            disableAlpha={true}
                                                            color={field.value}
                                                            onChangeComplete={(color: ColorResult) => field.onChange(color.hex)}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="flex justify-center sm:justify-end">
                                            <NormalButton
                                                type={'button'}
                                                tooltip={'Previsualizar'}
                                                className="ml-auto"
                                                onClick={handlePrevisualizarColores}
                                            >
                                                <FaEye />
                                                Previsualizar
                                            </NormalButton>
                                        </div>
                                        <ProfessionalModal
                                            isOpen={showPreview}
                                            onClose={handleClosePrevisualizarColores}
                                            title={"Previsualizar"}
                                            size="xl"
                                        >
                                            <div className="bg-gray-50 p-5 rounded-lg">
                                                <div className="grid grid-cols-2 gap-4 mb-5">
                                                    {[
                                                        { name: 'Primario', value: previewColors?.colorPrimario },
                                                        { name: 'Secundario', value: previewColors?.colorSecundario },
                                                        { name: 'Éxito', value: previewColors?.colorExito },
                                                        { name: 'Error', value: previewColors?.colorError }
                                                    ].map((color, index) => (
                                                        <div key={index} className="group">
                                                            <div
                                                                className="h-14 rounded-md mb-1 transition-all group-hover:shadow-md"
                                                                style={{ backgroundColor: color.value || "#fff" }}
                                                            />
                                                            <p className="text-xs text-gray-600">
                                                                {color.name}: <span className="font-mono text-gray-800">{color.value}</span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-4 border-t border-gray-200">
                                                    <p className="text-xs text-gray-600 mb-2">Degradado:</p>
                                                    <div
                                                        className="h-8 rounded-full bg-gradient-to-r mb-1"
                                                        style={{ background: `linear-gradient(to right, ${previewColors?.colorDegradadoDe}, ${previewColors?.colorDegradadoHacia})` }}
                                                    />
                                                    <div className="flex justify-between text-xs">
                                                        <span className="font-mono text-gray-700">{previewColors?.colorDegradadoDe}</span>
                                                        <span className="font-mono text-gray-700">{previewColors?.colorDegradadoHacia}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </ProfessionalModal>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Visualización de colores en modo no-edición */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Color Primario
                                            </label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div
                                                    className="w-8 h-8 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: colors?.colorPrimario || "#fff" }}
                                                />
                                                <span className="font-mono text-sm">{colors.colorPrimario}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Color Secundario
                                            </label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div
                                                    className="w-8 h-8 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: colors.colorSecundario || "#fff" }}
                                                />
                                                <span className="font-mono text-sm">{colors.colorSecundario}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Color de Éxito
                                            </label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div
                                                    className="w-8 h-8 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: colors.colorExito || "#fff" }}
                                                />
                                                <span className="font-mono text-sm">{colors.colorExito}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Color de Error
                                            </label>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div
                                                    className="w-8 h-8 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: colors.colorError || "#fff" }}
                                                />
                                                <span className="font-mono text-sm">{colors.colorError}</span>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Degradado (Desde/Hacia)
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div
                                                        className="w-8 h-8 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: colors.colorDegradadoDe || "#fff" }}
                                                    />
                                                    <span className="font-mono text-sm">{colors.colorDegradadoDe}</span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div
                                                        className="w-8 h-8 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: colors.colorDegradadoHacia || "#fff" }}
                                                    />
                                                    <span className="font-mono text-sm">{colors.colorDegradadoHacia}</span>
                                                </div>
                                            </div>
                                            <div className="h-4 rounded-md bg-gradient-to-r"
                                                style={{ background: `linear-gradient(to right, ${colors.colorDegradadoDe}, ${colors.colorDegradadoHacia})` }} />
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Botones de acción */}
                            {editMode && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.3 }}
                                    className="flex justify-center md:justify-end gap-4 pt-1"
                                >
                                    <CancelButton
                                        onClick={() => {
                                            setEditMode(false);
                                            reset();
                                            setLogoPreview(configuracion?.logoUrl || "");
                                            setFondoPreview(configuracion?.fondoLoginUrl || "");
                                            setLogoBase64(null);
                                            setFondoBase64(null);
                                            document.body.classList.remove('editing');
                                        }}
                                        disabled={isUpdating}
                                        tooltip={"Cancelar"}
                                    >
                                        <FaTimes />
                                        Cancelar
                                    </CancelButton>
                                    <NormalButton
                                        type={'submit'}
                                        disabled={isSubmitting}
                                        tooltip={isSubmitting ? 'Guardando...' : "Guardar Configuración"}
                                    >
                                        {isSubmitting ? (
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <FaSave />
                                        )}
                                        {isSubmitting ? 'Guardando...' : "Guardar"}
                                    </NormalButton>
                                </motion.div>
                            )}
                        </div>
                    </form>
                </div>
            </PageContent>
        </>
    );
};

export default ConfiguracionGlobalPage;