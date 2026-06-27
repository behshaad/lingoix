import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Brain,
  Database,
  FileText,
  Image,
  LineChart,
  Table2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "../services/apiClient";

const titleize = (value) =>
  String(value || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const artifactCounts = (research) => ({
  figures: research?.figures?.length || 0,
  datasets: 3,
  tables: 13,
  learners: research?.manifest?.learners || 0,
  interactions: research?.manifest?.interactions || 0,
});

const tableFiles = [
  "classification_results.csv",
  "regression_results.csv",
  "clustering_results.csv",
  "statistical_tests.csv",
  "adaptive_vs_traditional_outcomes.csv",
  "archetype_distribution.csv",
  "weakness_distribution.csv",
  "question_type_errors.csv",
  "feature_importance.csv",
  "hyperparameter_tuning.csv",
  "level_summary.csv",
  "rule_based_adaptive_decisions.csv",
  "ml_based_adaptive_decisions.csv",
];

const datasetFiles = ["learners.csv", "learner_features.csv", "interactions.csv"];

const LinkCard = ({ icon: Icon, title, body, to, href, cta }) => {
  const className =
    "group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-emerald-700";
  const content = (
    <>
      <div className="flex items-start gap-3">
        <span className="rounded-md bg-gray-100 p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{body}</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800 dark:text-emerald-300">
        {cta}
      </p>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
};

const ArtifactList = ({ icon: Icon, title, items }) => (
  <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <div className="flex items-center gap-3">
      <span className="rounded-md bg-gray-100 p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{title}</h2>
    </div>
    <div className="mt-4 grid gap-2">
      {items.map((item) => (
        <a
          key={item.fileName}
          href={item.href}
          className="flex items-center justify-between gap-3 rounded-md border border-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-gray-800 dark:text-gray-200 dark:hover:border-emerald-900 dark:hover:bg-emerald-950"
        >
          <span className="truncate">{item.label}</span>
          <span className="shrink-0 text-xs text-gray-500">{item.fileName}</span>
        </a>
      ))}
    </div>
  </section>
);

const AdminResearchIndexPage = () => {
  const { t, i18n } = useTranslation();
  const [research, setResearch] = useState(null);
  const [error, setError] = useState("");
  const isRtl = i18n.language === "fa";

  useEffect(() => {
    apiClient
      .adaptiveLearningResearch()
      .then(({ research: payload }) => setResearch(payload))
      .catch((requestError) => setError(requestError.message || "research_load_failed"));
  }, []);

  const counts = useMemo(() => artifactCounts(research), [research]);
  const figureItems = useMemo(
    () =>
      (research?.figures || []).map((fileName) => ({
        fileName,
        label: t(`research.figures.${fileName.replace(".png", "")}`, titleize(fileName)),
        href: apiClient.adaptiveLearningResearchFigureUrl(fileName),
      })),
    [research, t]
  );
  const tableItems = tableFiles.map((fileName) => ({
    fileName,
    label: titleize(fileName),
    href: apiClient.adaptiveLearningResearchTableUrl(fileName),
  }));
  const datasetItems = datasetFiles.map((fileName) => ({
    fileName,
    label: titleize(fileName),
    href: apiClient.adaptiveLearningResearchDataUrl(fileName),
  }));

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-50 px-6 py-8 text-gray-950 dark:bg-gray-950 dark:text-white"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-gray-800">
          <div className="flex items-center gap-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <Database className="h-5 w-5" />
            <span>{t("researchIndex.eyebrow", "Research Results Index")}</span>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-normal text-gray-950 dark:text-white">
                {t("researchIndex.title", "Generated research artifacts")}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                {t(
                  "researchIndex.subtitle",
                  "Browse the synthetic-data research report, figures, tables, datasets, model comparisons, and interpretation guide from one admin-accessible page."
                )}
              </p>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              <BarChart3 className="h-4 w-4" />
              {t("researchIndex.adminLink", "Admin panel")}
            </Link>
          </div>
        </header>

        {error && (
          <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">{t("research.loadErrorTitle")}</p>
            </div>
            <p className="mt-2 text-sm">{error}</p>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("research.stats.learners")}</p>
            <p className="mt-2 text-2xl font-bold">{counts.learners}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("research.stats.interactions")}</p>
            <p className="mt-2 text-2xl font-bold">{counts.interactions}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("researchIndex.figures", "Figures")}</p>
            <p className="mt-2 text-2xl font-bold">{counts.figures}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("researchIndex.tables", "Tables")}</p>
            <p className="mt-2 text-2xl font-bold">{counts.tables}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("researchIndex.datasets", "Datasets")}</p>
            <p className="mt-2 text-2xl font-bold">{counts.datasets}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <LinkCard
            icon={LineChart}
            title={t("research.title")}
            body={t("research.subtitle")}
            to="/research/adaptive-learning"
            cta={t("researchIndex.openResults", "Open results")}
          />
          <LinkCard
            icon={BookOpen}
            title={t("researchGuidance.title")}
            body={t("researchGuidance.subtitle")}
            to="/research/guidance"
            cta={t("researchIndex.openGuidance", "Open guidance")}
          />
          <LinkCard
            icon={FileText}
            title={t("research.finalReportPreview")}
            body={t("research.reportLanguageNote")}
            href={apiClient.adaptiveLearningResearchReportUrl()}
            cta={t("research.reportFile")}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <ArtifactList icon={Image} title={t("researchIndex.generatedFigures", "Generated figures")} items={figureItems} />
          <ArtifactList icon={Table2} title={t("researchIndex.generatedTables", "Generated tables")} items={tableItems} />
          <ArtifactList icon={Brain} title={t("researchIndex.generatedDatasets", "Generated datasets")} items={datasetItems} />
        </section>
      </div>
    </main>
  );
};

export default AdminResearchIndexPage;
