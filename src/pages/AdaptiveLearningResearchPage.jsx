import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, Brain, Clock, Database, FileText, LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "../services/apiClient";

const formatValue = (value, locale) => {
  const numberFormat = new Intl.NumberFormat(locale);
  if (typeof value !== "number") return value || "-";
  if (Math.abs(value) >= 1000) return numberFormat.format(Math.round(value));
  return Number.isInteger(value) ? numberFormat.format(value) : numberFormat.format(Number(value.toFixed(4)));
};

const titleize = (value) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const translateValue = (value, t, column) => {
  if (typeof value !== "string") return value;
  if (column === "review_content") {
    const match = value.match(/^Review German (.+) items connected to repeated errors\.$/);
    if (match) {
      return t("research.generated.reviewContent", {
        skill: t(`research.values.${match[1]}`, match[1]),
      });
    }
  }
  if (column === "next_learning_path_step") {
    const match = value.match(/^Insert (.+) before the next mixed-skill lesson\.$/);
    if (match) {
      return t("research.generated.nextStep", {
        exercise: t(`research.values.${match[1]}`, match[1]),
      });
    }
  }
  return t(`research.values.${value}`, value);
};

const ResearchTable = ({ title, rows, limit = 8, t, locale, isRtl }) => {
  const visibleRows = rows?.slice(0, limit) || [];
  const columns = visibleRows.length > 0 ? Object.keys(visibleRows[0]) : [];

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-base font-semibold text-gray-950 dark:text-white">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className={`min-w-full text-sm ${isRtl ? "text-right" : "text-left"}`}>
          <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-3 py-2 font-semibold">
                  {t(`research.columns.${column}`, titleize(column))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {visibleRows.map((row, rowIndex) => (
              <tr key={`${title}-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={column} className="max-w-sm whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-200">
                    {formatValue(translateValue(row[column], t, column), locale)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const StatCard = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">{value}</p>
      </div>
      <span className="rounded-md bg-gray-100 p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
        <Icon className="h-5 w-5" />
      </span>
    </div>
    {detail && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{detail}</p>}
  </div>
);

const AdaptiveLearningResearchPage = () => {
  const { t, i18n } = useTranslation();
  const [research, setResearch] = useState(null);
  const [error, setError] = useState("");
  const isRtl = i18n.language === "fa";
  const locale = i18n.language === "fa" ? "fa-IR" : i18n.language === "de" ? "de-DE" : "en-US";

  useEffect(() => {
    apiClient
      .adaptiveLearningResearch()
      .then(({ research: payload }) => setResearch(payload))
      .catch((requestError) => setError(requestError.message || "research_load_failed"));
  }, []);

  const summary = useMemo(() => {
    if (!research) return null;
    const classification = research.tables.classification.filter((row) => row.status === "trained");
    const bestClassifier = [...classification].sort((a, b) => (b.f1 || 0) - (a.f1 || 0))[0];
    const regression = research.tables.regression.filter((row) => row.status === "trained");
    const bestRegressor = [...regression].sort((a, b) => (a.rmse || Infinity) - (b.rmse || Infinity))[0];
    const clusters = research.tables.clustering.filter((row) => row.silhouette_score);
    const bestCluster = [...clusters].sort((a, b) => b.silhouette_score - a.silhouette_score)[0];

    return {
      learners: research.manifest.learners,
      interactions: research.manifest.interactions,
      bestClassifier: bestClassifier
        ? t("research.metricWithScore", {
            model: bestClassifier.model,
            score: formatValue(bestClassifier.f1, locale),
            metric: "F1",
          })
        : "-",
      bestRegressor: bestRegressor
        ? t("research.metricWithScore", {
            model: bestRegressor.model,
            score: formatValue(bestRegressor.rmse, locale),
            metric: "RMSE",
          })
        : "-",
      bestCluster: bestCluster
        ? t("research.scoreInParentheses", {
            model: bestCluster.model,
            score: formatValue(bestCluster.silhouette_score, locale),
          })
        : "-",
    };
  }, [locale, research, t]);

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-950 dark:bg-gray-950 dark:text-white">
        <div className="mx-auto max-w-6xl rounded-lg border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">{t("research.loadErrorTitle")}</p>
          </div>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </main>
    );
  }

  if (!research || !summary) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-950 dark:bg-gray-950 dark:text-white">
        <div className="mx-auto max-w-6xl text-sm text-gray-600 dark:text-gray-300">
          {t("research.loading")}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-950 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-3 border-b border-gray-200 pb-6 dark:border-gray-800">
          <div className="flex items-center gap-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <Brain className="h-5 w-5" />
            <span>{t("research.eyebrow")}</span>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-normal text-gray-950 dark:text-white">
                {t("research.title")}
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
                {t("research.subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/admin/research"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                <Database className="h-4 w-4" />
                {t("nav.researchIndex", "Research Index")}
              </Link>
              <a
                href={apiClient.adaptiveLearningResearchReportUrl()}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                <FileText className="h-4 w-4" />
                {t("research.reportFile")}
              </a>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={Database}
            label={t("research.stats.learners")}
            value={formatValue(summary.learners, locale)}
            detail={t("research.stats.learnersDetail")}
          />
          <StatCard
            icon={Clock}
            label={t("research.stats.interactions")}
            value={formatValue(summary.interactions, locale)}
            detail={t("research.stats.interactionsDetail")}
          />
          <StatCard
            icon={Brain}
            label={t("research.stats.bestClassifier")}
            value={summary.bestClassifier}
            detail={t("research.stats.bestClassifierDetail")}
          />
          <StatCard
            icon={LineChart}
            label={t("research.stats.bestRegressor")}
            value={summary.bestRegressor}
            detail={t("research.stats.bestRegressorDetail")}
          />
          <StatCard
            icon={BarChart3}
            label={t("research.stats.bestClustering")}
            value={summary.bestCluster}
            detail={t("research.stats.bestClusteringDetail")}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {research.figures.map((figure) => (
            <figure key={figure} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <img
                src={apiClient.adaptiveLearningResearchFigureUrl(figure)}
                alt={titleize(figure.replace(".png", ""))}
                className="w-full rounded-md border border-gray-100 bg-white dark:border-gray-800"
              />
              <figcaption className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                {t(`research.figures.${figure.replace(".png", "")}`, titleize(figure.replace(".png", "")))}
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <ResearchTable title={t("research.tables.classification")} rows={research.tables.classification} limit={10} t={t} locale={locale} isRtl={isRtl} />
          <ResearchTable title={t("research.tables.regression")} rows={research.tables.regression} limit={10} t={t} locale={locale} isRtl={isRtl} />
          <ResearchTable title={t("research.tables.clustering")} rows={research.tables.clustering} limit={10} t={t} locale={locale} isRtl={isRtl} />
          <ResearchTable title={t("research.tables.statisticalTests")} rows={research.tables.statisticalTests} limit={10} t={t} locale={locale} isRtl={isRtl} />
          <ResearchTable title={t("research.tables.archetypes")} rows={research.tables.archetypes} limit={10} t={t} locale={locale} isRtl={isRtl} />
          <ResearchTable title={t("research.tables.weaknesses")} rows={research.tables.weaknesses} limit={10} t={t} locale={locale} isRtl={isRtl} />
          <ResearchTable title={t("research.tables.featureImportance")} rows={research.tables.featureImportance} limit={10} t={t} locale={locale} isRtl={isRtl} />
          <ResearchTable title={t("research.tables.ruleDecisions")} rows={research.tables.ruleDecisions} limit={8} t={t} locale={locale} isRtl={isRtl} />
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">{t("research.finalReportPreview")}</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("research.reportLanguageNote")}</p>
          <pre dir="ltr" className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-gray-950 p-4 text-left text-xs leading-6 text-gray-100">
            {research.reportMarkdown}
          </pre>
        </section>
      </div>
    </main>
  );
};

export default AdaptiveLearningResearchPage;
