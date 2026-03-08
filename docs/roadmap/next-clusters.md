# Roadmap técnico: siguientes clusters

## Clusters completados

### Core PDF

Estado: completado y utilizable en gran parte.

Incluye:

- merge-pdf
- compress-pdf
- split-pdf
- rotate-pdf
- pdf-to-jpg
- jpg-to-pdf
- compress-image
- qr-generator

### Security PDF

Estado: parcial pero indexado.

Incluye:

- protect-pdf
- unlock-pdf

Nota:

- `unlock-pdf` tiene límites legales y técnicos claros; no debe ampliarse hacia cracking.

### Office Conversion Phase 1

Estado: implementado.

Incluye:

- pdf-to-word
- word-to-pdf
- guías asociadas

### Office Conversion Phase 2

Estado: implementado con límites claros.

Incluye:

- pdf-to-excel
- excel-to-pdf
- guías asociadas

### Office Conversion Phase 3

Estado: implementado con limitaciones técnicas explícitas.

Incluye:

- pdf-to-powerpoint
- powerpoint-to-pdf
- guías asociadas

## Clusters actuales inestables o problemáticos

### Office conversions complejas

Riesgo: medio-alto.

Problemas típicos:

- fidelidad de formato limitada
- dependencias de parsing Office en navegador
- diferencias entre “funciona” y “funciona bien”

Prioridad de estabilización:

1. verificar compatibilidad real de outputs en apps de escritorio
2. mejorar mensajes de error por tipo de archivo
3. añadir tests/manual fixtures de documentos simples

### Unlock / Protect PDF

Riesgo: legal/técnico.

Problemas típicos:

- expectativas irreales del usuario
- confusión entre password conocida vs cracking
- PDFs cifrados no soportados por la pila browser-first

Antes de ampliar:

- reforzar disclaimers
- validar casos reales permitidos

## Qué conviene arreglar antes de seguir expandiendo

1. verificar de forma práctica outputs Office ya implementados:
   - DOCX generado
   - PPTX generado
   - PDF desde PPTX simple
   - XLSX exportado desde PDF tabular
2. añadir pequeño set de fixtures de prueba manual
3. revisar qué herramientas activas siguen siendo parciales vs reales
4. evitar abrir nuevos clusters si uno actual aún tiene outputs incompatibles con apps reales

## Siguientes clusters recomendados (orden)

### 1. PDF forms / pages cleanup cluster

Posibles rutas:

- reorder-pdf-pages
- extract-pdf-pages
- organize-pdf

Por qué importa:

- alta intención SEO
- muy cercano al core PDF ya estable
- reutiliza previews, selección de páginas y pdf-lib

Dificultad técnica: media
Riesgo: bajo

### 2. Image ↔ document lightweight cluster

Posibles rutas:

- png-to-pdf
- pdf-to-png
- scan-images-to-pdf

Por qué importa:

- reaprovecha componentes existentes de imagen/PDF
- buena demanda long-tail
- bajo riesgo legal

Dificultad técnica: baja-media
Riesgo: bajo

### 3. Watermark / stamp cluster

Posibles rutas:

- add-watermark-to-pdf
- stamp-pdf

Por qué importa:

- demanda real de productividad documental
- extiende `pdf-lib` sin backend

Dificultad técnica: media
Riesgo: bajo-medio

### 4. Office stabilization pass (no cluster nuevo)

Esto no es expansión, es deuda.

Por qué importa:

- los clusters Office ya abiertos deben consolidarse
- mejora reputación real del producto
- evita indexar superficies que luego frustran al usuario

Dificultad técnica: media-alta
Riesgo: medio

### 5. OCR / scanned text cluster

No recomendado a corto plazo.

Por qué no:

- sube mucho la complejidad técnica
- exige más dependencias o backend
- aumenta riesgo de promesas imprecisas

Dificultad técnica: alta
Riesgo: alto

## Regla de prioridad

Antes de abrir un cluster nuevo, comprobar:

- ¿el cluster anterior ya entrega salida usable?
- ¿hay disclaimers suficientes?
- ¿la herramienta está activa en registry con razón real?
- ¿hay guías y sitemap cerrados?
- ¿build y lint están limpios?

Si no, conviene hacer un pass de calidad antes de seguir expandiendo.
