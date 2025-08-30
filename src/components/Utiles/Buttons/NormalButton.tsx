import { Button, type ButtonProps } from "@material-tailwind/react";
import Tippy from "../Providers/TippyProvider";
import { twMerge } from 'tailwind-merge';

interface NormalButtonProps extends Omit<ButtonProps, 'className'> {
    tooltip?: string;
    className?: string
}

export function NormalButton({ children, tooltip, className, ...props }: NormalButtonProps) {

    const baseStyles = 'flex items-center gap-2 justify-center px-5 bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] hover:from-[var(--color-gradient-from)]/80 hover:to-[var(--color-gradient-to)]/80 transition duration-300 ease-in-out';

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
                {children ?? "Botón"}
            </Button>
        </Tippy>
    );
}
