export interface Token {
    token: string;
    refreshToken: string;
}

export interface Gimnasio {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    logoUrl: string;
    activo: "ACTIVO" | "INACTIVO";
}

export interface Rol {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Permiso {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface NivelAcceso {
    id: number;
    nombre: string;
    descripcion: string;
    permisos: Permiso[];
}

export interface RolAsignado {
    rol: Rol;
    nivelAcceso: NivelAcceso;
}

export interface Recepcionista {
    id: number;
    biografia: string;
    fechaContratacion: string;
}

export interface Entrenador {
    id: number;
    biografia: string;
    fechaContratacion: string;
}

export interface Socio {
    id: number;
    noSocio: string;
    fechaIngreso: string;
    fechaNacimiento: string;
    direccion: string;
    nss: string;
    tipoSangre: string;
}

export interface UsuarioOutputType {
    token: Token;
    id: number;
    email: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    urlFotoPerfil: string;
    genero: "HOMBRE" | "MUJER";
    gimnasioRegistro: Gimnasio;
    roles: RolAsignado[];
    gimnasiosPermitidos: Gimnasio[];
    recepcionista?: Recepcionista;
    entrenador?: Entrenador;
    socio?: Socio;
    estatus: "ACTIVO" | "INACTIVO";
}
