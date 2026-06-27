const STORAGE_KEY = "lingoixRememberedLoginEmails";
const MAX_REMEMBERED_EMAILS = 5;

export const normalizeRememberedEmail = (email = "") => String(email).trim().toLowerCase();

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const getRememberedLoginEmails = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter(isValidEmail).slice(0, MAX_REMEMBERED_EMAILS) : [];
  } catch {
    return [];
  }
};

export const rememberLoginEmail = (email) => {
  const normalized = normalizeRememberedEmail(email);
  if (!isValidEmail(normalized)) return getRememberedLoginEmails();

  const next = [
    normalized,
    ...getRememberedLoginEmails().filter((item) => item !== normalized),
  ].slice(0, MAX_REMEMBERED_EMAILS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const forgetRememberedLoginEmail = (email) => {
  const normalized = normalizeRememberedEmail(email);
  const next = getRememberedLoginEmails().filter((item) => item !== normalized);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};
