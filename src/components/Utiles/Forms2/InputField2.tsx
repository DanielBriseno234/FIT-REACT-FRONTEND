import { Input, type InputProps } from "@material-tailwind/react";
import React, { type ChangeEvent } from "react";

interface InputFieldProps extends InputProps {
    id?: string;
    name: string;
    label?: string;
    iconLabel?: React.ReactNode;
    iconInput?: React.ReactNode;
    error?: boolean;
    placeholder: string;
    disabled?: boolean;
    maxLength?: number;
    showCounter?: boolean;
    value?: string;
}

const InputField2 = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ id, name, label, iconLabel, iconInput, error, placeholder, disabled, maxLength, showCounter, value, ...props }, ref) => {

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            console.log(e.target.value)
        }

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    id={id}
                    name={name}
                    label={label}
                    error={error}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    value={value}
                    onChange={e => handleChange(e)}
                    {...props}
                />
                {showCounter && maxLength && (
                    <div className="absolute right-2 bottom-3 bg-white px-1 rounded text-xs text-gray-500">
                        {(value?.length) || 0}/{maxLength}
                    </div>
                )}
            </div>
        );
    });

InputField2.displayName = "InputField2";

export default InputField2;