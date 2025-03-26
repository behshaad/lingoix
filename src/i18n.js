// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import en from "./locales/en.json";
// import de from "./locales/de.json";

// i18n.use(initReactI18next).init({
//   resources: {
//     en: { translation: en },
//     de: { translation: de },
//   },
//   lng: "de", // زبان پیش‌فرض آلمانی
//   fallbackLng: "en", // در صورت عدم پشتیبانی از زبان انتخابی، انگلیسی نمایش داده شود
//   interpolation: {
//     escapeValue: false,
//   },
// });

// export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";
import fa from "./locales/fa.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    fa: { translation: fa },
  },
  lng: "en", // زبان پیش‌فرض
  fallbackLng: ["de", "fa"], // اگر زبان تنظیم‌شده موجود نبود، به یکی از این‌ها برگردد
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;