import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { FiSun, FiMoon } from "react-icons/fi";
// import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // چک کردن وضعیت کاربر هنگام بارگذاری کامپوننت
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // خروج از حساب کاربری
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="w-full py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
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

          {/* نمایش دکمه‌های ورود/ثبت‌نام یا پروفایل کاربر */}
          {!user ? (
            <>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-full text-sm font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition"
              >
                {t("register")}
              </Link>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {t("login")}
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.profilePic || "https://i.pravatar.cc/150"}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
                />
              </button>

              {/* منوی کشویی حساب کاربری */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-white px-3 py-2">
                    {user.name}
                  </p>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                  >
                    {t("dashboard")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-400 rounded-md"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* دکمه همبرگری برای موبایل */}
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

      {/* منوی همبرگری برای موبایل */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg p-4">
          {!user ? (
            <>
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
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-700 dark:text-white px-3 py-2">
                {user.name}
              </p>
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
              >
                {t("dashboard")}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-400 rounded-md"
              >
                {t("logout")}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
