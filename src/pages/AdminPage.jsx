import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Database,
  GraduationCap,
  Layers,
  Pencil,
  Plus,
  Save,
  Users,
} from "lucide-react";
import { apiClient } from "../services/apiClient";
import { getSkillAreas } from "../services/learningDataService";

const numberFormat = new Intl.NumberFormat("en-US");

const emptyResource = {
  id: "",
  title: "",
  type: "book",
  cefrLevel: "A1",
  skillArea: "reading-comprehension",
  sourceUrl: "",
  description: "",
};

const emptyExercise = {
  id: "",
  title: "",
  titleKey: "customExercise",
  sequence: 1,
  cefrLevel: "A1",
  difficulty: "easy",
  interactionType: "flashcard",
  skillArea: "vocabulary-recall",
  subskill: "daily verbs",
  resourceId: "",
  estimatedMinutes: 10,
  prompt: "",
  expectedAnswer: "",
  choices: [],
  scoringRule: { type: "self_assessed", minLength: 0, keywords: [] },
  supportText: "",
};

const interactionTypes = ["flashcard", "multiple_choice", "writing_prompt", "listening_check"];
const scoringRuleTypes = ["self_assessed", "exact_choice", "exact_text", "contains_keywords", "min_length_keywords"];

const choicesDraftValue = (choices) => {
  if (Array.isArray(choices)) return choices.join("\n");
  return choices || "";
};

const keywordsDraftValue = (rule) => {
  if (Array.isArray(rule?.keywords)) return rule.keywords.join("\n");
  return rule?.keywords || "";
};

