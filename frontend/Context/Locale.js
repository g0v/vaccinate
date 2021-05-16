import { createContext, useContext } from 'react';

// TODO: i18n structure
export const locales = {
  en: {
    locale: 'en',
    text: 'English',
  },
  zh: {
    locale: 'zh',
    text: '華文',
  },
  id: {
    locale: 'en',
    text: 'Bahasa Indonesia',
  },
  ja: {
    locale: 'ja',
    text: '日本語',
  },
  tl: {
    locale: 'ph',
    text: 'Tagalog',
  },
};

export const LocaleContext = createContext({
  locale: locales.zh.locale,
  changeLocale(locale) {
    this.locale = locale;
  },
});

export const useLocaleContext = () => useContext(LocaleContext);

export default LocaleContext;
