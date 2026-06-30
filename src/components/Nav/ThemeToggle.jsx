import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="app-icon-button"
      aria-label={darkMode ? t("nav.switchToLight", "Switch to light mode") : t("nav.switchToDark", "Switch to dark mode")}
      aria-pressed={darkMode}
    >
      {darkMode ? <Moon size={19} aria-hidden="true" /> : <Sun size={19} aria-hidden="true" />}
    </button>
  );
};

export default ThemeToggle;
