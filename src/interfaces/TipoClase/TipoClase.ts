import type { Pageable, Sort } from "../Paginacion/Paginacion";

// TIPOS DE ENTRADA
export type TipoClaseInput = {
    nombre: string,
    descripcion: string
}

// TIPOS DE SALIDA
export type TipoClaseOutputPaginated = {
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    content: TipoClaseItem[];
    sort: Sort[];
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: Pageable;
    empty: boolean;
}

export type TipoClaseItem = {
    id: number,
    nombre: string,
    descripcion: string,
    activa: string
}

export type TipoClaseOutput = {
    id: number,
    nombre: string,
    descripcion: string,
    activa: string
}