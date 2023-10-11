import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import translationko from '@/locales/ko/translation.json';
import translationen from '@/locales/en/translation.json';
// Add this line to your app entrypoint. Usually it is src/index.js
// import './i18n';

// https://react.i18next.com/latest/i18next-instance
// https://react.i18next.com/latest/using-with-hooks#using-the-withtranslation-hoc
i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  // .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    detection: {
      lookupQuerystring: 'locale',
      lookupCookie: 'lang',
      lookupLocalStorage: 'lang',
    },
    resources: {
      ko: { translation: translationko },
      en: { translation: translationen },
    },
    fallbackLng: 'ko',
    debug: process.env.REACT_APP_I18N_DEBUG === 'true',
    react: {
      useSuspense: false,
    },
  });

export default i18n;
