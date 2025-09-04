import { motion } from "framer-motion";
import type { GimnasioInputType, GimnasioOutputType } from '../../interfaces/Gimnasio/Gimnasio'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { IconButton, Input, Option, Select, Textarea } from "@material-tailwind/react";
import { CancelButton } from "../Utiles/Buttons/CancelButton";
import { NormalButton } from "../Utiles/Buttons/NormalButton";
import { FaImage, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import ErrorValidationMessage from "../Utiles/Tags/ErrorValidationMessage";
import { useCharCounter } from "../../hooks/Generales/useCharCounter";
import { FiPlus } from "react-icons/fi";
import { limpiarInput } from "../../helpers/limpiezaInputs";
import toast from "react-hot-toast";
import { fileToBase64 } from "../../helpers/formHelper";
import { getErrorMessage } from "../../helpers/errorHelper";

interface GimnasioFormProps {
  initialData?: GimnasioOutputType | null
  onSubmit: (data: GimnasioInputType) => void
  onCancel: () => void,
  isLoading: boolean
}

const GimnasioForm = ({ initialData, onSubmit, onCancel, isLoading }: GimnasioFormProps) => {

  const diasOptions = [
    <Option value="1" key={"1"}>Lunes</Option>,
    <Option value="2" key={"2"}>Martes</Option>,
    <Option value="3" key={"3"}>Miércoles</Option>,
    <Option value="4" key={"4"}>Jueves</Option>,
    <Option value="5" key={"5"}>Viernes</Option>,
    <Option value="6" key={"6"}>Sábado</Option>,
    <Option value="7" key={"7"}>Domingo</Option>
  ];

  const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting }, watch } = useForm<GimnasioInputType>({
    defaultValues: {
      nombre: initialData?.nombre ?? "",
      telefono: initialData?.telefono ?? "",
      email: initialData?.email ?? "",
      sitioWeb: initialData?.sitioWeb ?? "",
      direccion: initialData?.direccion ?? "",
      terminos: { contenido: initialData?.terminos?.contenido ?? "" },
      politica: { contenido: initialData?.politica?.contenido ?? "" },
      horarios: initialData?.horarios?.map(h => ({
        diaSemana: h.diaSemana,
        horaApertura: h.horaApertura ?? "",
        horaCierre: h.horaCierre ?? ""
      })) ?? [],
      zonas: initialData?.zonas?.map(z => ({
        nombre: z.nombre ?? "",
        descripcion: z.descripcion ?? "",
        estatus: z.estatus ?? 0
      })) ?? []
    },
    shouldFocusError: true
  });

  useEffect(() => {
    reset({
      nombre: initialData?.nombre ?? "",
      telefono: initialData?.telefono ?? "",
      email: initialData?.email ?? "",
      sitioWeb: initialData?.sitioWeb ?? "",
      logoUrl: initialData?.logoUrl ?? "",
      direccion: initialData?.direccion ?? "",
      terminos: { contenido: initialData?.terminos?.contenido ?? "" },
      politica: { contenido: initialData?.politica?.contenido ?? "" }
    });
  }, [initialData, reset]);

  const { handleChange: handleNombreChange, Counter: NombreCounter } = useCharCounter(50, watch("nombre"));
  const { handleChange: handleTelefonoChange, Counter: TelefonoCounter } = useCharCounter(10, watch("telefono"));
  const { handleChange: handleEmailChange, Counter: EmailCounter } = useCharCounter(60, watch("email"));
  const { handleChange: handleSitioWebChange, Counter: SitioWebCounter } = useCharCounter(100, watch("sitioWeb"));
  const { handleChange: handleDireccionChange, Counter: DireccionCounter } = useCharCounter(150, watch("direccion"));
  const { handleChange: handlePoliticasChange, Counter: PoliticasCounter } = useCharCounter(500, watch("politica.contenido"));
  const { handleChange: handleTerminosChange, Counter: TerminosCounter } = useCharCounter(500, watch("politica.contenido"));

  const { fields: horariosFields, append: appendHorario, remove: removeHorario } = useFieldArray({
    control,
    name: "horarios"
  });

  const { fields: zonasFields, append: appendZona, remove: removeZona } = useFieldArray({
    control,
    name: "zonas"
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      const imageBase64 = await fileToBase64(file);
      setValue("logoUrl", imageBase64 as string);
    } catch (error: unknown) {
      toast.error("Error al procesar la imagen:" + getErrorMessage(error));
    }
  }

  const handleFormSubmit = (data: GimnasioInputType) => {
    const sanitizedData: GimnasioInputType = {
      ...data,
      nombre: limpiarInput(data.nombre),
      telefono: limpiarInput(data.telefono),
      email: limpiarInput(data.email),
      sitioWeb: limpiarInput(data.sitioWeb),
      direccion: limpiarInput(data.direccion),
      terminos: { contenido: limpiarInput(data.terminos.contenido) },
      politica: { contenido: limpiarInput(data.politica.contenido) },
      zonas: data.zonas.map(z => ({
        ...z,
        nombre: limpiarInput(z.nombre),
        descripcion: limpiarInput(z.descripcion)
      })),
      horarios: data.horarios
    };

    onSubmit(sanitizedData);
  };


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
          Información Básica
        </h2>

        {/* Nombre */}
        <Controller
          name="nombre"
          control={control}
          rules={{
            required: {
              value: true,
              message: "El nombre del gimnasio es obligatorio"
            }
          }}
          render={({ field }) => (
            <div className="relative">
              <Input
                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                {...field}
                id="nombre"
                label="Nombre"
                error={!!errors.nombre}
                placeholder="Nombre"
                disabled={isSubmitting || isLoading}
                maxLength={50}
                {...register("nombre", {
                  onChange: (e) => handleNombreChange(e)
                })}
              />
              <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                <NombreCounter />
              </div>
            </div>
          )}
        />
        <ErrorValidationMessage errors={errors} name="nombre" />


        {/* Teléfono */}
        <Controller
          name="telefono"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Input
                {...field}
                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                id="telefono"
                label="Teléfono"
                error={!!errors.telefono}
                placeholder="Teléfono"
                disabled={isSubmitting || isLoading}
                maxLength={10}
                {...register("telefono", {
                  onChange: (e) => handleTelefonoChange(e)
                })}
              />
              <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                <TelefonoCounter />
              </div>
            </div>
          )}
        />
        <ErrorValidationMessage errors={errors} name="telefono" />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Input
                {...field}
                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                id="email"
                label="Email"
                error={!!errors.email}
                placeholder="Email"
                disabled={isSubmitting || isLoading}
                maxLength={60}
                {...register("email", {
                  onChange: (e) => handleEmailChange(e)
                })}
              />
              <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                <EmailCounter />
              </div>
            </div>
          )}
        />
        <ErrorValidationMessage errors={errors} name="email" />

        {/* Sitio Web */}
        <Controller
          name="sitioWeb"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Input
                {...field}
                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                id="sitioWeb"
                label="Sitio Web"
                error={!!errors.sitioWeb}
                placeholder="Sitio Web"
                disabled={isSubmitting || isLoading}
                maxLength={100}
                {...register("sitioWeb", {
                  onChange: (e) => handleSitioWebChange(e)
                })}
              />
              <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                <SitioWebCounter />
              </div>
            </div>
          )}
        />
        <ErrorValidationMessage errors={errors} name="sitioWeb" />


        {/* Dirección */}
        <Controller
          name="direccion"
          control={control}
          rules={{
            required: {
              value: true,
              message: "El direccion del gimnasio es obligatoria"
            }
          }}
          render={({ field }) => (
            <div className="relative">
              <Textarea
                {...field}
                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                id="direccion"
                label="Dirección"
                error={!!errors.direccion}
                disabled={isSubmitting || isLoading}
                maxLength={150}
                {...register("direccion", {
                  onChange: (e) => handleDireccionChange(e)
                })}
              />
              <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                <DireccionCounter />
              </div>
            </div>
          )}
        />
        <ErrorValidationMessage errors={errors} name="direccion" />

        {/* Logo */}
        <Controller
          name="logoUrl"
          control={control}
          render={({ field: { value } }) => {
            const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (!file) return;
              await handleImageChange({ target: { files: [file] } } as any);
            };

            return (
              <div className="relative">
                <label
                  htmlFor="file-upload"
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`block border-2 border-dashed border-blue-gray-200 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${!isSubmitting && !isLoading && "hover:border-[var(--color-primary)]"}`}
                >
                  {value ? (
                    <div className="relative flex justify-center m-auto max-h-40 max-w-60">
                      <img
                        src={value}
                        alt="Imagen_Gimnasio.jpg"
                        className=" object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setValue("logoUrl", "");
                        }}
                        className="absolute -top-2 -right-2 bg-[var(--color-error)] text-white rounded-full p-1 transition"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <FaImage className="h-12 w-12 text-gray-400" />
                      <p className="text-sm">Da click para seleccionar una imagen</p>
                      <p className="text-xs italic text-gray-600">o arrastra una imagen aquí</p>
                      <span className="text-xs text-gray-600">JPEG, PNG (max 2MB)</span>
                    </div>
                  )}
                </label>

                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => handleImageChange(e)}
                  accept="image/*"
                  className="hidden"
                  disabled={isSubmitting || isLoading}
                />
              </div>)
          }}
        />


      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
          Horarios
        </h2>
        {horariosFields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-3 md:flex-row md:items-start w-full">
            <div className="w-full">
              <Controller
                name={`horarios.${index}.diaSemana`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "El día es obligatorio"
                  }
                }}
                render={({ field }) => (
                  <Select
                    label="Día"
                    value={String(field.value)}
                    onChange={(value) => field.onChange(Number(value))}
                    error={!!errors.horarios?.[index]?.diaSemana}
                    disabled={isSubmitting || isLoading}
                    placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                  >
                    {diasOptions}
                  </Select>
                )}
              />
              <ErrorValidationMessage errors={errors} name={`horarios.${index}.diaSemana`} />
            </div>
            <div className="w-full">
              <Controller
                name={`horarios.${index}.horaApertura`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Hora apertura obligatoria"
                  }
                }}
                render={({ field }) => (
                  <Input
                    onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                    {...field}
                    type="time"
                    error={!!errors.horarios?.[index]?.horaApertura}
                    label="Apertura"
                    disabled={isSubmitting || isLoading}
                  />
                )}
              />
              <ErrorValidationMessage errors={errors} name={`horarios.${index}.horaApertura`} />
            </div>
            <div className="w-full">
              <Controller
                name={`horarios.${index}.horaCierre`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Hora cierre obligatoria"
                  }
                }}
                render={({ field }) => (
                  <Input onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                    {...field}
                    error={!!errors.horarios?.[index]?.horaCierre}
                    type="time"
                    label="Cierre"
                    disabled={isSubmitting || isLoading}
                  />
                )}
              />
              <ErrorValidationMessage errors={errors} name={`horarios.${index}.horaCierre`} />
            </div>
            <div className="flex justify-end">
              <IconButton
                color="red"
                size="md" // asegúrate de que tenga tamaño suficiente
                onClick={() => removeHorario(index)}
                disabled={horariosFields.length <= 1 || isSubmitting || isLoading}
                placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
              >
                <FaTrash />
              </IconButton>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendHorario({ diaSemana: 1, horaApertura: "", horaCierre: "", horarioValido: true })}
          className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-secondary)] mt-2 text-sm font-medium transition duration-300 ease-in-out"
          disabled={isSubmitting || isLoading}
        >
          <FiPlus className="mr-2" /> Agregar otro horario
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-3"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
          Zonas
        </h2>

        {zonasFields.map((zona, index) => (
          <div key={zona.id} className="flex flex-col gap-3 md:flex-row md:items-start w-full">
            <div className="w-full">
              <Controller
                name={`zonas.${index}.nombre`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Nombre es obligatorio"
                  }
                }}
                render={({ field }) => (
                  <Input
                    onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} {...field}
                    id={`zona-nombre-${index}`}
                    label="Nombre"
                    error={!!errors.zonas?.[index]?.nombre}
                    placeholder="Nombre"
                    disabled={isSubmitting || isLoading}
                  />
                )}
              />
              <ErrorValidationMessage errors={errors} name={`zonas.${index}.nombre`} />
            </div>

            <div className="w-full">
              <Controller
                name={`zonas.${index}.descripcion`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Descripción es obligatoria"
                  }
                }}
                render={({ field }) => (
                  <Input
                    onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} {...field}
                    id={`zona-descripcion-${index}`}
                    label="Descripción"
                    error={!!errors.zonas?.[index]?.descripcion}
                    placeholder="Descripción"
                    disabled={isSubmitting || isLoading}
                  />
                )}
              />
              <ErrorValidationMessage errors={errors} name={`zonas.${index}.descripcion`} />
            </div>

            <div className="flex justify-end">
              <IconButton
                color="red"
                onClick={() => removeZona(index)}
                disabled={zonasFields.length <= 1}
                placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
              >
                <FaTrash />
              </IconButton>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendZona({ nombre: "", descripcion: "" })}
          className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-secondary)] mt-2 text-sm font-medium transition duration-300 ease-in-out"
        >
          <FiPlus className="mr-2" /> Agregar otra zona
        </button>
      </motion.div>


      {/* Términos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
          Términos Y Condiciones
        </h2>
        <Controller
          name="terminos.contenido"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Los términos son obligatorios"
            }
          }}
          render={({ field }) => (
            <div className="relative">
              <Textarea
                {...field}
                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                id="terminos.contenido"
                label="Términos y Condiciones"
                error={!!errors.terminos}
                disabled={isSubmitting || isLoading}
                {...register("terminos.contenido", {
                  onChange: e => handleTerminosChange(e)
                })}
                maxLength={500}
              />
              <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                <TerminosCounter />
              </div>
            </div>
          )}
        />
        <ErrorValidationMessage errors={errors} name="terminos.contenido" />
        <p className="text-xs text-blue-gray-500 italic">Estos términos serán mostrados a los socios</p>
      </motion.div>

      {/* Políticas */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <span className="w-2 h-6 bg-[var(--color-primary)] rounded-full"></span>
          Políticas
        </h2>
        <Controller
          name="politica.contenido"
          control={control}
          rules={{
            required: {
              value: true,
              message: "La política es obligatoria"
            }
          }}
          render={({ field }) => (
            <div className="relative">
              <Textarea
                {...field}
                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                id="politica.contenido"
                label="Políticas"
                error={!!errors.politica}
                disabled={isSubmitting || isLoading}
                {...register("politica.contenido", {
                  onChange: e => handlePoliticasChange(e)
                })}
                maxLength={500}
              />
              <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                <PoliticasCounter />
              </div>
            </div>
          )}
        />
        <ErrorValidationMessage errors={errors} name="politica.contenido" />
        <p className="text-xs text-blue-gray-500 italic">Estas políticas serán mostradas a los socios</p>
      </motion.div>

      {/* Botones */}
      <div className="flex justify-between md:justify-end gap-4">
        <CancelButton type="button" onClick={onCancel} tooltip="Cancelar">
          <FaTimes /> Cancelar
        </CancelButton>
        <NormalButton type="submit" tooltip="Guardar" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ?
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            : <FaSave />}
          {isSubmitting || isLoading ? "Guardando..." : "Guardar"}
        </NormalButton>
      </div>
    </form >
  );
};


export default GimnasioForm