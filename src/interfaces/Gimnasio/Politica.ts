export interface PoliticaInputType {
    contenido: string
}

export interface PoliticaOutputType {
    id: number;
    contenido: string;
    activo: boolean;
    fechaRegistro: string;
    fechaModificacion: string;
}