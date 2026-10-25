import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import sv from "./locales/sv.json";

const saved = localStorage.getItem("language");
const browserLang = navigator.language.startsWith("sv") ? "sv" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sv: { translation: sv },
  },
  lng: saved ?? browserLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  initImmediate: false,
});

export default i18n;
