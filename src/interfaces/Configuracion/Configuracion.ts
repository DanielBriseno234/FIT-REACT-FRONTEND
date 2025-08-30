export type Color = `#${string}`

export type ColoresType = {
    colorPrimario: Color | null;
    colorSecundario: Color | null;
    colorExito: Color | null;
    colorError: Color | null;
    colorDegradadoDe: Color | null;
    colorDegradadoHacia: Color | null;
}

export interface ConfiguracionInputType extends ColoresType {
    logoUrl?: string;
    fondoLoginUrl?: string;
    mostrarFraseMotivacional: boolean;
    nombreFranquicia: string;
    fraseMotivacional?: string;
    autorFraseMotivacional?: string;
}

export interface ConfiguracionOutputType extends ConfiguracionInputType {
    id: number;
    fechaRegistro: string;
    fechaModificacion: string;
}