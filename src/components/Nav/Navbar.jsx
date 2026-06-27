import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import { AUTH_SESSION_EVENT, adminRoles, loadStoredUser } from "../../services/authSession";

// import { FiSun, FiMoon } from "react-icons/fi";
// import { FaUserCircle } from "react-icons/fa";
// import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setUser(loadStoredUser());
    const handleAuthChange = (event) => setUser(event.detail || loadStoredUser());
    window.addEventListener(AUTH_SESSION_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_SESSION_EVENT, handleAuthChange);
  }, []);

  const isLearner = user?.role === "learner";
  const isAdminRole = adminRoles.includes(user?.role);

  return (
    <nav className="w-full py-5 bg-white/80 dark:bg-gray-900/80  fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Logo />
        <div className="hidden items-center gap-5 text-sm font-medium text-gray-900 dark:text-white lg:flex">
          <Link to="/dictionary" className="hover:text-gray-600 dark:hover:text-gray-300">
            {t("Translator")}
          </Link>
          {isLearner && (
            <>
              <Link to="/dashboard" className="hover:text-gray-600 dark:hover:text-gray-300">
                {t("Dashboard")}
              </Link>
              <Link to="/practice" className="hover:text-gray-600 dark:hover:text-gray-300">
                {t("nav.practice")}
              </Link>
            </>
          )}
          <Link to="/resources" className="hover:text-gray-600 dark:hover:text-gray-300">
            {t("Resources")}
          </Link>
          {isAdminRole && (
            <>
              <Link to="/admin" className="hover:text-gray-600 dark:hover:text-gray-300">
                {t("nav.admin")}
              </Link>
              <Link to="/admin/research" className="hover:text-gray-600 dark:hover:text-gray-300">
                {t("nav.researchIndex", "Research Index")}
              </Link>
              <Link to="/research/adaptive-learning" className="hover:text-gray-600 dark:hover:text-gray-300">
                {t("nav.research")}
              </Link>
              <Link to="/research/guidance" className="hover:text-gray-600 dark:hover:text-gray-300">
                {t("nav.researchGuidance")}
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* دکمه تغییر تم */}
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          {/* سوییچر زبان */}
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          {/* سوییچر زبان */}
          {/* نمایش دکمه‌های ورود/ثبت‌نام یا پروفایل کاربر */}
          <UserMenu />
          {/* دکمه همبرگری برای موبایل */}
          <button onClick={toggleMobileMenu} className="lg:hidden text-2xl">
            ☰
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
        user={user}
        setUser={setUser}
      />
    </nav>
  );
};

export default Navbar;
