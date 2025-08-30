export interface TerminoInputType {
    contenido: string
}

export interface TerminoOutputType {
    id: number;
    contenido: string;
    activo: boolean;
    fechaRegistro: string;
    fechaModificacion: string;
}