import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ThemeToggle from "./ ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const MobileMenu = ({ isOpen, toggleMenu, user, setUser }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(menuRef.current, {
        x: "-100%",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toggleMenu();
  };

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900/80 backdrop-blur-md shadow-lg z-50 p-4 transform -translate-x-full"
    >
      <button onClick={toggleMenu} className="absolute top-4 right-4 text-2xl">
        ✖️
      </button>

      <nav className="mt-10 flex flex-col gap-4">
        <Link to="/" className="text-gray-700 dark:text-gray-200">
          صفحه اصلی
        </Link>
        <Link to="/about" className="text-gray-700 dark:text-gray-200">
          درباره ما
        </Link>
        <Link to="/contact" className="text-gray-700 dark:text-gray-200">
          تماس با ما
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-700 dark:text-gray-200">
              داشبورد
            </Link>
            <button onClick={handleLogout} className="text-red-500">
              خروج
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500">
              ورود
            </Link>
            <Link to="/register" className="text-green-500">
              ثبت نام
            </Link>
          </>
        )}
      </nav>
      <ThemeToggle />
      <LanguageSwitcher />
    </div>
  );
};

export default MobileMenu;
