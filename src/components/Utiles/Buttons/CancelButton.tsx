import { Button, type ButtonProps } from "@material-tailwind/react"
import Tippy from "../Providers/TippyProvider"
import { twMerge } from 'tailwind-merge';

interface CancelButtonProps extends Omit<ButtonProps, "className"> {
    tooltip?: string
    className?: string
}

export function CancelButton({ children, tooltip, className, ...props }: CancelButtonProps) {

    const baseStyles = "flex items-center gap-2 px-5 bg-gradient-to-br from-[var(--color-error)] to-[var(--color-error)]/80 hover:from-[var(--color-error)]/80 hover:to-[var(--color-error)]/60 transition duration-300 ease-in-out";

    const estilos = twMerge(baseStyles, className);

    return (
        <Tippy
            content={tooltip}
            placement="top"
            animation="perspective"
            theme="light-border"
        >
            <Button
                placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                className={estilos}
                {...props}
            >
                {children}
            </Button>
        </Tippy>
    )
}
