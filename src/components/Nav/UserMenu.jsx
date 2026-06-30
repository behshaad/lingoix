import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AccountAvatar from "../Account/AccountAvatar";
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
          type="button"
          onClick={() => navigate("/login")}
          className="app-primary-button"
        >
          {t("login")}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleProfileClick}
          aria-label={user.name ? t("accountMenuFor", { name: user.name }) : t("accountMenu", "Account menu")}
          title={user.name ? t("accountMenuFor", { name: user.name }) : t("accountMenu", "Account menu")}
          className="app-icon-button"
        >
          <AccountAvatar
            src={user.profilePic}
            name={user.name || user.email}
            alt={t("accountProfile.avatarAlt", "Profile photo")}
            size="sm"
          />
        </button>
      )}
    </div>
  );
};

export default UserMenu;

// این کامپوننت وظیفه دارد که نام کاربر، عکس پروفایل و منوی کشویی برای خروج را مدیریت کند.
