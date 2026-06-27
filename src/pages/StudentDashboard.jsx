import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Activity, ArrowRight, BookOpen, Brain, Clock3, Gauge, Sparkles, Target } from "lucide-react";

import LanguagePerformanceProfile from "../components/Dashboard/LanguagePerformanceProfile";
import GamifiedRoadmap from "../components/Roadmap/GamifiedRoadmap";
import AccountAvatar from "../components/Account/AccountAvatar";
import { apiClient } from "../services/apiClient";

const MetricCard = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-[22px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur dark:border-gray-800 dark:bg-gray-900/85">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">{value}</p>
      </div>
      <span className="rounded-2xl bg-gray-100 p-3 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
        <Icon className="h-5 w-5" />
      </span>
    </div>
    {detail && <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">{detail}</p>}
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [learner, setLearner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
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

  const nextItem = useMemo(() => {
    const path = learner?.learningPath || [];
    return path.find((item) => item.status === "next") || path.find((item) => item.status === "in_progress") || path[0];
  }, [learner]);

  const proposedDecisions = learner?.dashboardSummary?.proposedAdaptiveDecisions || [];
  const activeDecisions = learner?.dashboardSummary?.activeAdaptiveDecisions || [];
  const weaknesses = learner?.skillWeaknesses || [];

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
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-8 text-gray-950 dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <section className="rounded-[30px] bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] dark:bg-gray-900 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <AccountAvatar
                src={learner.avatarUrl}
                name={learner.name}
                alt={t("accountProfile.avatarAlt", "Profile photo")}
                size="lg"
              />
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-700">
                  <Sparkles className="h-4 w-4" />
                  {t("roadmap.todayPath", "Today's Path")}
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                  {t("learnerDashboard.greeting", "Welcome back")}, {learner.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
                  {learner.cefrLevel} · {learner.goal} · {t("learnerDashboard.nextFocus", "Your next focus is")}{" "}
                  <span className="font-semibold text-gray-950 dark:text-white">{nextItem?.title}</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">{t("roadmap.pathProgress", "Path Progress")}</p>
                <p className="mt-1 text-xl font-semibold">{learner.progressPercent}%</p>
              </div>
              <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">{t("learnerDashboard.accuracyLabel", "Accuracy")}</p>
                <p className="mt-1 text-xl font-semibold">{learner.accuracy}%</p>
              </div>
              <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">{t("learnerDashboard.response", "Response")}</p>
                <p className="mt-1 text-xl font-semibold">{(learner.averageResponseMs / 1000).toFixed(1)}s</p>
              </div>
            </div>
          </div>
        </section>

        <GamifiedRoadmap items={learner.learningPath || []} variant="dashboard" />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Target}
            label={t("roadmap.pathProgress", "Path Progress")}
            value={`${learner.progressPercent}%`}
            detail={learner.currentLesson}
          />
          <MetricCard
            icon={Gauge}
            label={t("learnerDashboard.languagePerformance")}
            value={t("learnerDashboard.accuracy", { value: learner.accuracy })}
            detail={t("learnerDashboard.averageResponse", { value: (learner.averageResponseMs / 1000).toFixed(1) })}
          />
          <MetricCard
            icon={Brain}
            label={t("learnerDashboard.adaptiveDecisions")}
            value={t("learnerDashboard.active", { count: activeDecisions.length })}
            detail={weaknesses.map((weakness) => domainLabel(weakness.subskill)).join(", ")}
          />
          <MetricCard
            icon={Activity}
            label={t("admin.learningEvents", "Learning events")}
            value={learner.learningEvents?.length || 0}
            detail={t("learnerDashboard.recentEvidence", "Recent practice evidence")}
          />
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[26px] bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t("learnerDashboard.performanceProfile", "Language Performance Profile")}</h2>
              <Clock3 className="h-5 w-5 text-gray-400" />
            </div>
            <LanguagePerformanceProfile profile={learner.dashboardSummary?.languagePerformanceProfile || []} />
          </div>

          <div className="space-y-5">
            <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] dark:bg-gray-900">
              <h2 className="text-xl font-semibold">{t("learnerDashboard.targetedTitle")}</h2>
              <div className="mt-4 space-y-3">
                {[...activeDecisions, ...proposedDecisions].slice(0, 4).map((decision) => (
                  <div key={decision.id} className="rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
                    <p className="font-semibold">{decision.reason}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {domainLabel(decision.skillArea)} · {domainLabel(decision.subskill)}
                    </p>
                  </div>
                ))}
                {!activeDecisions.length && !proposedDecisions.length && (
                  <p className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {t("learnerDashboard.noTargetedPractice", "No targeted practice is waiting right now.")}
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[26px] bg-gray-950 p-5 text-white shadow-[0_18px_48px_rgba(15,23,42,0.16)] dark:bg-white dark:text-gray-950">
              <BookOpen className="h-6 w-6" />
              <h2 className="mt-4 text-xl font-semibold">{t("roadmap.freePractice", "Free Practice")}</h2>
              <p className="mt-2 text-sm leading-6 text-white/70 dark:text-gray-600">
                {t("learnerDashboard.freePracticeDetail", "Practice from the exercise bank without advancing Today's Path.")}
              </p>
              <Link
                to="/practice"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-950 dark:bg-gray-950 dark:text-white"
              >
                {t("nav.practice", "Practice")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
