import { ErrorMessage } from "@hookform/error-message"
import type { FieldErrors } from "react-hook-form";

interface ErrorValidationMessageProps {
    errors: FieldErrors;
    name: string;
}

const ErrorValidationMessage = ({ errors, name }: ErrorValidationMessageProps) => {
    return (
        <ErrorMessage errors={errors} name={name} render={({ message }) => <span className='text-red-600 text-xs italic'>{message}</span>} />
    )
}

export default ErrorValidationMessage
