import type { GimnasioItem } from "../Gimnasio/Gimnasio";
import type { Pageable, Sort } from "../Paginacion/Paginacion";

// TIPOS DE ENTRADA
export type UsuarioInputType = {
    email: string;
    contrasena: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    urlFotoPerfil: string;
    genero: string;
    idGimnasioRegistro: number;
    gimnasiosPermitidosIds: number[];
    rolesIds: RolesUsuarioInputType[];
    recepcionista: EntrenadorRecepcionistaInputType;
    entrenador: EntrenadorRecepcionistaInputType;
}

export type UsuarioInputUpdateType = Omit<
    UsuarioInputType,
    "contrasena" | "urlFotoPerfil"
>;

export type EntrenadorRecepcionistaInputType = {
    biografia: string;
    fechaContratacion: Date;
}

export type RolesUsuarioInputType = {
    rolId: number;
    nivelAccesoId: number;
}


// TIPOS DE SALIDA
export type UsuarioOutputPaginated = {
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    content: UsuarioItem[];
    sort: Sort[];
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: Pageable;
    empty: boolean;
}

export type UsuarioItem = {
    correoElectronico: any;
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    urlFotoPerfil: string;
    genero: string;
    roles: RolOutputType[];
    estatus: string;
    fechaModificacion: string;
}

export type UsuarioOutputType = {
    id: number;
    email: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    urlFotoPerfil: string;
    genero: string;
    gimnasioRegistro: GimnasioItem;
    roles: RolOutputType[];
    gimnasiosPermitidos: GimnasioItem[];
    recepcionista: EntrenadorRecepcionistaOutputType;
    entrenador: EntrenadorRecepcionistaOutputType;
    estatus: string;
}

export type EntrenadorRecepcionistaOutputType = {
    id: number;
    biografia: string;
    fechaContratacion: Date;
}

export type RolOutputType = {
    idRol: number;
    nombreRol: string;
    idNivelAcceso: number;
    nombreNivelAcceso: string;
}

export type UsuarioNotificationType = {
    notificarUsuario: boolean
}

export type UsuarioCambiarContrasena = {
    nuevaContrasena: string;
    confirmacionContrasena: string
}

export type UsuarioListType = {
    id: number;
    nombre: string
}