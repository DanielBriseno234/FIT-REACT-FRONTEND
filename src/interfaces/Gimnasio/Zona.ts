export interface ZonaInputType {
    nombre: string;
    descripcion: string;
}

export interface ZonaOutputType {
    id: number;
    nombre: string;
    descripcion: string;
    estatus: number;
    fechaRegistro: string;
    fechaModificacion: string;
}