import { useFormContext, Controller } from 'react-hook-form';

export const DateField = ({
    name,
    label,
    required = false,
    ...props
}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        {...field}
                        type="date"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] ${errors[name] ? 'border-red-500' : 'border-gray-300'
                            }`}
                        {...props}
                    />
                )}
            />

            {errors[name] && (
                <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
            )}
        </div>
    );
};