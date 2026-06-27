const USER_STORAGE_KEY = "user";
const LEARNER_ENTRY_INTENT_KEY = "lingoixLearnerEntryIntent";
export const AUTH_SESSION_EVENT = "lingoix-auth-session";

export const adminRoles = ["teacher", "school_admin", "platform_admin"];
const validLearnerEntryPaths = ["/dashboard", "/learning-path", "/resources", "/practice"];
const authFlowPaths = ["/login", "/signup", "/profile-setup"];

export const accountHomePath = (account) => {
  if (!account) return "/login";
  if (account.role === "learner") return account.learnerId ? "/dashboard" : "/profile-setup";
  if (adminRoles.includes(account.role)) return "/admin";
  return "/";
};

export const publicUserFromAccount = (account) => ({
  email: account.email,
  name: account.displayName,
  role: account.role,
  learnerId: account.learnerId,
  profilePic: account.avatarUrl || "",
  phone: account.phone || "",
  bio: account.bio || "",
});

export const loadStoredUser = () => {
  try {
    const storedUser =
      localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const saveAccountSession = (account, remember = true) => {
  const user = publicUserFromAccount(account);
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  otherStorage.removeItem(USER_STORAGE_KEY);
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT, { detail: user }));
  return user;
};

export const refreshAccountSession = (account) => {
  const isPersistent = Boolean(localStorage.getItem(USER_STORAGE_KEY));
  const isBrowserSession = Boolean(sessionStorage.getItem(USER_STORAGE_KEY));
  return saveAccountSession(account, isPersistent || !isBrowserSession);
};

export const clearAccountSession = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT, { detail: null }));
};

export const canAccessRole = (account, allowedRoles = []) =>
  Boolean(account && (allowedRoles.length === 0 || allowedRoles.includes(account.role)));

const pathFromValue = (value) => {
  if (!value) return "";
  try {
    const parsed = new URL(value, window.location.origin);
    if (parsed.origin !== window.location.origin) return "";
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return "";
  }
};

export const normalizeLearnerEntryIntent = (path) => {
  const normalized = pathFromValue(path);
  const pathname = normalized.split("?")[0];
  if (!normalized || authFlowPaths.includes(pathname)) return "/dashboard";
  return validLearnerEntryPaths.includes(pathname) ? normalized : "/dashboard";
};

export const isValidLearnerEntryIntent = (path) => {
  const normalized = pathFromValue(path);
  const pathname = normalized.split("?")[0];
  return Boolean(normalized && validLearnerEntryPaths.includes(pathname));
};

export const saveLearnerEntryIntent = (path) => {
  const normalized = normalizeLearnerEntryIntent(path);
  if (isValidLearnerEntryIntent(normalized)) {
    sessionStorage.setItem(LEARNER_ENTRY_INTENT_KEY, normalized);
  }
};

export const getLearnerEntryIntent = () =>
  normalizeLearnerEntryIntent(sessionStorage.getItem(LEARNER_ENTRY_INTENT_KEY));

export const consumeLearnerEntryIntent = () => {
  const path = getLearnerEntryIntent();
  sessionStorage.removeItem(LEARNER_ENTRY_INTENT_KEY);
  return path;
};

export const accountLandingPath = (account, requestedPath) => {
  if (!account) return "/login";
  if (account.role !== "learner") return accountHomePath(account);
  if (isValidLearnerEntryIntent(requestedPath)) {
    saveLearnerEntryIntent(requestedPath);
  }
  return account.learnerId ? consumeLearnerEntryIntent() : "/profile-setup";
};
