// validateMessage.ts (en la carpeta hooks o utils)
export function validateMessage(text: string): boolean {
  // Definir los patrones prohibidos
  const forbiddenPatterns = [
    // 1. Bloqueo de correos electrónicos
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,  

    // 2. Bloqueo de números de teléfono (internacionales y nacionales)
    /\+?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}/, // Diferentes formatos de números de teléfono

    // 3. Bloqueo de URLs (http, https, ftp y URLs sin protocolo)
    /\b(?:https?|ftp):\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\S*)\b/,  // Con http/https
    /\b(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\S*)\b/,  // Sin protocolo

    // 4. Bloqueo de nombres completos (estilo 'Nombre Apellido')
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/, // Nombre y apellido con la primera letra mayúscula

    // 5. Bloqueo de fechas de nacimiento (DD/MM/YYYY o MM/DD/YYYY)
    /\b(\d{2}[-\/]\d{2}[-\/]\d{4}|\d{4}[-\/]\d{2}[-\/]\d{2})\b/, // Detecta fechas en formato dd/mm/yyyy o yyyy/mm/dd

    // 6. Bloqueo de direcciones postales
    /\b\d{1,5}\s[A-Za-z0-9\s,.'-]+\b/, // Direcciones (Ej: 1234 Elm St., Springfield)

    // 7. Bloqueo de números de tarjeta de crédito (patrón simple para detectar tarjetas comunes)
    /\b(?:\d{4}[-\s]?)?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Bloquea patrones tipo: 1234 5678 9012 3456

    // 8. Bloqueo de nombres de redes sociales (Twitter, Facebook, Instagram)
    /\b(twitter\.com|facebook\.com|instagram\.com|linkedin\.com)\b/i, // Bloquea los dominios de las redes sociales más comunes

    // 9. Bloqueo de palabras clave sensibles (Ej: "contraseña", "pin", "código")
    /\b(password|pin|código|secure|admin|login|register|account|verify|confirm|security)\b/i,  // Palabras clave de seguridad

    // 10. Bloqueo de patrones de información financiera (como números de cuentas bancarias)
    /\b(\d{2}-\d{4}-\d{4}-\d{4}-\d{4})\b/, // Ejemplo de patrón de cuenta bancaria (se puede ajustar a más formatos)

    // 11. Bloqueo de dominios sospechosos de phishing o de prueba
    /\b(?:example\.com|test\.com|fake\.com|random\.com|spammer\.com)\b/i, // Bloquear dominios comunes de phishing o de prueba
  ];

  // Comprobar si el texto contiene algún patrón prohibido
  for (let pattern of forbiddenPatterns) {
    if (pattern.test(text)) {
      return false; // Si se encuentra algún patrón, el mensaje no es válido
    }
  }

  return true; // Si no se encuentran patrones, el mensaje es válido
}
