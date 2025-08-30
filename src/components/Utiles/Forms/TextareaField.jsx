// src/components/Utiles/Formulario/TextareaField.jsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getError } from "../../../helpers/formHelper";

export const TextareaField = ({
  name,
  label,
  placeholder = "",
  rows = 4,
  required = false,
  maxLength,
  showCounter = false,
  rules = {},
  className = "",
  ...props
}) => {
  const { control, watch, formState: { errors } } = useFormContext();
  const fieldError = getError(errors, name);
  const value = watch(name);

  const validationRules = {
    ...(required && { required: `${label || "Este campo"} es requerido` }),
    ...(maxLength && { maxLength: { value: maxLength, message: `Máximo ${maxLength} caracteres` } }),
    ...rules
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${fieldError ? 'text-red-600' : 'text-gray-700'}`}>
          {label} {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field }) => (
          <div className="relative">
            <textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]
                ${fieldError ? 'border-red-300 focus:ring-red-300' : 'border-gray-300'}`}
              maxLength={maxLength}
              {...props}
            />
            {showCounter && maxLength && (
              <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                {value?.length || 0}/{maxLength}
              </div>
            )}
          </div>
        )}
      />

      {fieldError && <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>}
    </div>
  );
};
