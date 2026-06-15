const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
  login(email, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return request("/auth/logout", { method: "POST" });
  },

  me() {
    return request("/auth/me");
  },

  learners() {
    return request("/learners");
  },

  learner(learnerId) {
    return request(`/learners/${learnerId}`);
  },

  resources() {
    return request("/resources");
  },

  exercises() {
    return request("/exercises");
  },

  platformReport() {
    return request("/reports/platform");
  },

  adaptiveDecisions() {
    return request("/adaptive-decisions");
  },

  reviewAdaptiveDecision(decisionId, status, teacherNote) {
    return request(`/adaptive-decisions/${decisionId}/review`, {
      method: "PUT",
      body: JSON.stringify({ status, teacherNote }),
    });
  },

  collectLearningEvent(event) {
    return request("/learning-events", {
      method: "POST",
      body: JSON.stringify(event),
    });
  },
};
