import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import zh from './Locales/zh';
import en from './Locales/en';
import ja from './Locales/ja';
import tl from './Locales/tl';
import id from './Locales/id';

const resources = {
  zh,
  en,
  ja,
  tl,
  id,
};

const defaultLanguage = navigator.language.split('-')[0];

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
