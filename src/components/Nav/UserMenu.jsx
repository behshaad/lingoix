import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserCircle } from "lucide-react";
import { apiClient } from "../../services/apiClient";
import {
  AUTH_SESSION_EVENT,
  loadStoredUser,
  refreshAccountSession,
} from "../../services/authSession";

const UserMenu = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
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
      navigate("/account/profile");
    }
  };

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
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={t("accountProfile.avatarAlt", "Profile photo")}
              className="h-9 w-9 rounded-full border border-gray-300 object-cover shadow-sm"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-200">
              <UserCircle className="h-6 w-6" />
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default UserMenu;

// این کامپوننت وظیفه دارد که نام کاربر، عکس پروفایل و منوی کشویی برای خروج را مدیریت کند.
