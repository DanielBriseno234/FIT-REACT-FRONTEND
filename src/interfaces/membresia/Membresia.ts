

// TIPOS DE ENTRADA

import type { Pageable, Sort } from "../Paginacion/Paginacion";


// TIPOS DE SALIDA
export type MembresiaOutputPaginated = {
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    content: MembresiaItem[];
    sort: Sort[];
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: Pageable;
    empty: boolean;
}

export type MembresiaItem = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionDias: number;
    activa: "ACTIVA" | "INACTIVA"
    fechaModificacion: string
}

export type MembresiaOutputType = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionDias: number;
    visitasIncluidas: number;
    clasesIncluidas: number;
    accesoTodasClases: boolean;
    tiposClasePermitidas: TiposClasePermitida[];
    accesoTodosGimnasios: boolean;
    activa: string;
    gimnasiosPermitidos: GimnasiosPermitido[];
}

export type GimnasiosPermitido = {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    logoUrl: string;
    activo: string;
}

export type TiposClasePermitida = {
    id: number;
    nombre: string;
    descripcion: string;
    activa: string;
}