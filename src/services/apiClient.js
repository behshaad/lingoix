const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api";
const SESSION_TOKEN_KEY = "lingoixSessionToken";

const getSessionToken = () =>
  localStorage.getItem(SESSION_TOKEN_KEY) || sessionStorage.getItem(SESSION_TOKEN_KEY);

const saveSessionToken = (token, remember = true) => {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  otherStorage.removeItem(SESSION_TOKEN_KEY);
  storage.setItem(SESSION_TOKEN_KEY, token);
};

const clearSessionToken = () => {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
};

const request = async (path, options = {}) => {
  const sessionToken = getSessionToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "api_error");
  }

  return data;
};

export const apiClient = {
  async login(email, password, remember = true) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, remember }),
    });
    if (data.sessionToken) {
      saveSessionToken(data.sessionToken, remember);
    }
    return data;
  },

  async signup(email, password) {
    const data = await request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.sessionToken) {
      saveSessionToken(data.sessionToken, true);
    }
    return data;
  },

  async logout() {
    try {
      return await request("/auth/logout", { method: "POST" });
    } finally {
      clearSessionToken();
    }
  },

  me() {
    return request("/auth/me");
  },

  updateAccountProfile(profile) {
    return request("/account/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  },

  learners() {
    return request("/learners");
  },

  learner(learnerId) {
    return request(`/learners/${learnerId}`);
  },

  createLearnerProfile(profile) {
    return request("/learners/profile", {
      method: "POST",
      body: JSON.stringify(profile),
    });
  },

  resources() {
    return request("/resources");
  },

  createResource(resource) {
    return request("/resources", {
      method: "POST",
      body: JSON.stringify(resource),
    });
  },

  updateResource(resourceId, resource) {
    return request(`/resources/${resourceId}`, {
      method: "PUT",
      body: JSON.stringify(resource),
    });
  },

  archiveResource(resourceId) {
    return request(`/resources/${resourceId}`, {
      method: "DELETE",
    });
  },

  exercises() {
    return request("/exercises");
  },

  createExercise(exercise) {
    return request("/exercises", {
      method: "POST",
      body: JSON.stringify(exercise),
    });
  },

  updateExercise(exerciseId, exercise) {
    return request(`/exercises/${exerciseId}`, {
      method: "PUT",
      body: JSON.stringify(exercise),
    });
  },

  platformReport() {
    return request("/reports/platform");
  },

  adaptiveMetrics() {
    return request("/reports/adaptive-metrics");
  },

  adaptiveDecisions() {
    return request("/adaptive-decisions");
  },

  reviewAdaptiveDecision(decisionId, status, teacherNote, options = {}) {
    return request(`/adaptive-decisions/${decisionId}/review`, {
      method: "PUT",
      body: JSON.stringify({ status, teacherNote, ...options }),
    });
  },

  collectLearningEvent(event) {
    return request("/learning-events", {
      method: "POST",
      body: JSON.stringify(event),
    });
  },

  adaptiveLearningResearch() {
    return request("/research/adaptive-learning");
  },

  adaptiveLearningResearchFigureUrl(fileName) {
    return `${API_BASE_URL}/research/adaptive-learning/figures/${encodeURIComponent(fileName)}`;
  },

  adaptiveLearningResearchReportUrl() {
    return `${API_BASE_URL}/research/adaptive-learning/report`;
  },
};
