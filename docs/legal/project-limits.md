# Límites legales y operativos del proyecto

## Regla general

PDFNimbus es un producto utilitario browser-first para tratamiento de documentos propios o autorizados.
No debe ampliarse hacia usos de control, vigilancia, cracking o tratamiento invasivo de datos.

## Casos de uso permitidos

Permitidos:

- unir, dividir, comprimir o rotar documentos propios
- convertir formatos para uso personal, administrativo o profesional legítimo
- proteger un PDF con contraseña propia
- desbloquear un PDF cuando el usuario:
  - es titular del documento, o
  - tiene permiso explícito para quitar la protección
- exportar datos de un PDF tabular a CSV/XLSX para trabajo legítimo
- convertir documentos simples de oficina con limitaciones visibles

## Casos de uso no permitidos

No soportar ni promover:

- cracking de contraseñas desconocidas
- eliminación de protección sin credenciales válidas o sin permiso
- bypass de cifrado “porque sí”
- extracción masiva de datos personales de terceros
- herramientas de vigilancia o seguimiento documental
- clasificación de personas, perfilado o scraping de identidades
- OCR/parseo orientado a recolectar datos personales sensibles a gran escala
- automatizaciones orientadas a fraude documental

## Categorías de contenido fuera de alcance

No añadir features específicamente orientadas a:

- documentos médicos ajenos
- expedientes judiciales ajenos
- credenciales, identificaciones o tarjetas de terceros
- bases de datos personales exportadas desde PDF
- evidencias de investigación o inteligencia sobre personas sin marco legal claro

## Privacidad y flujos sensibles

Reglas:

- mantener browser-first cuando sea viable
- no añadir subida obligatoria a servidor para tareas simples
- no guardar archivos del usuario en servicios remotos salvo aprobación explícita y cambio de arquitectura documentado
- no introducir analítica no verificada en páginas que procesan archivos

## Herramientas de contraseña y seguridad

### Protect PDF

Permitido:

- añadir contraseña a documentos propios
- advertir que la contraseña debe compartirse por canal seguro aparte si procede

### Unlock PDF

Permitido solo con estas reglas:

- no prometer cracking
- no prometer desbloqueo sin contraseña conocida
- permitir quitar restricciones de owner-password solo si el flujo real lo soporta y el usuario está autorizado
- mostrar disclaimer visible en la herramienta, no solo en FAQ
- exigir consentimiento explícito cuando se elimina protección

Texto mínimo esperado en herramientas de desbloqueo:

- solo usar en PDFs propios o con permiso explícito
- la herramienta no crackea contraseñas desconocidas

## Lo que el producto no debe afirmar

No afirmar nunca sin prueba real:

- cumplimiento GDPR certificado
- HIPAA
- SOC 2
- ISO 27001
- cifrado extremo a extremo si no existe
- fidelidad perfecta en conversiones Office complejas
- desbloqueo universal de PDFs protegidos
- preservación total de fórmulas, charts o maquetación avanzada

## Ejemplos de features aceptables

Aceptables:

- “PDF to Excel” que exporta CSV/XLSX a partir de texto tabular extraído
- “Excel to PDF” limitado a hojas simples
- “PDF to PowerPoint” donde cada página se convierte en diapositiva imagen
- “PowerPoint to PDF” limitado a imágenes de diapositiva extraíbles

## Ejemplos de features no aceptables

No aceptables:

- “Unlock any PDF without password”
- “Recover hidden personal data from documents”
- “Find identity information across uploaded files”
- “Extract all emails, phones and IDs from PDFs in bulk”
- “Bypass owner restrictions regardless of permissions”

## Disclaimers obligatorios en herramientas de riesgo legal

Una herramienta sensible debe incluir disclaimer visible si aplica, por ejemplo:

- desbloqueo de PDF
- protección con contraseña
- conversiones con posible pérdida de formato o extracción parcial

Ejemplo operativo válido:

- “Solo usa esta herramienta sobre documentos propios o con permiso explícito.”
- “La herramienta no crackea contraseñas desconocidas.”
- “La conversión funciona mejor con documentos simples; puede requerir limpieza manual.”

## Regla para futuras sesiones

Si una feature nueva toca:

- seguridad
- contraseñas
- datos personales
- investigación
- monitorización

entonces debe revisarse contra este archivo antes de implementarse.
Si hay duda, documentar la restricción y no ampliar la capacidad.
