import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const SignUp = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!email) {
      errors.email = t("auth.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t("auth.emailInvalid");
      isValid = false;
    }

    if (!password) {
      errors.password = t("auth.passwordRequired");
      isValid = false;
    } else if (password.length < 6) {
      errors.password = t("auth.passwordMin");
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = t("auth.passwordMismatch");
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          name: email.split("@")[0],
          profilePic: `https://i.pravatar.cc/150?u=${email}`,
        })
      );
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://codingstella.com/wp-content/uploads/2024/01/download-6-scaled.jpeg')",
      }}
    >
      <div className="relative max-w-sm w-96 p-8 bg-white/10 backdrop-blur-lg border border-gray-400 rounded-xl shadow-lg text-white">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-gray-400 w-32 h-14 rounded-b-xl">
          <span className="text-lg text-black font-bold">{t("auth.signupTitle")}</span>
        </div>

        <div className="flex flex-col mt-16 space-y-4">
          <div className="relative">
            <input
              type="email"
              className="w-full h-12 bg-transparent text-white px-4 border border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("auth.email")}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-12 bg-transparent text-white px-4 border border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-gray-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t("auth.confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            onClick={handleSignUp}
            className="w-full h-12 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-white transition"
          >
            {t("auth.signupButton")}
          </button>

          <div className="text-center text-sm">
            <span>
              {t("auth.hasAccount")}{" "}
              {/* <a href="#" className="font-medium hover:underline">
                {t("auth.goToLogin")}
              </a> */}
              <Link to="/login" className="font-medium hover:underline">
                وارد شوید
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
