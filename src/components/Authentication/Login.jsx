import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../services/apiClient";
import {
  accountLandingPath,
  saveAccountSession,
} from "../../services/authSession";
import {
  forgetRememberedLoginEmail,
  getRememberedLoginEmails,
  rememberLoginEmail,
} from "../../services/rememberedLoginEmails";

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [rememberedEmails, setRememberedEmails] = useState([]);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const requestedPath = location.state?.from;

  useEffect(() => {
      document.body.style.overflow = "hidden";
    setRememberedEmails(getRememberedLoginEmails());
    apiClient
      .me()
      .then(({ account }) => {
        navigate(accountLandingPath(account, requestedPath), { replace: true });
      })
      .catch(() => {});
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navigate, requestedPath]);

  const matchingRememberedEmails = rememberedEmails.filter((email) =>
    email.includes(username.trim().toLowerCase())
  );
  const shouldShowRememberedEmails = isEmailFocused && matchingRememberedEmails.length > 0;

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!username) {
      errors.username = t("auth.emailRequired");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(username)) {
      errors.username = t("auth.emailInvalid");
      isValid = false;
    }

    if (!password) {
      errors.password = t("auth.passwordRequired");
      isValid = false;
    } else if (password.length < 6) {
      errors.password = t("auth.passwordMin");
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const { account } = await apiClient.login(username, password, rememberMe);
        saveAccountSession(account, rememberMe);
        setRememberedEmails(rememberLoginEmail(account.email || username));
        navigate(accountLandingPath(account, requestedPath));
      } catch (error) {
        setErrors({ password: t("auth.invalidCredentials", "Invalid email or password.") });
      }
    }
  };

  return (
    <div
      className=" h-screen w-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://codingstella.com/wp-content/uploads/2024/01/download-6-scaled.jpeg')",
      }}
    >
      <div className="relative max-w-sm w-96 p-8 bg-white/10 backdrop-blur-lg border border-gray-400 rounded-xl shadow-lg text-white">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-gray-400 w-32 h-14 rounded-b-xl">
          <span className="text-lg text-black font-bold">{t("auth.loginTitle")}</span>
        </div>

        <div className="flex flex-col mt-16 space-y-4">
          {/* فیلد ایمیل */}
          <div className="relative">
            <input
              type="email"
              className="w-full h-12 bg-transparent text-white px-4 border border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-gray-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              required
              placeholder={t("auth.email")}
            />
            {shouldShowRememberedEmails && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-white/20 bg-gray-950/95 text-sm shadow-lg">
                {matchingRememberedEmails.map((email) => (
                  <div key={email} className="flex items-center justify-between gap-2 border-b border-white/10 last:border-b-0">
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setUsername(email);
                        setIsEmailFocused(false);
                      }}
                      className="min-w-0 flex-1 px-3 py-2 text-left text-white hover:bg-white/10"
                    >
                      <span className="block truncate">{email}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={t("auth.forgetRememberedEmail", { email })}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => setRememberedEmails(forgetRememberedLoginEmail(email))}
                      className="px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* فیلد رمز عبور */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-12 bg-transparent text-white px-4 border border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("auth.password")}
            />
            <button
              type="button"
              className="absolute right-4 top-3 text-gray-300 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* گزینه‌های اضافی */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <label htmlFor="remember">{t("auth.rememberMe")}</label>
            </div>
            <button
              type="button"
              className="hover:underline"
              onClick={() =>
                setStatusMessage(
                  t(
                    "auth.passwordResetComingSoon",
                    "Password reset is coming soon. Contact an admin for access."
                  )
                )
              }
            >
              {t("auth.forgotPassword")}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStatusMessage(t("auth.googleComingSoon", "Google sign-in will be connected soon."))}
            className="w-full h-12 border border-gray-300 text-white font-semibold rounded-full hover:bg-white/10 transition"
          >
            {t("auth.googleLogin", "Continue with Google")}
          </button>

          {statusMessage && (
            <p className="rounded-md bg-white/10 px-3 py-2 text-sm text-gray-100">
              {statusMessage}
            </p>
          )}

          {/* دکمه ورود */}
          <button
            onClick={handleLogin}
            className="w-full h-12 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-white transition"
          >
            {t("auth.loginButton")}
          </button>

          {/* لینک ثبت‌نام */}
          <div className="text-center text-sm">
            <span>
              {t("auth.noAccount")}{" "}

              <Link to="/signup" className="font-medium hover:underline">
                {t("auth.goToSignup")}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
