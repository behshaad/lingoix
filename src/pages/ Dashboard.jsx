import React from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoursesInProgress from "../components/CoursesInProgress";
import CompletedCourses from "../components/CompletedCourses";
import Medals from "../components/Medals";
import LearningStatistics from "../components/LearningStatistics";

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
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CoursesInProgress />
          <CompletedCourses />
          <Medals />
          <LearningStatistics />
        </div>
      </div>
      ;
    </div>
  );
};

export default Dashboard;

