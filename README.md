# Participación · TeToM

Formulario estático adaptable a celulares, con español, inglés, alemán e italiano. Usa el idioma compatible del navegador y recuerda una selección manual. Para otros idiomas utiliza inglés. Los logos originales proceden del repositorio `naar129/dienes2`.

## Publicación

En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**.

Dirección prevista una vez habilitado Pages: https://naar129.github.io/participation/

## Registro existente

El formulario envía un POST normal al enlace de Google Apps Script proporcionado. Campos: `nombre`, `email`, `pais` e `idioma` (oculto). La fecha debe generarse en el servidor. Las columnas de la hoja son, en este orden: **Fecha | Nombre | Email | País**.

La página redirige al servicio de registro para mostrar su respuesta real. No muestra una confirmación ficticia ni usa `fetch` con `no-cors`, que no permite verificar si la hoja se actualizó.

El frontend por sí solo no modifica el Apps Script existente. Si su función `doPost(e)` sólo guarda nombre y email, debe añadirse `e.parameter.pais` como cuarta columna. Antes de reemplazarla, hay que revisar su código y la hoja de destino.

Se incluye una alternativa completa en `google-apps-script/Code.gs`. No está instalada ni cambia el endpoint existente. Para usarla, configura las propiedades `SPREADSHEET_ID` y `SHEET_NAME` en Apps Script, utiliza una hoja nativa de Google Sheets con los encabezados indicados y publica una nueva versión del despliegue. Si creas otro despliegue, actualiza también el atributo `action` del formulario. Un archivo `.xlsx` en Drive debe convertirse a Google Sheets para esta alternativa.

## Verificación

Se comprobaron sintaxis JavaScript y, con un DOM simulado, detección de los cuatro idiomas, idioma alternativo, funcionamiento sin almacenamiento local, conservación de los campos al cambiar de idioma, validación y estado de envío. No se enviaron datos a la hoja real. La comprobación visual en navegador no pudo completarse en el entorno de ejecución. La comprobación final del guardado requiere revisar el Apps Script y realizar una inscripción de prueba.
