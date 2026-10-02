# Participación · TeToM

Formulario para móviles y escritorio, con español, inglés, alemán e italiano. Detecta el idioma compatible del navegador, utiliza inglés como alternativa y recuerda los cambios manuales. Logos originales de `naar129/dienes2`.

Página: https://naar129.github.io/participation/

## Registro y confirmación

El formulario envía `nombre`, `email`, `pais` e `idioma` al despliegue de Apps Script facilitado por el propietario. La versión actual usa `fetch`, añade `response=ajax` y permanece en la misma página. Sólo muestra el agradecimiento cuando recibe una respuesta HTTP correcta cuyo texto es exactamente `OK`. No utiliza `no-cors`, temporizadores de éxito ni reintentos automáticos. Si no puede confirmar la respuesta, avisa de que el registro podría haberse guardado.

Los archivos JavaScript y CSS incluyen una versión en la URL para evitar que el navegador use la versión anterior del formulario.

## Código de Google Apps Script

`google-apps-script/Code.gs` contiene el código completo listo para el proyecto RegistroWeb, con la pestaña `registro` indicada por el propietario. Antes de pegarlo, sustituir `PEGA_AQUI_EL_ID_DE_TU_HOJA` por el ID que ya contiene el código actual; el identificador de la hoja se conserva únicamente en Apps Script. Guarda **Fecha | Nombre | Email | País**. Para peticiones AJAX devuelve `OK` después del guardado; para un POST normal devuelve una tarjeta con logos, agradecimiento en el idioma del formulario y botón para regresar a la página. Google puede mantener su URL mientras muestra esta tarjeta; el botón utiliza `target="_top"` para volver a GitHub Pages.

Copiar el código en Apps Script y actualizar **Implementar → Gestionar implementaciones → lápiz → Nueva versión → Implementar**, conservando **Ejecutar como: Yo** y **Acceso: Cualquier persona**. El archivo del repositorio no actualiza automáticamente el despliegue de Google.

## Verificación

Se comprobaron la sintaxis, los estados del frontend mediante DOM simulado y 16 casos del servidor: cuatro idiomas, respuesta AJAX/HTML y guardado correcto/error. Las pruebas no escriben en la hoja real. La inscripción completa debe comprobarse después de actualizar la implementación en Google.
