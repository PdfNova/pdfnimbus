# Arquitectura actual

## Resumen

PDFNimbus es una aplicación Next.js App Router orientada a herramientas browser-first de PDF, imagen y conversiones de oficina.
La arquitectura prioriza:

- rutas indexables por intención de búsqueda
- herramientas con UI independiente por ruta
- lógica de procesamiento en cliente cuando es viable
- enlazado interno fuerte entre herramientas y guías
- metadata y sitemap gestionados dentro del propio árbol `app/`

## Estructura principal

### `app/`

Contiene las rutas públicas.

Subzonas relevantes:

- `app/page.tsx` → home
- `app/tools/` → hub de herramientas y una carpeta por herramienta
- `app/guides/` → hub de guías y una carpeta por guía
- `app/privacy-policy`, `app/security`, `app/about`, etc. → páginas de confianza y soporte
- `app/sitemap.ts` → sitemap dinámico
- `app/robots.ts` → robots dinámico

Cada herramienta indexable vive normalmente en:

- `app/tools/<slug>/page.tsx`

Cada guía indexable vive normalmente en:

- `app/guides/<slug>/page.tsx`

## Dónde viven las herramientas

### Rutas de herramienta

Las páginas de herramienta suelen:

- declarar `metadata`
- declarar JSON-LD (`SoftwareApplication`, `FAQPage`)
- envolver el contenido con `ActiveToolPageFrame`
- renderizar un componente real desde `components/tools/...`

Ejemplo de separación esperada:

- página pública: `app/tools/pdf-to-excel/page.tsx`
- UI real: `components/tools/pdf-to-excel/pdf-to-excel-tool.tsx`
- lógica browser-side: `lib/pdf/pdf-to-excel.ts`

## Dónde viven las guías

Las guías viven en `app/guides/`.

Patrón actual:

- `app/guides/_components/guide-page-template.tsx` define la estructura común
- cada guía declara:
  - `metadata`
  - `Article` JSON-LD
  - `HowTo` JSON-LD
  - CTA hacia la herramienta correspondiente
  - related tools
  - related guides

## Dónde vive la UI compartida

### `components/tools/shared/`

Aquí viven los marcos reutilizables de herramientas, especialmente:

- `active-tool-page-frame.tsx`

Su responsabilidad:

- H1/subtítulo
- secciones introductorias
- beneficios
- related tools
- related guides
- FAQ renderizada

### `components/company/`

UI compartida para páginas legales y corporativas.

## Dónde vive la lógica PDF/browser-first

### `lib/pdf/`

Contiene helpers de procesamiento browser-side.

Ejemplos actuales:

- merge/split/rotate/compress
- pdf → jpg
- jpg → pdf
- pdf → word
- word → pdf
- pdf → excel
- excel → pdf
- pdf → powerpoint
- powerpoint → pdf
- protect/unlock

Regla arquitectónica:

- la lógica de procesamiento debe estar fuera del componente de UI cuando tenga entidad propia
- los componentes de herramienta coordinan input, estados y descarga
- `lib/pdf/` encapsula la transformación o el parsing

## Metadata, sitemap y enlazado

### Metadata

La metadata de página se genera con helpers en `lib/seo.ts`.

Restricción:

- mantener títulos, descripciones y canonicals por ruta
- no meter lógica global de marketing en `app/layout.tsx`

### Sitemap

`app/sitemap.ts` contiene listas explícitas de rutas públicas relevantes.

Restricción:

- cada nueva herramienta pública y cada nueva guía pública debe añadirse aquí
- si una ruta existe pero no aparece en sitemap, el trabajo está incompleto

### Tool registry

`lib/tools-registry.ts` define las herramientas visibles en superficies comunes.

Restricción:

- si una herramienta debe aparecer en hubs/listados, su `active` debe reflejar su estado real
- no marcar como activa una herramienta puramente rota

### i18n

Las etiquetas de herramientas y copy compartido dependen de `lib/i18n/en.ts` y `lib/i18n/es.ts`.

Restricción:

- nuevas herramientas que aparezcan en superficies comunes necesitan claves EN/ES

## Qué optimiza esta arquitectura

- velocidad de iteración por clúster SEO
- despliegue de nuevas rutas sin refactor global
- separación clara entre:
  - superficie indexable
  - UI
  - procesamiento
- consistencia visual mediante marcos compartidos

## Restricciones que deben preservarse

No romper:

- App Router como origen principal de rutas
- patrón `app/tools/<slug>/page.tsx`
- patrón `app/guides/<slug>/page.tsx`
- uso de `ActiveToolPageFrame` y `GuidePageTemplate`
- foco browser-first
- claims honestos sobre limitaciones técnicas
- sitemap/registry/i18n al añadir nuevas rutas

## Señales de deuda técnica a vigilar

- páginas de herramienta que renderizan scaffold en lugar de componente funcional
- helpers de `lib/pdf/` que mezclan UI y lógica
- rutas presentes en `app/` pero ausentes en sitemap
- herramientas activas en registry sin UX funcional real
- dependencias que arrastran módulos Node a bundling cliente
