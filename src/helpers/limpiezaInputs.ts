

export const limpiarInput = (value: string) => {
    return value.trim().replace(/['"`]/g, '');
}