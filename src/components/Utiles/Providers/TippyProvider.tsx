import Tippy, { type TippyProps } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useEffect, useState, type ReactElement } from "react";

import "tippy.js/animations/perspective.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/animations/shift-toward.css";
import "tippy.js/animations/scale.css";

// Temas
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/themes/material.css";
import "tippy.js/themes/translucent.css";

interface TippyWrapperProps extends TippyProps {
    children: ReactElement; // Tippy requiere un solo hijo React válido
    content: React.ReactNode;
    placement?: TippyProps["placement"];
    theme?: TippyProps["theme"];
    disableOnMobile?: boolean;
}

const TippyWrapper = ({
    children,
    content,
    placement = "top",
    theme = "light",
    disableOnMobile = true,
    ...props
}: TippyWrapperProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Configuración global
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("tippy.js").then(({ default: tippy }) => {
                tippy.setDefaultProps({
                    animation: "perspective",
                    duration: [200, 150],
                    arrow: true,
                    delay: [300, 0],
                    interactive: true,
                    hideOnClick: false,
                    touch: !disableOnMobile && ["hold", 500],
                });
            });
        }
    }, [disableOnMobile]);

    if (disableOnMobile && isMobile) {
        return children;
    }

    return (
        <Tippy
            content={content}
            placement={placement}
            theme={theme}
            touch={!disableOnMobile}
            appendTo={document.body}
            popperOptions={{
                modifiers: [
                    {
                        name: "preventOverflow",
                        options: {
                            padding: 8,
                        },
                    },
                ],
            }}
            {...props}
        >
            {children}
        </Tippy>
    );
};

export default TippyWrapper;
