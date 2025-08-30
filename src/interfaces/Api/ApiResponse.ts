export interface ApiResponse<T> {
    estatus: "success" | "error";
    mensaje: string;
    fechaEjecucion: string;
    datos: T;
}

export interface ApiAxiosResponse<T> {
    status: number;
    data: ApiResponse<T>;
}
