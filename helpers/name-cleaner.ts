export function sanitizeFileName(fileName: string): string {
  return decodeURIComponent(fileName)
    .replace(/%20/g, " ") // Reemplaza %20 por espacios
    .replace(/%28/g, "(") // Reemplaza %28 por paréntesis (
    .replace(/%29/g, ")") // Reemplaza %29 por paréntesis )
    .replace(/%5B/g, "[") // Reemplaza %5B por corchetes [
    .replace(/%5D/g, "]") // Reemplaza %5D por corchetes ]
    .replace(/%2C/g, ",") // Reemplaza %2C por coma
    .replace(/%2F/g, "/"); // Reemplaza %2F por slash /
}
