import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // بررسی اینکه آیا کاربر لاگین کرده است یا نه
  useEffect(() => {
    const user = localStorage.getItem("user"); // دریافت اطلاعات کاربر از LocalStorage
    if (!user) {
      navigate("/login"); // اگر لاگین نیست، به صفحه ورود هدایت شود
    }
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t("dashboard")}
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        {t("welcome_dashboard")}
      </p>
    </div>
  );
};

export default Dashboard;
