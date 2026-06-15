import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Database,
  GraduationCap,
  Layers,
  Users,
} from "lucide-react";
import {
  getClassCatalog,
  getClassReport,
  getExerciseBank,
  getLearnerDetailReport,
  getLearners,
  getPlatformReport,
  getResources,
  getSkillAreas,
} from "../services/learningDataService";

const numberFormat = new Intl.NumberFormat("en-US");

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

const ProgressBar = ({ value }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
  </div>
);

const AdminPage = () => {
  const { t, i18n } = useTranslation();
  const learners = getLearners();
  const classes = getClassCatalog();
  const resources = getResources();
  const exerciseBank = getExerciseBank();
  const skillAreas = getSkillAreas();
  const platformReport = getPlatformReport();

  const [selectedLearnerId, setSelectedLearnerId] = useState(learners[0].id);
  const [selectedClassId, setSelectedClassId] = useState(classes[0].id);
  const [activeView, setActiveView] = useState("overview");

  const learnerReport = useMemo(
    () => getLearnerDetailReport(selectedLearnerId),
    [selectedLearnerId]
  );
  const classReport = useMemo(() => getClassReport(selectedClassId), [selectedClassId]);

  const allDecisions = learners.flatMap((learner) =>
    learner.adaptiveDecisions.map((decision) => ({
      ...decision,
      learnerName: learner.name,
      cefrLevel: learner.cefrLevel,
    }))
  );
  const isRtl = i18n.language === "fa";
  const domainLabel = (value) => t(`domain.${value}`, value);
  const decisionLabel = (decision) =>
    `${domainLabel(decision.skillArea)} · ${domainLabel(decision.subskill)}`;
  const exerciseTitle = (exercise) =>
    t(`exerciseTemplates.${exercise.titleKey}`, {
      number: exercise.sequence,
      defaultValue: exercise.title,
    });
  const resourceTitle = (resource) =>
    t(`resourcesData.${resource.id}.title`, resource.title);
  const resourceDescription = (resource) =>
    t(`resourcesData.${resource.id}.description`, resource.description);

  const views = [
    { id: "overview", label: t("admin.overview"), icon: BarChart3 },
    { id: "learners", label: t("admin.learners"), icon: Users },
    { id: "classes", label: t("admin.classes"), icon: GraduationCap },
    { id: "content", label: t("admin.content"), icon: BookOpen },
    { id: "exercises", label: t("admin.exercises"), icon: Layers },
    { id: "adaptive", label: t("admin.adaptive"), icon: Brain },
  ];

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-50 px-4 py-6 text-gray-950 dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
              {t("admin.eyebrow")}
            </p>
            <h1 className="mt-1 text-3xl font-bold">{t("admin.title")}</h1>
            <p className="mt-2 max-w-3xl text-gray-600 dark:text-gray-300">
              {t("admin.description")}
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
            {t("admin.syntheticNotice")}
          </div>
        </header>

        <nav className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {views.map((view) => {
            const Icon = view.icon;
            const isActive = activeView === view.id;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {view.label}
              </button>
            );
          })}
        </nav>

        {activeView === "overview" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={Users}
                label={t("admin.syntheticLearners")}
                value={platformReport.learnerCount}
                detail={t("admin.classesCount", { count: platformReport.classCount })}
              />
              <StatCard
                icon={Activity}
                label={t("admin.learningEvents")}
                value={numberFormat.format(platformReport.eventCount)}
                detail={t("admin.decisionsCount", { count: platformReport.adaptiveDecisionCount })}
              />
              <StatCard
                icon={BookOpen}
                label={t("admin.resources")}
                value={platformReport.resourceCount}
                detail={t("admin.exerciseCount", { count: platformReport.exerciseCount })}
              />
              <StatCard
                icon={BarChart3}
                label={t("admin.averageAccuracy")}
                value={`${platformReport.averageAccuracy}%`}
                detail={t("admin.averageProgress", { value: platformReport.averageProgress })}
              />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-lg font-semibold">{t("admin.commonErrorPatterns")}</h2>
                <div className="space-y-3">
                  {platformReport.commonErrorPatterns.slice(0, 6).map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.count}</span>
                      </div>
                      <ProgressBar value={Math.min(100, item.count / 7)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-lg font-semibold">{t("admin.skillWeaknessDistribution")}</h2>
                <div className="space-y-3">
                  {platformReport.weaknessDistribution.map((item) => (
                    <div key={item.skillArea}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{domainLabel(item.skillArea)}</span>
                        <span>{item.count}</span>
                      </div>
                      <ProgressBar value={item.count} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === "learners" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
            <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("admin.learnerDetailReport")}
              </label>
              <select
                value={selectedLearnerId}
                onChange={(event) => setSelectedLearnerId(event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-950"
              >
                {learners.map((learner) => (
                  <option key={learner.id} value={learner.id}>
                      {learner.name} - {learner.cefrLevel}
                  </option>
                ))}
              </select>

              <div className="mt-4 space-y-3">
                {learners.slice(0, 12).map((learner) => (
                  <button
                    key={learner.id}
                    onClick={() => setSelectedLearnerId(learner.id)}
                    className={`w-full rounded-md border p-3 text-left text-sm transition ${
                      learner.id === selectedLearnerId
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                        : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="font-semibold">{learner.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {learner.cefrLevel} · {learner.className} · {t("learnerDashboard.accuracy", { value: learner.accuracy })}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{learnerReport.learner.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {learnerReport.learner.goal} · {learnerReport.learner.className} ·{" "}
                      {learnerReport.learner.teacher}
                    </p>
                  </div>
                  <div className="rounded-md bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
                      {learnerReport.learner.cefrLevel} · {t("learnerDashboard.complete", { value: learnerReport.learner.progressPercent })}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <StatCard icon={Activity} label={t("admin.events")} value={learnerReport.eventCount} />
                  <StatCard icon={BarChart3} label={t("admin.accuracy")} value={`${learnerReport.learner.accuracy}%`} />
                  <StatCard icon={Brain} label={t("admin.weaknesses")} value={learnerReport.weaknessCount} />
                </div>

                <h3 className="mt-6 font-semibold">{t("admin.languagePerformance")}</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {skillAreas.map((skill) => (
                    <div key={skill.id} className="rounded-md bg-gray-50 p-3 dark:bg-gray-950">
                      <div className="mb-2 flex justify-between text-sm">
                        <span>{domainLabel(skill.id)}</span>
                        <span>{learnerReport.learner.performance[skill.id]}%</span>
                      </div>
                      <ProgressBar value={learnerReport.learner.performance[skill.id]} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-3 font-semibold">{t("admin.adaptiveDecisions")}</h3>
                  <div className="space-y-3">
                    {learnerReport.decisions.map((decision) => (
                      <div key={decision.id} className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
                        <div className="flex justify-between gap-3 text-sm">
                          <span className="font-semibold">{decisionLabel(decision)}</span>
                          <span>{domainLabel(decision.status)}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {t("admin.targetedInserted", { count: decision.targetedExercises.length })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-3 font-semibold">{t("admin.latestLearningEvents")}</h3>
                  <div className="space-y-2">
                    {learnerReport.latestEvents.map((event) => (
                      <div key={event.id} className="rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-950">
                        <div className="flex justify-between">
                          <span>{domainLabel(event.type)}</span>
                          <span className={event.correct ? "text-emerald-600" : "text-red-600"}>
                            {event.correct ? t("domain.correct") : t("domain.needsReview")}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          {domainLabel(event.subskill)} · {(event.responseMs / 1000).toFixed(1)}s
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === "classes" && (
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{t("admin.classReport")}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("admin.classReportDescription")}
                </p>
              </div>
              <select
                value={selectedClassId}
                onChange={(event) => setSelectedClassId(event.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-950"
              >
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatCard icon={Users} label={t("admin.students")} value={classReport.studentCount} />
              <StatCard icon={BarChart3} label={t("admin.progress")} value={`${classReport.averageProgress}%`} />
              <StatCard icon={Activity} label={t("admin.accuracy")} value={`${classReport.averageAccuracy}%`} />
              <StatCard icon={Database} label={t("admin.avgResponse")} value={`${(classReport.averageResponseMs / 1000).toFixed(1)}s`} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="py-3">{t("admin.student")}</th>
                    <th>{t("admin.cefr")}</th>
                    <th>{t("admin.progress")}</th>
                    <th>{t("admin.accuracy")}</th>
                    <th>{t("admin.weaknesses")}</th>
                    <th>{t("admin.teacher")}</th>
                  </tr>
                </thead>
                <tbody>
                  {classReport.students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 font-medium">{student.name}</td>
                      <td>{student.cefrLevel}</td>
                      <td>{student.progressPercent}%</td>
                      <td>{student.accuracy}%</td>
                      <td>{student.skillWeaknesses.map((weakness) => domainLabel(weakness.subskill)).join(", ")}</td>
                      <td>{student.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === "content" && (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {resources.map((resource) => (
              <div key={resource.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase text-gray-500">{resource.type}</p>
                <h2 className="mt-1 text-lg font-semibold">{resourceTitle(resource)}</h2>
                  </div>
                  <span className="rounded-md bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                    {resource.cefrLevel}
                  </span>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300">{resourceDescription(resource)}</p>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{domainLabel(resource.skillArea)}</p>
              </div>
            ))}
          </section>
        )}

        {activeView === "exercises" && (
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-semibold">{t("admin.exerciseBank")}</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="py-3">{t("admin.exercise")}</th>
                    <th>{t("admin.cefr")}</th>
                    <th>{t("admin.difficulty")}</th>
                    <th>{t("admin.skill")}</th>
                    <th>{t("admin.subskill")}</th>
                    <th>{t("admin.minutes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseBank.map((exercise) => (
                    <tr key={exercise.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 font-medium">{exerciseTitle(exercise)}</td>
                      <td>{exercise.cefrLevel}</td>
                      <td>{t(`common.${exercise.difficulty}`, exercise.difficulty)}</td>
                      <td>{domainLabel(exercise.skillArea)}</td>
                      <td>{domainLabel(exercise.subskill)}</td>
                      <td>{exercise.estimatedMinutes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === "adaptive" && (
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-1 text-xl font-semibold">{t("admin.adaptiveDecisions")}</h2>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              {t("admin.adaptiveDescription")}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="py-3">{t("admin.learner")}</th>
                    <th>{t("admin.cefr")}</th>
                    <th>{t("admin.type")}</th>
                    <th>{t("admin.reason")}</th>
                    <th>{t("admin.status")}</th>
                    <th>{t("admin.targetedExercises")}</th>
                  </tr>
                </thead>
                <tbody>
                  {allDecisions.slice(0, 80).map((decision) => (
                    <tr key={decision.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 font-medium">{decision.learnerName}</td>
                      <td>{decision.cefrLevel}</td>
                      <td>{domainLabel(decision.type)}</td>
                      <td>{decisionLabel(decision)}</td>
                      <td>{domainLabel(decision.status)}</td>
                      <td>{decision.targetedExerciseIds.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
