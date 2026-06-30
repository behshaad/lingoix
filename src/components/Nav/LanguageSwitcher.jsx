import { useState } from "react";
import { Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const languages = [
    { code: "de", label: "Deutsch" },
    { code: "en", label: "English" },
    { code: "fa", label: "فارسی" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="app-icon-button"
        aria-label={t("nav.changeLanguage", "Change language")}
        aria-expanded={isOpen}
      >
        <Globe2 size={19} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="app-popover" role="menu">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => changeLanguage(language.code)}
              className={`app-popover__item ${i18n.language === language.code ? "is-active" : ""}`}
              role="menuitem"
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
