const USER_STORAGE_KEY = "user";
const LEARNER_ENTRY_INTENT_KEY = "lingoixLearnerEntryIntent";
export const AUTH_SESSION_EVENT = "lingoix-auth-session";

export const adminRoles = ["teacher", "school_admin", "platform_admin"];

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
  profilePic: `https://i.pravatar.cc/150?u=${account.email}`,
});

export const loadStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const saveAccountSession = (account) => {
  const user = publicUserFromAccount(account);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT, { detail: user }));
  return user;
};

export const clearAccountSession = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT, { detail: null }));
};

export const canAccessRole = (account, allowedRoles = []) =>
  Boolean(account && (allowedRoles.length === 0 || allowedRoles.includes(account.role)));

export const saveLearnerEntryIntent = (path) => {
  if (path) sessionStorage.setItem(LEARNER_ENTRY_INTENT_KEY, path);
};

const normalizeLearnerEntryIntent = (path) => {
  if (!path || ["/login", "/signup", "/profile-setup"].includes(path)) return "/dashboard";
  return path;
};

export const getLearnerEntryIntent = () =>
  normalizeLearnerEntryIntent(sessionStorage.getItem(LEARNER_ENTRY_INTENT_KEY));

export const consumeLearnerEntryIntent = () => {
  const path = getLearnerEntryIntent();
  sessionStorage.removeItem(LEARNER_ENTRY_INTENT_KEY);
  return path;
};
