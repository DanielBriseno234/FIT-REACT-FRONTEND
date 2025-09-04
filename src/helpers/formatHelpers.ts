// Función para formatear el día de la semana
export const formatearDia = (numeroDia: number): string | number => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[numeroDia - 1] || `Día ${numeroDia}`;
};

// Función para formatear la hora (HH:MM:SS a HH:MM AM/PM)
export const formatearHora = (timeString: string): string => {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);

    if (hourNum >= 12) {
        return `${hourNum === 12 ? 12 : hourNum - 12}:${minutes} PM`;
    }
    return `${hourNum === 0 ? 12 : hourNum}:${minutes} AM`;
};

// Función para obtener la abreviatura del día
export const formatearAbreviacionDia = (numeroDia: number): string | number => {
    const abbreviations = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return abbreviations[numeroDia - 1] || numeroDia;
};

// Función para formatear la fecha
export const formatearFecha = (
    dateString: string
): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };

    return new Date(dateString).toLocaleDateString("es-ES", options);
};

// Funcion para formatear el precio
export const formatearPrecio = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(price);
};