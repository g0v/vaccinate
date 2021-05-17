import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
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

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'zh',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
