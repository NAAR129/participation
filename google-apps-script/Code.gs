// Alternativa para Google Apps Script. NO está desplegada automáticamente.
// Configurar SPREADSHEET_ID y SHEET_NAME en las propiedades del script.
function doPost(e) {
  var texts = {
    es: ['Inscripción recibida', 'Gracias. Hemos recibido tu inscripción.', 'No se pudo guardar la inscripción. Vuelve a la página e inténtalo nuevamente.', 'Volver'],
    en: ['Registration received', 'Thank you. We have received your registration.', 'Your registration could not be saved. Return to the page and try again.', 'Back'],
    de: ['Anmeldung erhalten', 'Vielen Dank. Wir haben Ihre Anmeldung erhalten.', 'Ihre Anmeldung konnte nicht gespeichert werden. Kehren Sie zur Seite zurück und versuchen Sie es erneut.', 'Zurück'],
    it: ['Iscrizione ricevuta', 'Grazie. Abbiamo ricevuto la tua iscrizione.', 'Non è stato possibile salvare l’iscrizione. Torna alla pagina e riprova.', 'Torna']
  };
  var p = e && e.parameter ? e.parameter : {};
  var lang = Object.prototype.hasOwnProperty.call(texts, p.idioma) ? p.idioma : 'en';
  var t = texts[lang];
  var ok = false;
  var lock = LockService.getScriptLock();
  try {
    var nombre = String(p.nombre || '').trim();
    var email = String(p.email || '').trim();
    var pais = String(p.pais || '').trim();
    if (!nombre || nombre.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !pais || pais.length > 100) throw new Error('Invalid fields');
    var config = PropertiesService.getScriptProperties();
    var sheetId = config.getProperty('SPREADSHEET_ID');
    var sheetName = config.getProperty('SHEET_NAME');
    if (!sheetId || !sheetName) throw new Error('Missing configuration');
    lock.waitLock(10000);
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (!sheet) throw new Error('Missing sheet');
    var headers = sheet.getRange(1, 1, 1, 4).getDisplayValues()[0];
    if (headers.join('|') !== 'Fecha|Nombre|Email|País') throw new Error('Unexpected headers');
    // Prevent user-entered values from being interpreted as spreadsheet formulas.
    function literal(value) { return /^[=+@-]/.test(value) ? "'" + value : value; }
    sheet.appendRow([new Date(), literal(nombre), literal(email), literal(pais)]);
    SpreadsheetApp.flush();
    ok = true;
  } catch (error) {
    console.error('Registration failed: ' + error.message);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
  return HtmlService.createHtmlOutput('<!doctype html><html lang="' + lang + '"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>TeToM</title></head><body style="font-family:system-ui;background:#eff6eb;color:#285e2d;padding:32px"><main style="max-width:520px;margin:40px auto;background:white;padding:32px;border-radius:24px"><h1>TeToM</h1><p>' + (ok ? t[1] : t[2]) + '</p><a href="https://naar129.github.io/participation/" target="_top">' + t[3] + '</a></main></body></html>');
}
