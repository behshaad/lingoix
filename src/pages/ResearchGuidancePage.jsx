import { BookOpen, Brain, FlaskConical, GitBranch, LineChart, Network, ShieldAlert, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const iconMap = {
  overview: FlaskConical,
  pipeline: Workflow,
  classification: Brain,
  regression: LineChart,
  clustering: Network,
  recommendation: GitBranch,
  interpretation: BookOpen,
  validity: ShieldAlert,
};

const GuidanceCard = ({ item }) => {
  const Icon = iconMap[item.icon] || BookOpen;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start gap-3">
        <span className="rounded-md bg-gray-100 p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.body}</p>
        </div>
      </div>
      {Array.isArray(item.points) && item.points.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
          {item.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const ModelTable = ({ models }) => (
  <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{models.title}</h2>
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <tr>
            {models.headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-3 py-2 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {models.rows.map((row) => (
            <tr key={row.name}>
              <td className="whitespace-nowrap px-3 py-3 font-medium text-gray-950 dark:text-white">{row.name}</td>
              <td className="min-w-56 px-3 py-3 text-gray-700 dark:text-gray-200">{row.purpose}</td>
              <td className="min-w-56 px-3 py-3 text-gray-700 dark:text-gray-200">{row.interpretation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const ResearchGuidancePage = () => {
  const { t } = useTranslation();
  const sections = t("researchGuidance.sections", { returnObjects: true });
  const models = t("researchGuidance.models", { returnObjects: true });
  const steps = t("researchGuidance.steps.items", { returnObjects: true });

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-950 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-gray-800">
          <div className="flex items-center gap-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <BookOpen className="h-5 w-5" />
            <span>{t("researchGuidance.eyebrow")}</span>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-normal text-gray-950 dark:text-white">
                {t("researchGuidance.title")}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                {t("researchGuidance.subtitle")}
              </p>
            </div>
            <Link
              to="/research/adaptive-learning"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              <LineChart className="h-4 w-4" />
              {t("researchGuidance.resultsLink")}
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          {sections.map((item) => (
            <GuidanceCard key={item.title} item={item} />
          ))}
        </section>

        <ModelTable models={models} />

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t("researchGuidance.steps.title")}</h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-gray-700 dark:text-gray-200 md:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step} className="rounded-md bg-gray-50 p-3 dark:bg-gray-950">
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">{index + 1}. </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
};

export default ResearchGuidancePage;
