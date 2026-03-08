# AGENTS.md

## Propósito

Este archivo define cómo debe trabajar un agente automático dentro de este repositorio.
No es documentación de producto. Es un manual de ejecución.

## Idioma y tono obligatorios

- Idioma por defecto: **español**.
- Tono: **técnico, sobrio, directo**.
- Evitar marketing, relleno, promesas vagas y lenguaje aspiracional.
- Cuando haya incertidumbre, escribirla como incertidumbre. No inventar capacidades.

## Lo que el agente puede crear de forma autónoma

Sin aprobación humana previa, el agente puede:

- crear nuevas páginas de guías SEO bajo `app/guides/`
- crear nuevas rutas de herramientas bajo `app/tools/` si siguen el patrón existente
- crear componentes de herramienta bajo `components/tools/`
- crear lógica browser-first bajo `lib/pdf/`
- actualizar `app/sitemap.ts`, `app/robots.ts`, `lib/tools-registry.ts`, `lib/i18n/*.ts`
- añadir JSON-LD, metadata y enlaces internos
- añadir documentación técnica bajo `docs/`
- hacer correcciones quirúrgicas de build, lint, routing y enlazado interno

## Lo que requiere aprobación humana previa

No ejecutar sin aprobación explícita:

- cambios en dominio público, branding principal o estrategia legal
- cambios en `app/layout.tsx` salvo corrección mínima claramente necesaria
- eliminación de rutas públicas existentes
- refactors amplios de arquitectura
- incorporación de analítica, tracking, píxeles o servicios de terceros no presentes
- claims legales/compliance (GDPR certificada, HIPAA, SOC2, ISO, etc.)
- features que impliquen cracking, bypass de seguridad, vigilancia o extracción de datos personales
- features que impliquen backend nuevo, almacenamiento remoto o procesamiento servidor si la funcionalidad actual es browser-first
- borrado masivo de código o renombrados estructurales amplios

## Temas explícitamente fuera de alcance

El agente no debe introducir:

- cracking de contraseñas
- bypass de cifrado sin credenciales válidas
- scraping de datos personales
- features de vigilancia, seguimiento o reconocimiento de identidad
- herramientas forenses ofensivas
- soporte a doxxing, stalking, fraude, suplantación o exfiltración de datos
- promesas de fidelidad perfecta para conversiones Office complejas que el navegador no soporte realmente

## Manejo de áreas sensibles

### Legal

Si una solicitud toca cumplimiento, límites de uso, privacidad, contraseñas o contenidos sensibles:

- preferir documentación clara y limitaciones visibles en UI
- no afirmar cobertura legal universal
- no afirmar que algo es legal en todas las jurisdicciones
- introducir disclaimers visibles cuando el flujo tenga riesgo legal o de permisos

### Forense / investigativo

Este producto **no** debe evolucionar hacia herramienta de investigación, vigilancia o análisis de terceros.
Si una petición se acerca a ese terreno:

- rechazar la implementación si implica daño o invasión
- documentar el límite en `docs/legal/project-limits.md`
- no ampliar capacidades de identificación, seguimiento o perfilado

### Datos personales

Si una funcionalidad puede procesar datos personales:

- mantener el enfoque browser-first
- minimizar superficie de exposición
- evitar almacenamiento remoto
- no añadir telemetría ni trazas con datos del usuario

## Archivos/zonas que no deben tocarse sin instrucción explícita

- `app/layout.tsx`
- estructura legal ya publicada, salvo correcciones de exactitud
- arquitectura base de routing fuera de cambios quirúrgicos
- rutas existentes de herramientas salvo fix concreto
- cualquier configuración de despliegue no requerida por un bug real

## Cuando el estado del repositorio y producción difieren

Regla operativa:

1. asumir que producción puede ir por detrás, tener caché o no haber desplegado
2. validar primero el código local
3. validar con `npm run lint` y `npm run build`
4. inspeccionar rutas generadas en build
5. reportar explícitamente: “validado en código/build, no confirmado en producción” si no hubo verificación real externa

No afirmar que producción está corregida si solo se validó localmente.

## Cómo reportar el trabajo

Cada pase debe reportar como mínimo:

1. archivos modificados
2. archivos creados
3. resumen exacto de cambios
4. impacto funcional/SEO/técnico
5. pendientes o límites conocidos

No ocultar limitaciones. No reportar como “hecho” lo que solo quedó scaffolded.

## Cómo evitar scope creep

Antes de cambiar algo, clasificar la tarea en una de estas categorías:

- bugfix
- cleanup
- cluster expansion
- UX consistency pass
- documentation pass

Luego aplicar estas reglas:

- si es bugfix: tocar solo la ruta, componente o helper afectado
- si es cleanup: no añadir features nuevas
- si es cluster expansion: replicar patrones existentes y cerrar sitemap/hub/linking/metadata
- si es UX pass: no rehacer arquitectura
- si es documentation pass: no tocar aplicación salvo necesidad estructural mínima

## Cómo evitar cambios rompientes silenciosos

Obligatorio antes de cerrar una tarea que toque código:

- `npm run lint`
- `npm run build`

Si la tarea afecta rutas:

- revisar que la ruta existe en `app/.../page.tsx`
- revisar que no haya conflicto con `pages/...`
- revisar sitemap si aplica
- revisar `lib/tools-registry.ts` si la herramienta debe aparecer en superficies comunes

## Preferencia por cambios quirúrgicos

El agente debe preferir:

- editar el componente concreto antes que mover arquitectura
- ampliar componentes compartidos solo si ya son el punto natural de extensión
- añadir helpers pequeños en `lib/pdf/` antes que refactors amplios
- reutilizar `ActiveToolPageFrame` y `GuidePageTemplate`

Evitar:

- reescrituras completas
- abstracciones prematuras
- cambios “por consistencia” que no resuelvan una necesidad real

## Criterio de “tool real” vs “tool scaffold”

Una herramienta solo debe considerarse real si incluye:

- input usable (upload/drop o controles reales)
- estado de proceso
- manejo de error
- salida descargable o resultado funcional
- limitaciones visibles en el cuerpo de la herramienta
- build/lint pasando

Si falta lo anterior, debe documentarse como superficie SEO o placeholder funcional, no como implementación completa.
