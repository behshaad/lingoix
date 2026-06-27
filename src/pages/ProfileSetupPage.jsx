import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../services/apiClient";
import {
  consumeLearnerEntryIntent,
  getLearnerEntryIntent,
  refreshAccountSession,
} from "../services/authSession";

const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const goals = [
  { value: "conversation", labelKey: "profileSetup.goals.conversation" },
  { value: "exam", labelKey: "profileSetup.goals.exam" },
  { value: "travel", labelKey: "profileSetup.goals.travel" },
  { value: "work-study", labelKey: "profileSetup.goals.workStudy" },
  { value: "general", labelKey: "profileSetup.goals.general" },
];

const ProfileSetupPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === "fa";
  const [form, setForm] = useState({
    name: "",
    nativeLanguage: "Persian",
    targetLanguage: "German",
    cefrLevel: "A1",
    goal: "conversation",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    apiClient
      .me()
      .then(({ account }) => {
        if (!isMounted) return;
        if (account.learnerId) navigate(getLearnerEntryIntent(), { replace: true });
        setForm((current) => ({
          ...current,
          name: account.displayName || account.email?.split("@")[0] || "",
        }));
      })
      .catch(() => navigate("/login", { replace: true }));
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError(t("profileSetup.nameRequired", "Please enter your name."));
      return;
    }

    setIsSubmitting(true);
    try {
      const { account } = await apiClient.createLearnerProfile(form);
      refreshAccountSession(account);
      navigate(consumeLearnerEntryIntent(), { replace: true });
    } catch (submitError) {
      setError(t("profileSetup.saveFailed", "Could not save your learner profile."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-white px-4 py-10 text-gray-950 dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8"
    >
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          {t("profileSetup.eyebrow", "Learner profile setup")}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          {t("profileSetup.title", "Set up your learner profile")}
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          {t(
            "profileSetup.subtitle",
            "Tell Lingoix enough about your German learning goal to build your first learning path."
          )}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <label className="block">
            <span className="text-sm font-medium">{t("profileSetup.name", "Name")}</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">
                {t("profileSetup.nativeLanguage", "Native language")}
              </span>
              <select
                value={form.nativeLanguage}
                onChange={(event) => updateField("nativeLanguage", event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                <option value="Persian">{t("profileSetup.languages.persian", "Persian")}</option>
                <option value="English">{t("profileSetup.languages.english", "English")}</option>
                <option value="German">{t("profileSetup.languages.german", "German")}</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">
                {t("profileSetup.targetLanguage", "Target language")}
              </span>
              <select
                value={form.targetLanguage}
                onChange={(event) => updateField("targetLanguage", event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                <option value="German">{t("profileSetup.languages.german", "German")}</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">{t("profileSetup.cefrLevel", "CEFR level")}</span>
              <select
                value={form.cefrLevel}
                onChange={(event) => updateField("cefrLevel", event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                {cefrLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">{t("profileSetup.goal", "Goal")}</span>
              <select
                value={form.goal}
                onChange={(event) => updateField("goal", event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                {goals.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {t(goal.labelKey, goal.value)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-950"
          >
            {isSubmitting
              ? t("profileSetup.saving", "Saving...")
              : t("profileSetup.submit", "Create learner profile")}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ProfileSetupPage;
