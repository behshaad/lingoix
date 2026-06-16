import { apiClient } from "./apiClient";

export const learningEventStatus = {
  idle: "idle",
  saving: "saving",
  saved: "saved",
  failed: "failed",
};

const nowMs = () => Date.now();

export const createAttemptTimer = () => ({
  startedAt: nowMs(),
  reset() {
    this.startedAt = nowMs();
  },
  elapsedMs() {
    return Math.max(250, nowMs() - this.startedAt);
  },
});

export const collectLearningEvent = async (event) => {
  const payload = {
    type: "answer_submitted",
    hintsUsed: 0,
    retries: 0,
    occurredAt: new Date().toISOString(),
    ...event,
  };

  return apiClient.collectLearningEvent(payload);
};

export const eventStatusLabelKey = (status) => {
  if (status === learningEventStatus.saving) return "learningEvents.saving";
  if (status === learningEventStatus.saved) return "learningEvents.saved";
  if (status === learningEventStatus.failed) return "learningEvents.failed";
  return null;
};
