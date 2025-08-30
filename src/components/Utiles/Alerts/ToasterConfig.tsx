// ToasterConfig.tsx
import { ToastBar, Toaster, type Toast } from 'react-hot-toast';
import { useConfigStore } from '../../../store/configStore';
import { aclararColor } from '../../../helpers/colorHelper';
import type { ConfiguracionOutputType } from '../../../interfaces/Configuracion/Configuracion';

export const ToasterConfig = () => {
    const { configuracion } = useConfigStore();

    // Si no hay configuracion cargada, usa colores por defecto
    const colores: ConfiguracionOutputType["colores"] = configuracion?.colores ?? {
        colorPrimario: "#3B82F6",
        colorSecundario: "#3127F5",
        colorExito: "#10b981",
        colorError: "#ef4444",
        colorDegradadoDe: "#3B82F6",
        colorDegradadoHacia: "#3127F5"
    };

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 6000,
                className: 'rounded-xl shadow-lg ring-1 ring-black/10 px-4 py-3',
                style: {
                    background: '#ffffff',
                    color: '#1f2937',
                    borderLeft: `6px solid ${colores.colorPrimario}`,
                },
                success: {
                    style: {
                        background: aclararColor(colores.colorPrimario, 95),
                        color: colores.colorExito,
                        borderLeft: `6px solid ${colores.colorExito}`,
                    },
                    iconTheme: {
                        primary: colores.colorExito,
                        secondary: 'white',
                    }
                },
                error: {
                    className: 'rounded-xl shadow-lg ring-1 ring-rose-300/40 px-4 py-3',
                    style: {
                        background: aclararColor(colores.colorError, 95),
                        color: colores.colorError,
                        borderLeft: `6px solid ${colores.colorError}`,
                    },
                    iconTheme: {
                        primary: colores.colorError,
                        secondary: 'white',
                    }
                },
                loading: {
                    style: {
                        background: aclararColor(colores.colorPrimario, 95),
                        color: colores.colorPrimario,
                        borderLeft: `6px solid ${colores.colorPrimario}`,
                    },
                    iconTheme: {
                        primary: colores.colorPrimario,
                        secondary: 'white',
                    }
                }
            }}
        >
            {(t: Toast) => (
                <ToastBar
                    toast={t}
                    style={{
                        ...t.style,
                        animation: t.visible
                            ? 'custom-enter 1s ease'
                            : 'custom-exit 1s ease forwards',
                    }}
                />
            )}
        </Toaster>
    );
};
