# Plan de medición

## Objetivo

Medir si las rutas SEO generan visitas reales y si esas visitas terminan usando herramientas.

## Qué se trackea

### Eventos estándar

- `tool_page_viewed`
- `tool_upload_started`
- `tool_conversion_completed`
- `tool_download_clicked`

## Parámetros mínimos por evento

Todos los eventos nuevos deben incluir:

- `tool_slug`
- `page_path`
- `locale`

Parámetros opcionales según el caso:

- `file_count`
- `output_format`

## Cobertura actual

### Page view

Se emite automáticamente desde el frame compartido de herramienta (`ActiveToolPageFrame`) para las páginas de herramienta que lo usan.

### Upload / conversión / descarga

Cobertura implementada en componentes interactivos principales de esta fase:

- `unlock-pdf`
- `pdf-to-word`
- `word-to-pdf`
- `pdf-to-excel`
- `excel-to-pdf`
- `pdf-to-powerpoint`
- `powerpoint-to-pdf`
- `pdf-to-jpg`
- `jpg-to-pdf`

## Qué mirar en GA

### Métricas base

- usuarios por ruta `/tools/...`
- eventos `tool_page_viewed` por `tool_slug`
- ratio `tool_upload_started / tool_page_viewed`
- ratio `tool_conversion_completed / tool_upload_started`
- ratio `tool_download_clicked / tool_conversion_completed`

### Señales útiles

Una herramienta tiene uso real si se observa:

- tráfico en la ruta
- uploads iniciados
- conversiones completadas
- descargas reales

Si una ruta tiene muchas vistas pero casi ningún upload:

- problema probable de UX, expectativa o copy

Si hay uploads pero pocas conversiones:

- problema probable de compatibilidad o fiabilidad

Si hay conversiones pero pocas descargas:

- revisar estado final, CTA o errores de salida

## Qué mirar en Search Console

- impresiones por query de intención alta
- CTR por ruta de herramienta y guía
- queries que disparan guías pero no herramientas
- páginas con impresiones y pocas interacciones posteriores en GA

## Cómo detectar si una herramienta realmente se usa

Checklist:

1. tiene impresiones/clics en Search Console
2. recibe `tool_page_viewed`
3. recibe `tool_upload_started`
4. recibe `tool_conversion_completed`
5. recibe `tool_download_clicked`

Si falla en 3, 4 o 5, la ruta puede estar indexando pero no resolviendo intención.

## Regla operativa para futuras herramientas

Toda herramienta nueva que pase a estado “real” debe añadir:

- page view
- upload started
- conversion completed
- download clicked

antes de considerarse cerrada.
