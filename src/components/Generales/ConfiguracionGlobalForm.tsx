import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaImage, FaQuoteLeft, FaUser, FaPen, FaCheckCircle, FaRocket, FaPalette, FaEye } from 'react-icons/fa';
import { NormalButton } from '../Utiles/Buttons/NormalButton';
import ProfessionalModal from '../Utiles/Modals/Modal';
import { ChromePicker, type ColorResult } from 'react-color';
import { useConfigStore } from '../../store/configStore';
import type { ConfiguracionInputType } from '../../interfaces/Configuracion/Configuracion';

// Corregir la interfaz
interface ConfiguracionInputs extends ConfiguracionInputType {
    logoBase64?: string | null;
    fondoBase64?: string | null;
}

export const ConfiguracionGlobalForm = () => {
    const { guardarConfig, configuracion } = useConfigStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        control,
        getValues,
        formState: { errors },
    } = useForm<ConfiguracionInputs>({
        defaultValues: {
            nombreFranquicia: configuracion?.nombreFranquicia || '',
            mostrarFraseMotivacional: configuracion?.mostrarFraseMotivacional || false,
            fraseMotivacional: configuracion?.fraseMotivacional || '',
            autorFraseMotivacional: configuracion?.autorFraseMotivacional || '',
            logoUrl: configuracion?.logoUrl || '',
            fondoLoginUrl: configuracion?.fondoLoginUrl || '',
            colorPrimario: configuracion?.colorPrimario || '#170BF4',
            colorSecundario: configuracion?.colorSecundario || '#3127F5',
            colorExito: configuracion?.colorExito || '#02A314',
            colorError: configuracion?.colorError || '#A30702',
            colorDegradadoDe: configuracion?.colorDegradadoDe || '#170BF4',
            colorDegradadoHacia: configuracion?.colorDegradadoHacia || '#0F079C',
            logoBase64: null,
            fondoBase64: null,
        },
    });

    const mostrarFrase = watch('mostrarFraseMotivacional', false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoBase64, setLogoBase64] = useState<string | null>(null);
    const [fondoPreview, setFondoPreview] = useState<string | null>(null);
    const [fondoBase64, setFondoBase64] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

    const previewColors = useMemo(() => {
        const values = getValues();
        return {
            colorPrimario: values.colorPrimario,
            colorSecundario: values.colorSecundario,
            colorExito: values.colorExito,
            colorError: values.colorError,
            colorDegradadoDe: values.colorDegradadoDe,
            colorDegradadoHacia: values.colorDegradadoHacia,
        };
    }, [getValues, showPreview]);

    const handlePrevisualizarColores = () => {
        setShowPreview(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'logo' | 'fondo') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no debe exceder los 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (tipo === 'logo') {
                setLogoPreview(base64);
                setLogoBase64(base64);
            } else {
                setFondoPreview(base64);
                setFondoBase64(base64);
            }
        };
        reader.onerror = () => {
            toast.error('Error al leer el archivo');
        };
        reader.readAsDataURL(file);
    };

    const onSubmit: SubmitHandler<ConfiguracionInputs> = async (data) => {
        setIsLoading(true);
        try {
            const payload: ConfiguracionInputType = {
                nombreFranquicia: data.nombreFranquicia,
                mostrarFraseMotivacional: data.mostrarFraseMotivacional,
                fraseMotivacional: data.fraseMotivacional,
                autorFraseMotivacional: data.autorFraseMotivacional,
                colorPrimario: data.colorPrimario,
                colorSecundario: data.colorSecundario,
                colorExito: data.colorExito,
                colorError: data.colorError,
                colorDegradadoDe: data.colorDegradadoDe,
                colorDegradadoHacia: data.colorDegradadoHacia,
                logoUrl: logoBase64 || data.logoUrl || '',
                fondoLoginUrl: fondoBase64 || data.fondoLoginUrl || '',
            };

            const result = await guardarConfig(payload);

            if (result.success) {
                toast.success(result.mensaje);
                navigate('/seleccionar-rol');
            } else {
                toast.error(result.mensaje);
            }
        } catch (error) {
            toast.error('Error al guardar la configuración');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const colorFields = [
        { key: 'colorPrimario', label: 'Primario', description: 'Color principal de la marca' },
        { key: 'colorSecundario', label: 'Secundario', description: 'Color secundario' },
        { key: 'colorExito', label: 'Éxito', description: 'Para operaciones exitosas' },
        { key: 'colorError', label: 'Error', description: 'Para errores y advertencias' },
        { key: 'colorDegradadoDe', label: 'Degradado Desde', description: 'Inicio del degradado' },
        { key: 'colorDegradadoHacia', label: 'Degradado Hacia', description: 'Fin del degradado' },
    ] as const;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
            <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 w-full max-w-6xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"></div>
                <div className="px-8 py-10">
                    {/* Encabezado */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-blue-500 border border-blue-500 backdrop-blur-sm">
                                <FaRocket className="text-3xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Configuración Inicial</h1>
                        <p className="text-blue-500 mt-2 text-sm font-medium tracking-wider">PERSONALIZA TU PLATAFORMA</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Nombre franquicia */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                <FaPen className="inline text-blue-500 mr-1" />
                                Nombre de la Franquicia *
                            </label>
                            <input
                                type="text"
                                {...register('nombreFranquicia', {
                                    required: 'Este campo es obligatorio',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres'
                                    }
                                })}
                                placeholder="FITQIK"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/40 shadow-sm"
                                disabled={isLoading}
                            />
                            {errors.nombreFranquicia && (
                                <p className="text-sm text-red-500 mt-1">{errors.nombreFranquicia.message}</p>
                            )}
                        </div>

                        {/* Imagenes */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                {
                                    label: 'Logo',
                                    tipo: 'logo',
                                    preview: logoPreview,
                                    name: 'logoBase64'
                                },
                                {
                                    label: 'Fondo de Login',
                                    tipo: 'fondo',
                                    preview: fondoPreview,
                                    name: 'fondoBase64'
                                }
                            ].map(({ label, tipo, preview, name }) => (
                                <div key={tipo} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FaImage className="inline mr-1 text-blue-500" /> {label}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, tipo as 'logo' | 'fondo')}
                                        className="block w-full text-sm file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition shadow-sm"
                                        disabled={isLoading}
                                    />
                                    {preview && (
                                        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                                            <img
                                                src={preview}
                                                alt={`Preview ${tipo}`}
                                                className="w-full h-32 object-contain rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <input type="hidden" {...register(name as any)} />
                                </div>
                            ))}
                        </div>

                        {/* Mostrar frase */}
                        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                            <input
                                type="checkbox"
                                {...register('mostrarFraseMotivacional')}
                                className="w-5 h-5 text-blue-600 accent-blue-600 rounded"
                                disabled={isLoading}
                            />
                            <label className="text-sm text-gray-800 font-medium">¿Mostrar frase motivacional?</label>
                        </div>

                        {/* Frase motivacional */}
                        {mostrarFrase && (
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                                        <FaQuoteLeft className="inline text-blue-500 mr-1" />
                                        Frase Motivacional
                                    </label>
                                    <input
                                        type="text"
                                        {...register('fraseMotivacional')}
                                        placeholder="Cree en ti mismo..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/40 shadow-sm"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                                        <FaUser className="inline text-blue-500 mr-1" />
                                        Autor
                                    </label>
                                    <input
                                        type="text"
                                        {...register('autorFraseMotivacional')}
                                        placeholder="Albert Einstein"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/40 shadow-sm"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Paleta de colores - Versión mejorada */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                            <label className="text-sm font-semibold text-gray-700 block mb-4">
                                <FaPalette className="inline text-blue-500 mr-1" />
                                Paleta de colores
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                {colorFields.map(({ key, label, description }) => (
                                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {label}
                                        </label>
                                        <p className="text-xs text-gray-500 mb-2">{description}</p>

                                        <Controller
                                            name={key}
                                            control={control}
                                            rules={{ required: 'Color requerido' }}
                                            render={({ field }) => (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div
                                                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                                            style={{ backgroundColor: field.value || "" }}
                                                            onClick={() => setActiveColorPicker(activeColorPicker === key ? null : key)}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={field.value || ""}
                                                            onChange={field.onChange}
                                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                                            placeholder="#FFFFFF"
                                                        />
                                                    </div>

                                                    {activeColorPicker === key && (
                                                        <div className="mt-2">
                                                            <ChromePicker
                                                                disableAlpha
                                                                color={field.value}
                                                                onChangeComplete={(color: ColorResult) => {
                                                                    field.onChange(color.hex);
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center lg:justify-end">
                                <NormalButton
                                    type="button"
                                    tooltip="Previsualizar colores"
                                    onClick={handlePrevisualizarColores}
                                    disabled={isLoading}
                                >
                                    <FaEye />
                                    Previsualizar
                                </NormalButton>
                            </div>
                        </div>

                        {/* Botón guardar */}
                        <NormalButton
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                        // className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle />
                                    Guardar Configuración
                                </>
                            )}
                        </NormalButton>
                    </form>
                </div>
            </motion.div>

            <ProfessionalModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                title="Previsualizar Colores"
                size="xl"
            >
                <div className="bg-gray-50 p-5 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        {([
                            { name: 'Primario', value: previewColors.colorPrimario },
                            { name: 'Secundario', value: previewColors.colorSecundario },
                            { name: 'Éxito', value: previewColors.colorExito },
                            { name: 'Error', value: previewColors.colorError },
                        ]).map((color, index) => (
                            <div key={index} className="group">
                                <div
                                    className="h-14 rounded-md mb-1 transition-all group-hover:shadow-md"
                                    style={{ backgroundColor: color.value || undefined }}
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
                            style={{
                                background: `linear-gradient(to right, ${previewColors.colorDegradadoDe}, ${previewColors.colorDegradadoHacia})`
                            }}
                        />
                        <div className="flex justify-between text-xs">
                            <span className="font-mono text-gray-700">{previewColors.colorDegradadoDe}</span>
                            <span className="font-mono text-gray-700">{previewColors.colorDegradadoHacia}</span>
                        </div>
                    </div>
                </div>
            </ProfessionalModal>
        </div>
    );
};