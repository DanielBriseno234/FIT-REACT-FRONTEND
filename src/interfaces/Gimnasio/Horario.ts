export interface HorariosInputType {
    diaSemana: number;
    horaApertura: string;
    horaCierre: string,
    horarioValido: boolean
}

export interface HorariosOutputType {
    id: number;
    diaSemana: number;
    horaApertura: string;
    horaCierre: string;
    fechaRegistro: string;
    fechaModificacion: string;
}