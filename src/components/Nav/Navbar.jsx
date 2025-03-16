import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";

import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

// import { FiSun, FiMoon } from "react-icons/fi";
// import { FaUserCircle } from "react-icons/fa";
// import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
    <nav className="w-full py-5 bg-white/80 dark:bg-gray-900/80  fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Logo />
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
          ‍<UserMenu />
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
