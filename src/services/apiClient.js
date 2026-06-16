const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api";
const SESSION_TOKEN_KEY = "lingoixSessionToken";

const request = async (path, options = {}) => {
  const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);
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
  async login(email, password) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.sessionToken) {
      localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
    }
    return data;
  },

  async logout() {
    try {
      return await request("/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
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
