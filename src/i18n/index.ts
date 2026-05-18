import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './ru.json';
import en from './en.json';

export type AppLanguage = 'ru' | 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
  lng: 'ru',
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
}).catch(() => {});

export default i18n;
