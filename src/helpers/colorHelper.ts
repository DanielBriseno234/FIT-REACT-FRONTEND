import type { ColoresType } from "../interfaces/Configuracion/Configuracion";

export const aclararColor = (color: string, percent = 50): string => {
    if (!color) return "#ffffff"; // Fallback a blanco si no hay color

    // Convierte HEX a RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Mezcla con blanco (percent% del color original + (100 - percent)% blanco)
    const mixWithWhite = (channel: number) =>
        Math.round(channel + (255 - channel) * (percent / 100));

    const newR = mixWithWhite(r);
    const newG = mixWithWhite(g);
    const newB = mixWithWhite(b);

    // Convierte de nuevo a HEX
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

export const aplicarColoresAlDocumento = (colors: ColoresType): void => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors?.colorPrimario);
    root.style.setProperty('--color-secondary', colors?.colorSecundario);
    root.style.setProperty('--color-success', colors?.colorExito);
    root.style.setProperty('--color-error', colors?.colorError);
    root.style.setProperty('--color-gradient-from', colors?.colorDegradadoDe);
    root.style.setProperty('--color-gradient-to', colors?.colorDegradadoHacia);
}