'use strict';

const translations = {
  es: {
    language: 'Idioma', title: 'Participación',
    intro: 'Inscríbete para recibir información sobre el proyecto TeToM y acceso a los materiales que vayamos creando.',
    name: 'Nombre', email: 'Correo electrónico', country: 'País', submit: 'Inscribirme',
    purpose: 'Al inscribirte, aceptas que utilicemos tu nombre, correo electrónico y país para enviarte información y materiales del proyecto TeToM.',
    sending: 'Enviando…', status: 'Estamos enviando tus datos. El servicio de registro mostrará la respuesta.',
    required: 'Completa este campo.',
    footer: 'Financiado por la Unión Europea (subvención n.º KA220-NW-25-36-358844). Las opiniones y puntos de vista expresados son únicamente los de los autores y no reflejan necesariamente los de la Unión Europea ni los de la Agencia Nacional Erasmus+. Ni la Unión Europea ni la autoridad concedente pueden ser consideradas responsables de ellos.'
  },
  en: {
    language: 'Language', title: 'Participation',
    intro: 'Register to receive information about the TeToM project and access to the materials we develop.',
    name: 'Name', email: 'Email address', country: 'Country', submit: 'Register',
    purpose: 'By registering, you agree that we may use your name, email address and country to send you information and materials from the TeToM project.',
    sending: 'Sending…', status: 'We are sending your details. The registration service will display the response.',
    required: 'Please fill in this field.',
    footer: 'Funded by the European Union (grant no. KA220-NW-25-36-358844). Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or Erasmus+ National Agency. Neither the European Union nor the granting authority can be held responsible for them.'
  },
  de: {
    language: 'Sprache', title: 'Teilnahme',
    intro: 'Melden Sie sich an, um Informationen zum Projekt TeToM und Zugang zu den Materialien zu erhalten, die wir entwickeln.',
    name: 'Name', email: 'E-Mail-Adresse', country: 'Land', submit: 'Anmelden',
    purpose: 'Mit Ihrer Anmeldung stimmen Sie zu, dass wir Ihren Namen, Ihre E-Mail-Adresse und Ihr Land verwenden, um Ihnen Informationen und Materialien zum Projekt TeToM zu senden.',
    sending: 'Wird gesendet…', status: 'Ihre Daten werden gesendet. Der Anmeldedienst zeigt anschließend die Rückmeldung an.',
    required: 'Bitte füllen Sie dieses Feld aus.',
    footer: 'Finanziert von der Europäischen Union (Fördernummer KA220-NW-25-36-358844). Die geäußerten Ansichten und Meinungen sind ausschließlich die der Autorinnen und Autoren und spiegeln nicht notwendigerweise die Ansichten der Europäischen Union oder der Nationalen Agentur für Erasmus+ wider. Weder die Europäische Union noch die Bewilligungsbehörde können dafür verantwortlich gemacht werden.'
  },
  it: {
    language: 'Lingua', title: 'Partecipazione',
    intro: 'Iscriviti per ricevere informazioni sul progetto TeToM e accedere ai materiali che svilupperemo.',
    name: 'Nome', email: 'Indirizzo e-mail', country: 'Paese', submit: 'Iscrivimi',
    purpose: 'Iscrivendoti, acconsenti all’utilizzo del tuo nome, indirizzo e-mail e paese per ricevere informazioni e materiali del progetto TeToM.',
    sending: 'Invio in corso…', status: 'Stiamo inviando i tuoi dati. Il servizio di iscrizione mostrerà la risposta.',
    required: 'Compila questo campo.',
    footer: 'Finanziato dall’Unione europea (sovvenzione n. KA220-NW-25-36-358844). Le opinioni espresse appartengono esclusivamente agli autori e non riflettono necessariamente quelle dell’Unione europea o dell’Agenzia nazionale Erasmus+. Né l’Unione europea né l’autorità concedente possono essere ritenute responsabili.'
  }
};

const selector = document.getElementById('language');
const form = document.getElementById('registration');
const button = form.querySelector('button');
const status = document.getElementById('status');
let submitting = false;
let language;

function detectLanguage() {
  let saved;
  try { saved = localStorage.getItem('tetom-participation-language'); } catch (_) {}
  if (Object.hasOwn(translations, saved)) return saved;
  for (const locale of navigator.languages || [navigator.language]) {
    const candidate = String(locale).toLowerCase().split(/[-_]/)[0];
    if (Object.hasOwn(translations, candidate)) return candidate;
  }
  return 'en';
}

function setLanguage(value) {
  language = Object.hasOwn(translations, value) ? value : 'en';
  const copy = translations[language];
  document.documentElement.lang = language;
  document.title = `${copy.title} · TeToM`;
  document.querySelector('meta[name="description"]').content = copy.intro;
  document.querySelectorAll('[data-key]').forEach(element => {
    element.textContent = copy[element.dataset.key];
  });
  selector.value = language;
  document.getElementById('submission-language').value = language;
  form.querySelectorAll('input:not([type=hidden])').forEach(input => input.setCustomValidity(''));
  if (submitting) {
    button.textContent = copy.sending;
    status.textContent = copy.status;
  }
}

selector.addEventListener('change', () => {
  setLanguage(selector.value);
  try { localStorage.setItem('tetom-participation-language', language); } catch (_) {}
});

form.querySelectorAll('input:not([type=hidden])').forEach(input => {
  input.addEventListener('input', () => input.setCustomValidity(''));
});

form.addEventListener('submit', event => {
  if (submitting) { event.preventDefault(); return; }
  for (const input of form.querySelectorAll('input:not([type=hidden])')) {
    input.value = input.value.trim();
    input.setCustomValidity(input.value ? '' : translations[language].required);
  }
  if (!form.reportValidity()) { event.preventDefault(); return; }
  submitting = true;
  button.disabled = true;
  button.textContent = translations[language].sending;
  status.hidden = false;
  status.textContent = translations[language].status;
  // Native POST preserves compatibility with the existing Apps Script.
  // Do not infer a successful database write from an opaque fetch response.
});

window.addEventListener('pageshow', () => {
  submitting = false;
  button.disabled = false;
  status.hidden = true;
  setLanguage(language || detectLanguage());
});
setLanguage(detectLanguage());
