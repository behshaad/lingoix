import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

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

  const navLinks = [
    { to: "/dictionary", label: t("Translator") },
    ...(isLearner
      ? [
          { to: "/dashboard", label: t("Dashboard") },
          { to: "/practice", label: t("nav.practice") },
        ]
      : []),
    { to: "/resources", label: t("Resources") },
    ...(isAdminRole
      ? [
          { to: "/admin", label: t("nav.admin") },
          { to: "/admin/research", label: t("nav.researchIndex", "Research Index") },
          { to: "/research/adaptive-learning", label: t("nav.research") },
          { to: "/research/guidance", label: t("nav.researchGuidance") },
        ]
      : []),
  ];

  return (
    <>
      <nav className="app-nav" aria-label={t("nav.main", "Main navigation")}>
        <div className="app-container app-nav__inner">
          <Logo />
          <div className="app-nav__links">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="app-nav__link">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="app-nav__actions">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <UserMenu />
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="app-icon-button lg:hidden"
              aria-label={t("nav.openMenu", "Open menu")}
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
        user={user}
        setUser={setUser}
        navLinks={navLinks}
      />
    </>
  );
};

export default Navbar;
