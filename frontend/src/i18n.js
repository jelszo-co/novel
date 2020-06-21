import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import hu from './hu.json';

const resources = {
  en: { ...en },
  hu: { ...hu },
};

i18n.use(initReactI18next).init({
  resources,
  initImmediate: false,
  lng: localStorage.getItem('lng') ?? 'en',
  languages: ['hu', 'en'],
  load: 'currentOnly',
  keySeparator: false,
  interpolation: { escapeValue: false },
});

export default i18n;