const normalizeDraftRule = (rule) => ({
  type: rule?.type || "self_assessed",
  minLength: Number(rule?.minLength || 0),
  keywords: Array.isArray(rule?.keywords)
    ? rule.keywords
    : String(rule?.keywords || "")
        .split("\n")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
});

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
    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, value)}%` }} />
  </div>
);

const TextInput = ({ label, value, onChange, type = "text" }) => (
  <label className="block text-sm">
    <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
    />
  </label>
);

const TextAreaInput = ({ label, value, onChange, rows = 3 }) => (
  <label className="block text-sm">
    <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
    />
  </label>
);

const SelectInput = ({ label, value, onChange, children }) => (
  <label className="block text-sm">
    <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
    >
      {children}
    </select>
  </label>
);

const AdminPage = () => {
  const { t, i18n } = useTranslation();
  const skillAreas = getSkillAreas();
  const [activeView, setActiveView] = useState("overview");
  const [account, setAccount] = useState(null);
  const [learners, setLearners] = useState([]);
  const [resources, setResources] = useState([]);
  const [exerciseBank, setExerciseBank] = useState([]);
  const [platformReport, setPlatformReport] = useState(null);
  const [adaptiveDecisions, setAdaptiveDecisions] = useState([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [learnerDetail, setLearnerDetail] = useState(null);
  const [resourceDraft, setResourceDraft] = useState(emptyResource);
  const [exerciseDraft, setExerciseDraft] = useState(emptyExercise);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const isRtl = i18n.language === "fa";
  const domainLabel = (value) => t(`domain.${value}`, value);
  const exerciseTitle = (exercise) =>
    t(`exerciseTemplates.${exercise.titleKey}`, {
      number: exercise.sequence,
      defaultValue: exercise.title,
    });
  const resourceTitle = (resource) =>
    t(`resourcesData.${resource.id}.title`, resource.title);
  const resourceDescription = (resource) =>
    t(`resourcesData.${resource.id}.description`, resource.description);
  const decisionLabel = (decision) =>
    `${domainLabel(decision.skillArea)} · ${domainLabel(decision.subskill)}`;

  const classReports = useMemo(() => {
    const grouped = learners.reduce((groups, learner) => {
      groups[learner.classId] = groups[learner.classId] || {
        classId: learner.classId,
        className: learner.className,
        students: [],
      };
      groups[learner.classId].students.push(learner);
      return groups;
    }, {});

    return Object.values(grouped).map((classItem) => {
      const average = (selector) =>
        Math.round(
          classItem.students.reduce((sum, learner) => sum + selector(learner), 0) /
            classItem.students.length
        );
      return {
        ...classItem,
        studentCount: classItem.students.length,
        averageProgress: average((learner) => learner.progressPercent),
        averageAccuracy: average((learner) => learner.accuracy),
        averageResponseMs: average((learner) => learner.averageResponseMs),
      };
    });
  }, [learners]);

  const classReport = classReports.find((item) => item.classId === selectedClassId) || classReports[0];
  const learnersById = useMemo(
    () => new Map(learners.map((learner) => [learner.id, learner])),
    [learners]
  );
  const allDecisions = adaptiveDecisions.map((decision) => {
    const learner = learnersById.get(decision.learnerId);
    return {
      ...decision,
      learnerName: learner?.name || decision.learnerId,
      cefrLevel: learner?.cefrLevel || "",
    };
  });
  const learnerReport = useMemo(() => {
    if (!learnerDetail) return null;
    const events = learnerDetail.learningEvents || [];
    const decisions = (learnerDetail.adaptiveDecisions || []).map((decision) => ({
      ...decision,
      targetedExercises: decision.targetedExerciseIds
        .map((exerciseId) => exerciseBank.find((exercise) => exercise.id === exerciseId))
        .filter(Boolean),
    }));

    return {
      learner: learnerDetail,
      latestEvents: events.slice(0, 8),
      decisions,
      eventCount: events.length,
      weaknessCount: learnerDetail.skillWeaknesses?.length || 0,
    };
  }, [exerciseBank, learnerDetail]);

  const views = [
    { id: "overview", label: t("admin.overview"), icon: BarChart3 },
    { id: "learners", label: t("admin.learners"), icon: Users },
    { id: "classes", label: t("admin.classes"), icon: GraduationCap },
    { id: "content", label: t("admin.content"), icon: BookOpen },
    { id: "exercises", label: t("admin.exercises"), icon: Layers },
    { id: "adaptive", label: t("admin.adaptive"), icon: Brain },
  ];

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [me, learnersData, resourcesData, exercisesData, reportData, decisionsData] =
        await Promise.all([
          apiClient.me(),
          apiClient.learners(),
          apiClient.resources(),
          apiClient.exercises(),
          apiClient.platformReport(),
          apiClient.adaptiveDecisions(),
        ]);

      setAccount(me.account);
      setLearners(learnersData.learners);
      setResources(resourcesData.resources);
      setExerciseBank(exercisesData.exercises);
      setPlatformReport(reportData.report);
      setAdaptiveDecisions(decisionsData.decisions);
      setSelectedLearnerId((current) => current || learnersData.learners[0]?.id || "");
      setSelectedClassId((current) => current || learnersData.learners[0]?.classId || "");
      setResourceDraft((current) => ({
        ...current,
        id: current.id || `resource-${Date.now()}`,
      }));
      setExerciseDraft((current) => ({
        ...current,
        id: current.id || `exercise-${Date.now()}`,
        resourceId: current.resourceId || resourcesData.resources[0]?.id || "",
      }));
    } catch (error) {
      setStatusMessage(t("admin.apiLoginRequired", "Please log in with a backend account first."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedLearnerId) return;
    apiClient
      .learner(selectedLearnerId)
      .then((data) => setLearnerDetail(data.learner))
      .catch(() => setLearnerDetail(null));
  }, [selectedLearnerId]);

  const saveResource = async (event) => {
    event.preventDefault();
    const exists = resources.some((resource) => resource.id === resourceDraft.id);
    if (exists) {
      await apiClient.updateResource(resourceDraft.id, resourceDraft);
      setStatusMessage(t("admin.resourceSaved", "Resource saved."));
    } else {
      await apiClient.createResource(resourceDraft);
      setStatusMessage(t("admin.resourceCreated", "Resource created."));
    }
    await loadAdminData();
  };

  const saveExercise = async (event) => {
    event.preventDefault();
    const exists = exerciseBank.some((exercise) => exercise.id === exerciseDraft.id);
    const payload = {
      ...exerciseDraft,
      sequence: Number(exerciseDraft.sequence),
      estimatedMinutes: Number(exerciseDraft.estimatedMinutes),
      prompt: exerciseDraft.prompt || "",
      expectedAnswer: exerciseDraft.expectedAnswer || "",
      choices: Array.isArray(exerciseDraft.choices)
        ? exerciseDraft.choices
        : String(exerciseDraft.choices || "")
            .split("\n")
            .map((choice) => choice.trim())
            .filter(Boolean),
      scoringRule: normalizeDraftRule(exerciseDraft.scoringRule),
      supportText: exerciseDraft.supportText || "",
    };
    if (exists) {
      await apiClient.updateExercise(payload.id, payload);
      setStatusMessage(t("admin.exerciseSaved", "Exercise saved."));
    } else {
      await apiClient.createExercise(payload);
      setStatusMessage(t("admin.exerciseCreated", "Exercise created."));
    }
    await loadAdminData();
  };

  const canEditContent = account?.role === "platform_admin";

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
            {account
              ? `${account.displayName} · ${domainLabel(account.role)}`
              : t("admin.apiLoginRequired", "Please log in with a backend account first.")}
          </div>
        </header>

        {statusMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
            {statusMessage}
          </div>
        )}

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

        {isLoading && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            {t("admin.loading", "Loading admin data...")}
          </div>
        )}

        {!isLoading && activeView === "overview" && platformReport && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={Users}
                label={t("admin.syntheticLearners")}
                value={platformReport.learnerCount}
                detail={t("admin.classesCount", { count: classReports.length })}
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
                  {(platformReport.commonErrorPatterns || []).slice(0, 6).map((item) => (
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
                  {(platformReport.weaknessDistribution || []).map((item) => (
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

        {!isLoading && activeView === "learners" && learnerReport && (
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
                      {learner.cefrLevel} · {learner.className} ·{" "}
                      {t("learnerDashboard.accuracy", { value: learner.accuracy })}
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
                    {learnerReport.learner.cefrLevel} ·{" "}
                    {t("learnerDashboard.complete", {
                      value: learnerReport.learner.progressPercent,
                    })}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <StatCard icon={Activity} label={t("admin.events")} value={learnerReport.eventCount} />
                  <StatCard
                    icon={BarChart3}
                    label={t("admin.accuracy")}
                    value={`${learnerReport.learner.accuracy}%`}
                  />
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
            </section>
          </div>
        )}

        {!isLoading && activeView === "classes" && classReport && (
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
                {classReports.map((classItem) => (
                  <option key={classItem.classId} value={classItem.classId}>
                    {classItem.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatCard icon={Users} label={t("admin.students")} value={classReport.studentCount} />
              <StatCard icon={BarChart3} label={t("admin.progress")} value={`${classReport.averageProgress}%`} />
              <StatCard icon={Activity} label={t("admin.accuracy")} value={`${classReport.averageAccuracy}%`} />
              <StatCard
                icon={Database}
                label={t("admin.avgResponse")}
                value={`${(classReport.averageResponseMs / 1000).toFixed(1)}s`}
              />
            </div>
          </section>
        )}

        {!isLoading && activeView === "content" && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={saveResource}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{t("admin.resourceEditor", "Resource editor")}</h2>
                <button
                  type="button"
                  onClick={() => setResourceDraft({ ...emptyResource, id: `resource-${Date.now()}` })}
                  className="rounded-md bg-gray-100 p-2 dark:bg-gray-800"
                  disabled={!canEditContent}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <TextInput
                  label="ID"
                  value={resourceDraft.id}
                  onChange={(value) => setResourceDraft({ ...resourceDraft, id: value })}
                />
                <TextInput
                  label={t("admin.titleField", "Title")}
                  value={resourceDraft.title}
                  onChange={(value) => setResourceDraft({ ...resourceDraft, title: value })}
                />
                <SelectInput
                  label={t("admin.type")}
                  value={resourceDraft.type}
                  onChange={(value) => setResourceDraft({ ...resourceDraft, type: value })}
                >
                  {["book", "audio", "grammar", "vocabulary"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </SelectInput>
                <SelectInput
                  label={t("admin.cefr")}
                  value={resourceDraft.cefrLevel}
                  onChange={(value) => setResourceDraft({ ...resourceDraft, cefrLevel: value })}
                >
                  {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </SelectInput>
                <SelectInput
                  label={t("admin.skill")}
                  value={resourceDraft.skillArea}
                  onChange={(value) => setResourceDraft({ ...resourceDraft, skillArea: value })}
                >
                  {skillAreas.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {domainLabel(skill.id)}
                    </option>
                  ))}
                </SelectInput>
                <TextInput
                  label={t("admin.sourceUrl", "Source URL")}
                  value={resourceDraft.sourceUrl || ""}
                  onChange={(value) => setResourceDraft({ ...resourceDraft, sourceUrl: value })}
                />
                <TextInput
                  label={t("admin.descriptionField", "Description")}
                  value={resourceDraft.description}
                  onChange={(value) => setResourceDraft({ ...resourceDraft, description: value })}
                />
                <button
                  type="submit"
                  disabled={!canEditContent}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-gray-950"
                >
                  <Save className="h-4 w-4" />
                  {t("admin.save", "Save")}
                </button>
              </div>
            </form>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {resources.map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => setResourceDraft(resource)}
                  className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-900"
                >
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
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Pencil className="h-4 w-4" />
                    {domainLabel(resource.skillArea)}
                  </p>
                </button>
              ))}
            </section>
          </div>
        )}

        {!isLoading && activeView === "exercises" && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={saveExercise}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{t("admin.exerciseEditor", "Exercise editor")}</h2>
                <button
                  type="button"
                  onClick={() =>
                    setExerciseDraft({
                      ...emptyExercise,
                      id: `exercise-${Date.now()}`,
                      resourceId: resources[0]?.id || "",
                    })
                  }
                  className="rounded-md bg-gray-100 p-2 dark:bg-gray-800"
                  disabled={!canEditContent}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <TextInput
                  label="ID"
                  value={exerciseDraft.id}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, id: value })}
                />
                <TextInput
                  label={t("admin.titleField", "Title")}
                  value={exerciseDraft.title}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, title: value })}
                />
                <TextInput
                  label={t("admin.titleKey", "Title key")}
                  value={exerciseDraft.titleKey}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, titleKey: value })}
                />
                <TextInput
                  label={t("admin.sequence", "Sequence")}
                  type="number"
                  value={exerciseDraft.sequence}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, sequence: value })}
                />
                <SelectInput
                  label={t("admin.cefr")}
                  value={exerciseDraft.cefrLevel}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, cefrLevel: value })}
                >
                  {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </SelectInput>
                <SelectInput
                  label={t("admin.difficulty")}
                  value={exerciseDraft.difficulty}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, difficulty: value })}
                >
                  {["easy", "medium", "hard"].map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {t(`common.${difficulty}`, difficulty)}
                    </option>
                  ))}
                </SelectInput>
                <SelectInput
                  label={t("admin.interactionType", "Interaction type")}
                  value={exerciseDraft.interactionType}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, interactionType: value })}
                >
                  {interactionTypes.map((interactionType) => (
                    <option key={interactionType} value={interactionType}>
                      {t(`domain.${interactionType}`, interactionType)}
                    </option>
                  ))}
                </SelectInput>
                <SelectInput
                  label={t("admin.scoringRule", "Scoring rule")}
                  value={exerciseDraft.scoringRule?.type || "self_assessed"}
                  onChange={(value) =>
                    setExerciseDraft({
                      ...exerciseDraft,
                      scoringRule: { ...(exerciseDraft.scoringRule || {}), type: value },
                    })
                  }
                >
                  {scoringRuleTypes.map((ruleType) => (
                    <option key={ruleType} value={ruleType}>
                      {t(`domain.${ruleType}`, ruleType)}
                    </option>
                  ))}
                </SelectInput>
                <SelectInput
                  label={t("admin.skill")}
                  value={exerciseDraft.skillArea}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, skillArea: value })}
                >
                  {skillAreas.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {domainLabel(skill.id)}
                    </option>
                  ))}
                </SelectInput>
                <TextInput
                  label={t("admin.subskill")}
                  value={exerciseDraft.subskill}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, subskill: value })}
                />
                <SelectInput
                  label={t("admin.resources")}
                  value={exerciseDraft.resourceId}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, resourceId: value })}
                >
                  {resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resourceTitle(resource)}
                    </option>
                  ))}
                </SelectInput>
                <TextInput
                  label={t("admin.minutes")}
                  type="number"
                  value={exerciseDraft.estimatedMinutes}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, estimatedMinutes: value })}
                />
                <TextAreaInput
                  label={t("admin.promptField", "Prompt")}
                  value={exerciseDraft.prompt}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, prompt: value })}
                />
                <TextAreaInput
                  label={t("admin.expectedAnswer", "Expected answer")}
                  value={exerciseDraft.expectedAnswer}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, expectedAnswer: value })}
                />
                <TextAreaInput
                  label={t("admin.choices", "Choices")}
                  value={choicesDraftValue(exerciseDraft.choices)}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, choices: value })}
                />
                <TextInput
                  label={t("admin.minLength", "Minimum length")}
                  type="number"
                  value={exerciseDraft.scoringRule?.minLength || 0}
                  onChange={(value) =>
                    setExerciseDraft({
                      ...exerciseDraft,
                      scoringRule: {
                        ...(exerciseDraft.scoringRule || {}),
                        minLength: value,
                      },
                    })
                  }
                />
                <TextAreaInput
                  label={t("admin.keywords", "Keywords")}
                  value={keywordsDraftValue(exerciseDraft.scoringRule)}
                  onChange={(value) =>
                    setExerciseDraft({
                      ...exerciseDraft,
                      scoringRule: {
                        ...(exerciseDraft.scoringRule || {}),
                        keywords: value,
                      },
                    })
                  }
                />
                <TextAreaInput
                  label={t("admin.supportText", "Support text")}
                  value={exerciseDraft.supportText}
                  onChange={(value) => setExerciseDraft({ ...exerciseDraft, supportText: value })}
                />
                <button
                  type="submit"
                  disabled={!canEditContent}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-gray-950"
                >
                  <Save className="h-4 w-4" />
                  {t("admin.save", "Save")}
                </button>
              </div>
            </form>

            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-4 text-xl font-semibold">{t("admin.exerciseBank")}</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <tr>
                      <th className="py-3">{t("admin.exercise")}</th>
                      <th>{t("admin.cefr")}</th>
                      <th>{t("admin.difficulty")}</th>
                      <th>{t("admin.interactionType", "Interaction type")}</th>
                      <th>{t("admin.skill")}</th>
                      <th>{t("admin.subskill")}</th>
                      <th>{t("admin.minutes")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exerciseBank.map((exercise) => (
                      <tr
                        key={exercise.id}
                        onClick={() => setExerciseDraft(exercise)}
                        className="cursor-pointer border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                      >
                        <td className="py-3 font-medium">{exerciseTitle(exercise)}</td>
                        <td>{exercise.cefrLevel}</td>
                        <td>{t(`common.${exercise.difficulty}`, exercise.difficulty)}</td>
                        <td>{t(`domain.${exercise.interactionType}`, exercise.interactionType)}</td>
                        <td>{domainLabel(exercise.skillArea)}</td>
                        <td>{domainLabel(exercise.subskill)}</td>
                        <td>{exercise.estimatedMinutes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {!isLoading && activeView === "adaptive" && (
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
