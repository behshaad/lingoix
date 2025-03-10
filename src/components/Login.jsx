import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (email) {
      // ذخیره اطلاعات کامل کاربر در localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email,
          name: email.split("@")[0], // استخراج نام از ایمیل
          profilePic: `https://i.pravatar.cc/150?u=${email}`, // عکس تصادفی
        })
      );
      navigate("/dashboard"); // هدایت به داشبورد
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">{t("login")}</h2>
      <input
        type="email"
        placeholder={t("enter_email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
      />
      <button
        onClick={handleLogin}
        className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition"
      >
        {t("login")}
      </button>
    </div>
  );
};

export default Login;