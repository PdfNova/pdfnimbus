# Reglas de cambio

## Clasificación obligatoria de cualquier tarea

Antes de cambiar código, clasificar la tarea como:

- bugfix
- cleanup
- cluster expansion
- UX consistency pass
- documentation pass

La clasificación determina el alcance permitido.

## Cuándo cambiar código y cuándo solo documentación

### Cambiar código

Cambiar código cuando:

- hay bug real en producción o build
- una ruta existe pero no funciona
- una herramienta marcada como activa sigue siendo scaffold
- falta sitemap, registry, i18n o linking para una ruta pública ya añadida
- el comportamiento real no coincide con el copy visible

### Cambiar solo documentación

Actualizar docs cuando:

- la capacidad es incierta
- el límite legal/técnico debe aclararse
- la funcionalidad aún no está lista y no debe maquillarse como completa
- la decisión afecta a futuras sesiones más que al usuario final inmediato

## Cuándo una nueva feature requiere validación antes de enviar

Validación obligatoria si la feature:

- crea una nueva ruta pública
- toca `lib/pdf/`
- cambia un flujo de descarga
- afecta SEO estructural (metadata, sitemap, JSON-LD)
- cambia herramientas de contraseñas o seguridad
- toca conversiones Office

## Validación mínima obligatoria

Siempre:

- `npm run lint`
- `npm run build`

Además, si hay nueva ruta:

- comprobar que existe `app/<ruta>/page.tsx`
- comprobar que no hay conflicto con `pages/`
- revisar sitemap
- revisar hub/listado correspondiente

## Cómo manejar mismatch entre deploy y repositorio

Si el código local parece correcto pero producción no:

1. confirmar que el build local genera la ruta
2. comprobar si hay caché o despliegue atrasado
3. no afirmar que producción está arreglada sin evidencia externa
4. reportar el estado como:
   - validado en código/build
   - no verificado en producción

## Cómo probar manualmente rutas de herramienta

Checklist mínimo por herramienta tocada:

- carga de ruta
- input visible
- mensaje de limitación visible
- estado de proceso
- error reproducible y no-crash
- descarga real si aplica
- FAQ visible
- schema/metadatos intactos

Checklist adicional si hay subida de archivos:

- archivo soportado → procesa
- archivo no soportado → error claro
- archivo vacío o sin contenido útil → error claro
- no hay crash de cliente

## Cómo decidir el tipo de trabajo

### Cluster expansion

Es cluster expansion si se hace un paquete coherente de:

- nueva herramienta
- nuevas guías
- linking
- sitemap/hub
- metadata/schema

### Bugfix

Es bugfix si la capacidad ya existe pero falla.
Ejemplos:

- 404 en una ruta pública
- scaffold en producción donde debería haber UI real
- build roto
- JSON-LD inválido

### Cleanup pass

Es cleanup si se elimina deuda técnica sin añadir producto nuevo.
Ejemplos:

- dependencia sobrante
- fallback temporal en config
- imports muertos

### UX consistency pass

Es UX pass si se mejora claridad, estados o mensajes sin alterar arquitectura ni alcance funcional.

## Regla de cambios quirúrgicos

Preferir este orden:

1. corregir helper local
2. corregir componente concreto
3. corregir página concreta
4. ampliar componente compartido solo si varias rutas lo necesitan

Evitar:

- refactor amplio por preferencia estética
- mover carpetas sin necesidad
- reescribir páginas completas cuando un parche localizado resuelve el problema

## Regla de shipping

No cerrar una tarea de código como terminada si falta alguno de estos puntos:

- build verde
- lint verde
- output reportado con archivos modificados/creados
- límites técnicos visibles si la herramienta es parcial
