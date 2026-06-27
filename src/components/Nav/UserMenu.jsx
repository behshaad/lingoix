import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../services/apiClient";
import {
  AUTH_SESSION_EVENT,
  accountHomePath,
  adminRoles,
  clearAccountSession,
  loadStoredUser,
  refreshAccountSession,
} from "../../services/authSession";

const UserMenu = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(loadStoredUser());
    apiClient
      .me()
      .then(({ account }) => setUser(refreshAccountSession(account)))
      .catch(() => {});
    const handleAuthChange = (event) => setUser(event.detail || loadStoredUser());
    window.addEventListener(AUTH_SESSION_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_SESSION_EVENT, handleAuthChange);
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = async () => {
    await apiClient.logout().catch(() => {});
    clearAccountSession();
    setUser(null);
    navigate("/");
  };

  const isLearner = user?.role === "learner";
  const isAdminRole = adminRoles.includes(user?.role);

  return (
    <div className="relative">
      {!user ? (
        <button
          onClick={() => navigate("/login")}
          className="rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950"
        >
          {t("login")}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleProfileClick}
          aria-label={t("accountMenu", "Account menu")}
          className="flex items-center gap-2"
        >
          <img
            src={user.profilePic || "https://i.pravatar.cc/150"}
            alt="Profile"
            className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
          />
        </button>
      )}

      {isDropdownOpen && user && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-white px-3 py-2">
            {user.name || "Guest"}
          </p>
          <hr className="border-gray-300 dark:border-gray-700" />
          <button
            onClick={() => navigate(accountHomePath(user))}
            className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            {isLearner ? t("Dashboard") : t("nav.admin")}
          </button>
          {isLearner && (
            <button
              onClick={() => navigate("/practice")}
              className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
            >
              {t("nav.practice")}
            </button>
          )}
          {isAdminRole && (
            <button
              onClick={() => navigate("/resources")}
              className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
            >
              {t("Resources")}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-400 rounded-md"
          >
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

// این کامپوننت وظیفه دارد که نام کاربر، عکس پروفایل و منوی کشویی برای خروج را مدیریت کند.
