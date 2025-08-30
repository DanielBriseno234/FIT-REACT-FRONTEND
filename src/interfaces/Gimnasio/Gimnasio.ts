import type { Pageable, Sort } from "../Paginacion/Paginacion";
import type { HorariosInputType, HorariosOutputType } from "./Horario";
import type { PoliticaInputType, PoliticaOutputType } from "./Politica";
import type { TerminoInputType, TerminoOutputType } from "./Termino";
import type { ZonaInputType, ZonaOutputType } from "./Zona";

export interface GimnasioInputType {
    nombre: string;
    direccion: string;
    telefono: string;
    logoUrl: string;
    email: string;
    sitioWeb: string;
    horarios: HorariosInputType[];
    zonas: ZonaInputType[];
    terminos: TerminoInputType;
    politica: PoliticaInputType;
}

export interface GimnasioOutputType {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    logoUrl: string;
    email: string;
    sitioWeb: string;
    activo: string;
    fechaRegistro: string;
    fechaModificacion: string;
    horarios: HorariosOutputType[];
    zonas: ZonaOutputType[];
    terminos: TerminoOutputType;
    politica: PoliticaOutputType;
}

export type GimnasioOutputPaginated = {
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    content: GimnasioItem[];
    sort: Sort[];
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: Pageable;
    empty: boolean;
}

export interface GimnasioItem {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    logoUrl: string;
    activo: string;
}