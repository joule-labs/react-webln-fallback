import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';

const resources = {
  en: { translation: en },
};

i18next.use(LanguageDetector);

export const i18n = i18next;

export function i18nInit() {
  return i18n.init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false,
    },
  });
}
