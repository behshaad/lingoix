import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

const MobileMenu = ({ isOpen, toggleMenu, user, setUser }) => {
  const menuRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(menuRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toggleMenu();
  };

  const isRtl = i18n.language === "fa" || i18n.language === "ar";

  return (
    <div
      ref={menuRef}
      className="fixed top-0 right-0 w-72 h-full transform translate-x-full p-6 shadow-lg z-50 rounded-l-3xl
                 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md transition-colors duration-500"
    >
      <button
        onClick={toggleMenu}
        className="absolute top-4 left-4 text-3xl text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
      >
        ✖️
      </button>

      <div className="mt-12 flex  gap-6">
        <div className="flex flex-col justify-center items-center">
          <Logo />
        </div>
        <div className="flex flex-col justify-center items-center">
          <LanguageSwitcher />
        </div>{" "}
        <div className="flex items-center">
          ‍<UserMenu />
        </div>
        <div className="flex flex-col justify-center items-center">
          <ThemeToggle />
        </div>{" "}
      </div>

      <nav
        className={`mt-12 flex flex-col gap-6 font-semibold ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        {/* <Link
          to="/"
          className="text-gray-800 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-300"
        >
          <Logo />
        </Link> */}
        <Link
          to="/Dictionary"
          className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {t("Translator")}
        </Link>
        <Link
          to="/dashboard"
          className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {t("Dashboard")}
        </Link>
        <Link
          to="/resources"
          className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {t("Resources")}
        </Link>
        <Link
          to="/Lehre"
          className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {t("Academy")}
        </Link>

        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-800 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-300"
            >
              {t("Dashboard")}
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
            >
              {t("Logout")}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/SignUp"
              className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {t("createAccount")}
            </Link>
            <Link
              to="/login"
              className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {t("login")}
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
