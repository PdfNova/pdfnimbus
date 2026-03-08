# Visión de producto

## Qué es el producto

PDFNimbus es una plataforma browser-first de microherramientas para:

- manipulación de PDF
- conversiones ligeras entre formatos de documento
- flujos utilitarios concretos de imagen y QR

El producto está diseñado para resolver tareas directas y frecuentes con fricción mínima.

## Qué no es

No es:

- una suite ofimática completa
- un editor profesional de maquetación
- un motor de OCR de alta precisión garantizada
- un sistema de backend documental
- un producto de cumplimiento legal/certificación
- una herramienta forense o de vigilancia
- un clon que prometa fidelidad perfecta de cualquier conversión Office compleja

## Usuario objetivo

Usuario objetivo principal:

- persona que necesita resolver una tarea puntual de documento en minutos
- perfiles administrativos, operativos o individuales que valoran rapidez
- usuarios SEO de alta intención que buscan “merge pdf”, “compress pdf”, “pdf to word”, etc.

No está optimizado, por defecto, para:

- cargas empresariales complejas
- preservación perfecta de formatos avanzados Office
- workflows de auditoría legal avanzada

## Filosofía de producto

Reglas del producto:

1. una ruta = una intención clara
2. la UI debe explicar con honestidad qué sale y qué no sale
3. mejor una conversión limitada pero real que una promesa amplia falsa
4. la herramienta debe ser usable antes de escalar contenido SEO alrededor
5. las limitaciones deben verse en el cuerpo de la herramienta, no solo en FAQ

## Posicionamiento browser-first

Browser-first significa:

- priorizar procesamiento local cuando sea viable
- evitar dependencia de backend para tareas simples
- minimizar exposición innecesaria de archivos
- aceptar límites técnicos reales del navegador y documentarlos

Browser-first no significa:

- prometer soporte universal para cualquier formato complejo
- afirmar fidelidad total si no se puede sostener

## Posicionamiento privacy-first

Privacy-first aquí significa:

- minimizar superficie de datos
- evitar storage remoto innecesario
- no introducir tracking no verificado
- usar lenguaje de privacidad exacto, no publicitario

No significa:

- prometer seguridad absoluta
- vender cumplimiento regulatorio no demostrado

## Equilibrio SEO / producto

Regla central:

- el SEO debe empujar al producto
- no debe enterrar la herramienta
- no debe convertir una herramienta en un blog largo

Una página buena de herramienta debe:

- dejar el input visible pronto
- explicar qué hace
- enlazar a guías y herramientas cercanas
- incluir FAQ útil y schema correcto

Una guía buena debe:

- captar intención long-tail real
- llevar a la herramienta correcta
- explicar el flujo sin relleno

## Umbral de calidad para considerar una herramienta “real”

Una herramienta se considera real solo si cumple todos estos puntos:

- input usable
- flujo de proceso observable
- error claro
- salida descargable o resultado funcional
- mensaje visible de limitaciones
- metadata y schema correctos
- enlaces internos mínimos cerrados
- `npm run lint` y `npm run build` pasan

Si no cumple, se considera:

- superficie SEO
- scaffold funcional
- ruta preparatoria

pero no una herramienta completa.

## Barandillas para nuevas herramientas

Antes de añadir una nueva herramienta:

- comprobar si el navegador puede soportar el flujo real
- definir alcance estrecho y honesto
- decidir si la salida será:
  - exacta
  - aproximada
  - parcial
- escribir primero las limitaciones reales
- solo después redactar metadata, FAQ y guías
