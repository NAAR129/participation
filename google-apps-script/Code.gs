/**
 * Registro TeToM: guarda Fecha | Nombre | Email | País.
 * Reemplazar PEGA_AQUI_EL_ID_DE_TU_HOJA por el ID del código actual.
 * Pegar en RegistroWeb y publicar una nueva versión del despliegue existente.
 */
function doPost(e) {
  const p = e && e.parameter ? e.parameter : {};
  const nombre = String(p.nombre || '').trim();
  const email = String(p.email || '').trim();
  const pais = String(p.pais || '').trim();
  let ok = false;
  const lock = LockService.getScriptLock();
  try {
    if (!nombre || nombre.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !pais || pais.length > 100) throw new Error('Invalid registration');
    lock.waitLock(10000);
    const ss = SpreadsheetApp.openById('PEGA_AQUI_EL_ID_DE_TU_HOJA');
    const sheet = ss.getSheetByName('registro');
    if (!sheet) throw new Error('Missing registration sheet');
    const literal = value => /^[=+@-]/.test(value) ? "'" + value : value;
    sheet.appendRow([new Date(), literal(nombre), literal(email), literal(pais)]);
    SpreadsheetApp.flush();
    ok = true;
  } catch (error) {
    console.error('Registration failed: ' + error.message);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }

  // La página actualizada recibe OK y muestra la tarjeta sin navegar a Google.
  if (p.response === 'ajax') {
    return ContentService.createTextOutput(ok ? 'OK' : 'ERROR')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  // Si el navegador usa el envío normal, Google muestra también la misma tarjeta.
  const copy = {
    es: ['Participación', 'Gracias por su participación', 'Hemos recibido su inscripción correctamente.', 'Le enviaremos información sobre el proyecto TeToM y acceso a los materiales que vayamos creando.', 'Volver a la página', 'No se pudo confirmar la inscripción', 'Consulte al equipo del proyecto antes de enviarla nuevamente.'],
    en: ['Participation', 'Thank you for your participation', 'We have successfully received your registration.', 'We will send you information about the TeToM project and access to the materials we develop.', 'Back to the page', 'Registration could not be confirmed', 'Please contact the project team before submitting again.'],
    de: ['Teilnahme', 'Vielen Dank für Ihre Teilnahme', 'Wir haben Ihre Anmeldung erfolgreich erhalten.', 'Wir senden Ihnen Informationen zum Projekt TeToM und Zugang zu den Materialien, die wir entwickeln.', 'Zurück zur Seite', 'Die Anmeldung konnte nicht bestätigt werden', 'Bitte wenden Sie sich an das Projektteam, bevor Sie die Anmeldung erneut senden.'],
    it: ['Partecipazione', 'Grazie per la tua partecipazione', 'Abbiamo ricevuto correttamente la tua iscrizione.', 'Ti invieremo informazioni sul progetto TeToM e l’accesso ai materiali che svilupperemo.', 'Torna alla pagina', 'Non è stato possibile confermare l’iscrizione', 'Contatta il team del progetto prima di inviarla di nuovo.']
  };
  const lang = Object.prototype.hasOwnProperty.call(copy, p.idioma) ? p.idioma : 'es';
  const t = copy[lang];
  const base = 'https://naar129.github.io/participation/';
  const html = `<!doctype html>
<html lang="${lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<base target="_top"><title>${t[0]} · TeToM</title>
<link rel="stylesheet" href="${base}styles.css?v=20261002-1045">
<style>.return-link{display:block;border-radius:15px;padding:15px 20px;background:linear-gradient(110deg,#2e7c30,#5ca341);color:white;font-weight:600;text-decoration:none;margin-top:24px}.language-tag{padding:10px 16px;border:1px solid #ccd5c9;border-radius:13px;color:#285e2d}</style>
</head><body><main class="card">
<header class="logos"><img src="${base}assets/eu.jpg" alt="Co-funded by the European Union"><img src="${base}assets/tetom.jpg" alt="TeToM"></header>
<div class="language-row"><span class="language-tag">${lang.toUpperCase()}</span></div>
<h1>${t[0]}</h1>
<section class="confirmation" aria-labelledby="thanks">
<div class="success-icon" aria-hidden="true">${ok ? '✓' : '!'}</div>
<h2 id="thanks">${ok ? t[1] : t[5]}</h2>
<p>${ok ? t[2] : t[6]}</p>
${ok ? '<p class="next-steps">' + t[3] + '</p>' : ''}
<a class="return-link" href="${base}" target="_top">${t[4]}</a>
</section>
<footer>Funded by the European Union (grant no. KA220-NW-25-36-358844). Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or Erasmus+ National Agency. Neither the European Union nor the granting authority can be held responsible for them.</footer>
</main></body></html>`;
  return HtmlService.createHtmlOutput(html).setTitle(t[0] + ' · TeToM');
}
