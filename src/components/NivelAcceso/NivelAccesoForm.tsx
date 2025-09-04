import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import type { NivelAccesoInputType, NivelAccesoOutput } from '../../interfaces/NivelAcceso/NivelAcceso'
import { Controller, useForm } from 'react-hook-form'
import { Input, Option, Select } from '@material-tailwind/react';
import ErrorValidationMessage from '../Utiles/Tags/ErrorValidationMessage';
import { useCharCounter } from '../../hooks/Generales/useCharCounter';
import { useRoles } from '../../hooks/Rol/useRoles';
import { CancelButton } from '../Utiles/Buttons/CancelButton';
import { NormalButton } from '../Utiles/Buttons/NormalButton';
import { FaSave, FaTimes } from 'react-icons/fa';
import { usePermisos } from '../../hooks/Permiso/usePermisos';
import { limpiarInput } from '../../helpers/limpiezaInputs';
import SelectReact from 'react-select';
import FormSkeleton from '../Utiles/Loader/FormSkeleton';

interface NivelAccesoFormProps {
    initialData?: NivelAccesoOutput | null
    onSubmit: (data: NivelAccesoInputType) => void
    onCancel: () => void,
    isLoading: boolean
}

const NivelAccesoForm: React.FC<NivelAccesoFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading
}) => {
    const { register, handleSubmit, setValue, reset, control, formState: { errors, isSubmitting }, watch } = useForm<NivelAccesoInputType>({
        defaultValues: {
            nombre: initialData?.nombre ?? "",
            descripcion: initialData?.descripcion ?? "",
            idRol: initialData?.rol.id ?? 0,
            permisos: initialData?.permisos.map(permiso => permiso.idPermiso) ?? []
        }
    });

    const rolSelected = watch("idRol");
    const permisosValue = watch("permisos");

    const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useRoles();
    const { data: permisos, isLoading: isLoadingPermisos, error: errorPermisos } = usePermisos(rolSelected ?? 0);
    const [optionsPermisos, setOptionsPermisos] = useState<{ value: string; label: string }[]>([]);
    const [previousRol, setPreviousRol] = useState<number | null>(null);

    useEffect(() => {
        if (permisos) {
            setOptionsPermisos(
                permisos.map((permiso) => ({
                    value: permiso.idPermiso.toString(),
                    label: permiso.descripcion,
                }))
            );
        }
    }, [permisos]);

    useEffect(() => {
        if (roles && initialData) {
            reset({
                nombre: initialData.nombre,
                descripcion: initialData.descripcion,
                idRol: initialData.rol.id,
                permisos: initialData.permisos.map(permiso => permiso.idPermiso)
            });
            setPreviousRol(initialData.rol.id);
        }
    }, [roles, initialData, reset]);

    useEffect(() => {
        if (rolSelected !== previousRol && previousRol !== null) {
            setValue('permisos', []);
        }
        setPreviousRol(rolSelected);
    }, [rolSelected, previousRol, setValue]);

    const { handleChange: handleNombreChange, Counter: NombreCounter } = useCharCounter(50, watch("nombre"));
    const { handleChange: handleDescripcionChange, Counter: DescripcionCounter } = useCharCounter(50, watch("descripcion"));

    const selectedPermisosOptions = optionsPermisos.filter(opt =>
        permisosValue.includes(Number(opt.value))
    );

    const handleFormSubmit = (data: NivelAccesoInputType) => {
        const sanitizedData = {
            ...data,
            nombre: limpiarInput(data.nombre),
            descripcion: limpiarInput(data.descripcion)
        }
        onSubmit(sanitizedData);
    }

    if (isLoadingRoles) {
        return (
            <FormSkeleton />
        );
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
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
                            message: "El nombre es obligatorio"
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
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleNombreChange(e);
                                }}
                            />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <NombreCounter />
                            </div>
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="nombre" />

                {/* Descripcion */}
                <Controller
                    name="descripcion"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "La descripción es obligatoria"
                        }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                                {...field}
                                id="descripcion"
                                label="Descripción"
                                error={!!errors.descripcion}
                                placeholder="Descripción"
                                disabled={isSubmitting || isLoading}
                                maxLength={50}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleDescripcionChange(e);
                                }}
                            />
                            <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                                <DescripcionCounter />
                            </div>
                        </div>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="descripcion" />

                {/* Rol */}
                <Controller
                    name="idRol"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "El rol es obligatorio"
                        },
                        validate: value => value !== 0 || "El rol es obligatorio"
                    }}
                    render={({ field }) => (
                        <Select
                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} label='Rol'
                            {...field}
                            value={field.value?.toString() || '4'}
                        >
                            {roles && roles.length ? (
                                roles.map(rol => <Option key={rol.id} value={rol.id.toString()}>{rol.nombre}</Option>)
                            ) : (
                                <Option value='' disabled>Sin Roles</Option>
                            )}
                        </Select>
                    )}
                />
                <ErrorValidationMessage errors={errors} name="idRol" />

                {/* Permisos */}
                <Controller
                    name="permisos"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Debes seleccionar por lo menos un permiso"
                        },
                    }}
                    render={({ field }) => {
                        // const selectedOptions = optionsPermisos.filter(opt =>
                        //     field.value.includes(Number(opt.value))
                        // );
                        return (
                            <div className="relative">
                                <SelectReact
                                    {...field}
                                    closeMenuOnSelect={false}
                                    placeholder="Selecciona los permisos"
                                    noOptionsMessage={() => "Sin permisos"}
                                    isSearchable
                                    isDisabled={isSubmitting || isLoadingPermisos || isLoadingRoles}
                                    isMulti
                                    options={optionsPermisos}
                                    value={selectedPermisosOptions}
                                    onChange={(selectedOptions) => {
                                        const values = selectedOptions
                                            ? selectedOptions.map(opt => Number(opt.value))
                                            : [];
                                        field.onChange(values);
                                    }}
                                />
                            </div>
                        );
                    }}
                />
                <ErrorValidationMessage errors={errors} name="permisos" />
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
    )
}

export default NivelAccesoForm