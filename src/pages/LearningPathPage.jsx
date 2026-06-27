import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Brain, CheckCircle2, Languages, LineChart, MessageCircle } from "lucide-react";
import { apiClient } from "../services/apiClient";
import GamifiedRoadmap from "../components/Roadmap/GamifiedRoadmap";

const steps = [
  { icon: Languages, titleKey: "learningPath.steps.profile", detailKey: "learningPath.details.profile" },
  { icon: BookOpen, titleKey: "learningPath.steps.resources", detailKey: "learningPath.details.resources" },
  { icon: Brain, titleKey: "learningPath.steps.practice", detailKey: "learningPath.details.practice" },
  { icon: LineChart, titleKey: "learningPath.steps.profileChart", detailKey: "learningPath.details.profileChart" },
  { icon: MessageCircle, titleKey: "learningPath.steps.conversation", detailKey: "learningPath.details.conversation" },
  { icon: CheckCircle2, titleKey: "learningPath.steps.review", detailKey: "learningPath.details.review" },
];

const LearningPathPage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "fa";
  const [learner, setLearner] = useState(null);
  const [isLoadingLearner, setIsLoadingLearner] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadLearner = async () => {
      try {
        const { account } = await apiClient.me();
        if (!account?.learnerId) return;
        const data = await apiClient.learner(account.learnerId);
        if (isMounted) setLearner(data.learner);
      } catch {
        if (isMounted) setLearner(null);
      } finally {
        if (isMounted) setIsLoadingLearner(false);
      }
    };
    loadLearner();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-white px-4 py-10 text-gray-950 dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            {t("learningPath.eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            {t("learningPath.title")}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {t("learningPath.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-md bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950"
            >
              {t("Dashboard")}
            </Link>
            <Link
              to="/resources"
              className="rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              {t("Resources")}
            </Link>
          </div>
        </div>

        {learner && (
          <div className="mt-10">
            <GamifiedRoadmap items={learner.learningPath || []} variant="path" />
          </div>
        )}

        {isLoadingLearner ? (
          <div className="mt-10 rounded-lg border border-gray-200 p-5 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            {t("practice.loading")}
          </div>
        ) : !learner ? (
          <div className="mt-10 rounded-lg border border-gray-200 p-5 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            {t("roadmap.empty", "Your roadmap will appear after learner profile setup.")}
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.titleKey} className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
                <Icon className="h-6 w-6 text-emerald-600" />
                <h2 className="mt-4 text-lg font-semibold">{t(step.titleKey)}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {t(step.detailKey)}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default LearningPathPage;
