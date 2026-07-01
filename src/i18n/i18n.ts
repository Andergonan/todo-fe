import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cs from './locales/cs.json';
import en from './locales/en.json';

export const DEFAULT_LANGUAGE = 'cs';
export const LANGUAGE_STORAGE_KEY = 'language';

export const LANGUAGES = {
  cs: 'CS',
  en: 'ENG'
} as const;

export type Language = keyof typeof LANGUAGES;

const isLanguage = (value: string | null): value is Language => {
  return value !== null && value in LANGUAGES;
};

const getInitialLanguage = (): Language => {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isLanguage(savedLanguage)) {
    return savedLanguage;
  }

  return DEFAULT_LANGUAGE;
};

void i18n.use(initReactI18next).init({
  resources: {
    cs: {
      translation: cs
    },
    en: {
      translation: en
    }
  },
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
