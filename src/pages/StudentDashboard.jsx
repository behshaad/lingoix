import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import CoursesInProgress from "../components/Students/CoursesInProgress";
import CompletedCourses from "../components/Students/CompletedCourses";
import Medals from "../components/Students/Medals";
import LearningStatistics from "../components/Students/LearningStatistics";
import StudyReminder from "../components/Students/StudyReminder";
import FlashCard from "../components/Students/FlashCard";
import LanguagePerformanceProfile from "../components/Dashboard/LanguagePerformanceProfile";
import { apiClient } from "../services/apiClient";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [learner, setLearner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const decisions = learner?.dashboardSummary?.activeAdaptiveDecisions || learner?.adaptiveDecisions || [];
  const domainLabel = (value) => t(`domain.${value}`, value);

  useEffect(() => {
    let isMounted = true;
    const loadLearner = async () => {
      try {
        const me = await apiClient.me();
        if (!me.account?.learnerId) {
          navigate("/profile-setup");
          return;
        }
        const data = await apiClient.learner(me.account.learnerId);
        if (isMounted) setLearner(data.learner);
      } catch (error) {
        if (isMounted) setLoadError(t("learnerDashboard.loadFailed", "Could not load your dashboard."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadLearner();
    return () => {
      isMounted = false;
    };
  }, [navigate, t]);

  if (isLoading) {
    return <div className="mx-auto max-w-6xl p-6 text-gray-900 dark:text-white">{t("practice.loading")}</div>;
  }

  if (loadError || !learner) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-gray-900 dark:text-white">
        {loadError || t("learnerDashboard.loadFailed", "Could not load your dashboard.")}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t("StudentDashboard")}
      </h1>
      <p className="text-base text-gray-700 dark:text-gray-300">
        {t("welcome_dashboard")} {learner.name} · {learner.cefrLevel}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("learnerDashboard.learningPath")}</p>
          <p className="mt-2 text-xl font-semibold">{learner.currentLesson}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("learnerDashboard.complete", { value: learner.progressPercent })}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("learnerDashboard.languagePerformance")}</p>
          <p className="mt-2 text-xl font-semibold">{t("learnerDashboard.accuracy", { value: learner.accuracy })}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("learnerDashboard.averageResponse", { value: (learner.averageResponseMs / 1000).toFixed(1) })}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("learnerDashboard.adaptiveDecisions")}</p>
          <p className="mt-2 text-xl font-semibold">{t("learnerDashboard.active", { count: decisions.length })}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {(learner.skillWeaknesses || []).map((weakness) => domainLabel(weakness.subskill)).join(", ")}
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          {t("learnerDashboard.performanceProfile", "Language Performance Profile")}
        </h2>
        <LanguagePerformanceProfile profile={learner.dashboardSummary?.languagePerformanceProfile || []} />
      </div>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          {t("learnerDashboard.targetedTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {decisions.map((decision) => (
            <div key={decision.id} className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
              <p className="font-medium">{decision.reason}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {decision.targetedExerciseIds?.length || 0} {t("admin.targetedExercises")}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <StudyReminder />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FlashCard />
          <CompletedCourses />
          <CoursesInProgress />
          <Medals />
          <LearningStatistics />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
