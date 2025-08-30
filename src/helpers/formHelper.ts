// Convierte un File a Base64
export const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });

// Obtiene un valor anidado de un objeto/array usando path tipo "a.b.0.c"
export function getError(
  errors: Record<string, any> | any[] | undefined,
  path: string | undefined
): any {
  if (!errors || !path) return undefined;

  const parts = path.split('.');
  let cur: any = errors;

  for (const p of parts) {
    if (cur === undefined || cur === null) return undefined;

    // si p es un índice numérico
    const idx: string | number = Number.isInteger(Number(p)) ? Number(p) : p;
    cur = cur[idx];
  }

  return cur;
}
