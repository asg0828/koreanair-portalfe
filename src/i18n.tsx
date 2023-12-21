import bizMeta from '@/locales/ko/bizMeta.json';
import board from '@/locales/ko/board.json';
import home from '@/locales/ko/home.json';
import management from '@/locales/ko/management.json';
import translationko from '@/locales/ko/translation.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      lookupQuerystring: 'locale',
      lookupCookie: 'lang',
      lookupLocalStorage: 'lang',
    },
    resources: {
      ko: { translation: translationko, home: home, bizMeta: bizMeta, board: board, management: management },
    },
    fallbackLng: 'ko',
    debug: process.env.REACT_APP_I18N_DEBUG === 'true',
    react: {
      useSuspense: false,
    },
  });

export default i18n;
