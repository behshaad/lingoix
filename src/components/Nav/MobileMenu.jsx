import { Link } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import AccountAvatar from "../Account/AccountAvatar";
import { apiClient } from "../../services/apiClient";
import { clearAccountSession, saveLearnerEntryIntent } from "../../services/authSession";

const MobileMenu = ({ isOpen, toggleMenu, user, setUser, navLinks = [] }) => {
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await apiClient.logout().catch(() => {});
    clearAccountSession();
    setUser(null);
    toggleMenu();
  };

  const isRtl = i18n.language === "fa" || i18n.language === "ar";
  const closeMenu = () => toggleMenu();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="app-mobile-overlay lg:hidden"
        onClick={toggleMenu}
        aria-hidden="true"
      />
      <aside className="app-mobile-drawer lg:hidden" aria-label={t("nav.mobileMenu", "Mobile menu")}>
        <div className="app-mobile-drawer__top">
          <Logo />
          <button type="button" onClick={toggleMenu} className="app-icon-button" aria-label={t("nav.closeMenu", "Close menu")}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="app-mobile-drawer__controls">
          <LanguageSwitcher />
          <UserMenu />
          <ThemeToggle />
        </div>

        <nav className="app-menu" dir={isRtl ? "rtl" : "ltr"}>
          {user && (
            <Link to="/account/profile" onClick={closeMenu} className="app-menu__account">
              <AccountAvatar
                src={user.profilePic}
                name={user.name || user.email}
                alt={t("accountProfile.avatarAlt", "Profile photo")}
                size="sm"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{user.name || user.email}</span>
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">
                  {t("accountProfile.title", "Your profile")}
                </span>
              </span>
            </Link>
          )}

          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={closeMenu} className="app-menu__link">
              {link.label}
            </Link>
          ))}

          {!user ? (
            <Link
              to="/signup"
              onClick={() => {
                saveLearnerEntryIntent("/dashboard");
                closeMenu();
              }}
              className="app-menu__link"
            >
              {t("createAccount")}
            </Link>
          ) : (
            <button type="button" onClick={handleLogout} className="app-menu__link text-red-600 dark:text-red-300">
              <LogOut size={18} aria-hidden="true" />
              <span>{t("logout")}</span>
            </button>
          )}

          {!user && (
            <Link to="/login" onClick={closeMenu} className="app-primary-button mt-2">
              {t("login")}
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};

export default MobileMenu;
