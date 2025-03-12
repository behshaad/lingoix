import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {darkMode ? (
        <FiSun size={22} color="#facc15" />
      ) : (
        <FiMoon size={22} color="#94a3b8" />
      )}
    </button>
  );
};

export default ThemeToggle;
