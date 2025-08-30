// src/components/Utiles/Formulario/TimeField.jsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getError } from "../../../helpers/formHelper";

export const TimeField = ({ name, label, required = false, rules = {}, className = "", ...props }) => {
  const { control, formState: { errors } } = useFormContext();
  const fieldError = getError(errors, name);

  const validationRules = {
    ...(required && { required: `${label || "Este campo"} es requerido` }),
    ...rules
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className={`block text-sm font-medium mb-1 ${fieldError ? 'text-red-600' : 'text-gray-700'}`}>{label} {required && <span className="text-red-500"> *</span>}</label>}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field }) => (
          <input
            {...field}
            type="time"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]
              ${fieldError ? 'border-red-300 focus:ring-red-300' : 'border-gray-300'}`}
            {...props}
          />
        )}
      />

      {fieldError && <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>}
    </div>
  );
};
