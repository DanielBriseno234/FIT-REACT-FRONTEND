import { useFormContext, Controller } from 'react-hook-form';

export const CheckboxField = ({
    name,
    label,
    required = false,
    className = '',
    disabled = false,
    rules = {},
    ...props
}) => {
    const { control, formState: { errors } } = useFormContext();

    const validationRules = {
        ...(required && { required: `Debes aceptar ${label?.toLowerCase() || 'este campo'}` }),
        ...rules
    };

    const error = errors[name];

    return (
        <div className={`mb-4 ${className}`}>
            <Controller
                name={name}
                control={control}
                rules={validationRules}
                render={({ field }) => (
                    <div className="flex items-center">
                        <input
                            {...field}
                            type="checkbox"
                            className={`h-4 w-4 rounded border ${error ? 'border-red-300 text-red-600 focus:ring-red-500' :
                                    'border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-secondary)]'
                                } focus:ring-2 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            checked={field.value}
                            disabled={disabled}
                            {...props}
                        />
                        <label className={`ml-2 block text-sm ${error ? 'text-red-600' : 'text-gray-700'
                            }`}>
                            {label}
                            {required && <span className="text-red-500"> *</span>}
                        </label>
                    </div>
                )}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
        </div>
    );
};