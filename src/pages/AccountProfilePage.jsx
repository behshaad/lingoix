import { useEffect, useState } from "react";
import { Camera, LogOut, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AccountAvatar from "../components/Account/AccountAvatar";
import { apiClient } from "../services/apiClient";
import { clearAccountSession, refreshAccountSession } from "../services/authSession";

const emptyForm = {
  displayName: "",
  email: "",
  role: "",
  phone: "",
  bio: "",
  avatarUrl: "",
};

const AccountProfilePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("neutral");
  const isRtl = i18n.language === "fa";

  const setFeedback = (translationKey, tone = "neutral", fallback) => {
    setMessage(t(translationKey, fallback));
    setMessageTone(tone);
  };

  const validateForm = () => {
    const displayName = form.displayName.trim();
    const phone = form.phone.trim();
    const bio = form.bio.trim();

    if (!displayName) {
      setFeedback("accountProfile.nameRequired", "error", "Display name is required.");
      return false;
    }
    if (displayName.length < 2) {
      setFeedback("accountProfile.nameTooShort", "error", "Display name must be at least 2 characters.");
      return false;
    }
    if (displayName.length > 80) {
      setFeedback("accountProfile.nameTooLong", "error", "Display name must be 80 characters or fewer.");
      return false;
    }
    if (phone.length > 40) {
      setFeedback("accountProfile.phoneTooLong", "error", "Phone must be 40 characters or fewer.");
      return false;
    }
    if (phone && !/^[0-9+\-()\s]*$/.test(phone)) {
      setFeedback("accountProfile.phoneInvalid", "error", "Use only digits, spaces, +, -, and parentheses.");
      return false;
    }
    if (bio.length > 280) {
      setFeedback("accountProfile.bioTooLong", "error", "Bio must be 280 characters or fewer.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    let isMounted = true;
    apiClient
      .me()
      .then(({ account }) => {
        if (!isMounted) return;
        refreshAccountSession(account);
        setForm({
          displayName: account.displayName || "",
          email: account.email || "",
          role: account.role || "",
          phone: account.phone || "",
          bio: account.bio || "",
          avatarUrl: account.avatarUrl || "",
        });
        setStatus("ready");
      })
      .catch(() => {
        if (isMounted) navigate("/login");
      });
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
    setMessageTone("neutral");
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback("accountProfile.imageTypeError", "error", "Please choose an image file.");
      return;
    }
    if (file.size > 700 * 1024) {
      setFeedback("accountProfile.imageSizeError", "error", "Please choose an image smaller than 700 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateField("avatarUrl", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setStatus("saving");
    try {
      const { account } = await apiClient.updateAccountProfile({
        displayName: form.displayName.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
        avatarUrl: form.avatarUrl,
      });
      refreshAccountSession(account);
      setForm((current) => ({
        ...current,
        displayName: account.displayName || current.displayName,
        phone: account.phone || "",
        bio: account.bio || "",
        avatarUrl: account.avatarUrl || "",
      }));
      setFeedback("accountProfile.saved", "success", "Profile saved.");
      setStatus("ready");
    } catch (error) {
      setFeedback(`accountProfile.errors.${error.message}`, "error", t("accountProfile.saveFailed"));
      setStatus("ready");
    }
  };

  const handleLogout = async () => {
    await apiClient.logout().catch(() => {});
    clearAccountSession();
    navigate("/");
  };

  if (status === "loading") {
    return (
      <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-gray-50 px-6 py-10 text-gray-950 dark:bg-gray-950 dark:text-white">
        <div className="mx-auto max-w-5xl text-sm text-gray-600 dark:text-gray-300">
          {t("accountProfile.loading")}
        </div>
      </main>
    );
  }

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-gray-50 px-6 py-8 text-gray-950 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {t("accountProfile.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal">{t("accountProfile.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t("accountProfile.subtitle")}
          </p>
        </header>

        <section className="grid gap-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-5 dark:bg-gray-950">
              <AccountAvatar
                src={form.avatarUrl}
                name={form.displayName || form.email}
                alt={t("accountProfile.avatarAlt")}
                size="xl"
              />
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                <Camera className="h-4 w-4" />
                {t("accountProfile.uploadPhoto")}
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              </label>
              {form.avatarUrl && (
                <button
                  type="button"
                  onClick={() => updateField("avatarUrl", "")}
                  className="mt-2 text-sm text-gray-500 hover:text-red-600 dark:text-gray-400"
                >
                  {t("accountProfile.removePhoto")}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
          </div>

          <div className="grid gap-4">
            <label className="block text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-200">{t("accountProfile.displayName")}</span>
              <input
                value={form.displayName}
                onChange={(event) => updateField("displayName", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-200">{t("accountProfile.email")}</span>
                <input
                  value={form.email}
                  disabled
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-200">{t("accountProfile.role")}</span>
                <input
                  value={t(`domain.${form.role}`, form.role)}
                  disabled
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-200">{t("accountProfile.phone")}</span>
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder={t("accountProfile.phonePlaceholder")}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-200">{t("accountProfile.bio")}</span>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                maxLength={280}
                placeholder={t("accountProfile.bioPlaceholder")}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                {t("accountProfile.bioCounter", { count: form.bio.length })}
              </span>
            </label>

            {message && (
              <p
                role={messageTone === "error" ? "alert" : "status"}
                className={`rounded-md px-3 py-2 text-sm ${
                  messageTone === "error"
                    ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200"
                    : messageTone === "success"
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-200"
                }`}
              >
                {message}
              </p>
            )}

            <div>
              <button
                type="button"
                onClick={handleSave}
                disabled={status === "saving"}
                className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-950"
              >
                <Save className="h-4 w-4" />
                {status === "saving" ? t("accountProfile.saving") : t("accountProfile.save")}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AccountProfilePage;
