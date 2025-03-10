import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { FiSun, FiMoon } from "react-icons/fi"; // آیکون‌های مدرن

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // مدیریت وضعیت منو

  return (
    <nav className="w-full  py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* لوگو */}
        <Link
          to="/"
          className="text-3xl font-semibold text-gray-900 dark:text-white tracking-wide"
        >
          Lingoix
        </Link>

        <div className="flex items-center gap-4">
          {/* دکمه تغییر تم */}
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

          {/* سوییچر زبان */}
          <LanguageSwitcher />

          {/* لینک‌های ورود و ثبت‌نام */}
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {t("login")}
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-full text-sm font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition"
          >
            {t("register")}
          </Link>

          {/* دکمه همبرگر */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block lg:hidden p-2 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* منوی همبرگر برای موبایل */}
      <div
        className={`lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        } absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg p-4`}
      >
        <Link
          to="/login"
          className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-4"
        >
          {t("login")}
        </Link>
        <Link
          to="/register"
          className="block text-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-full text-sm font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition"
        >
          {t("register")}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
