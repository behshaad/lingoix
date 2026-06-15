import {
  getLearnerDetailReport,
  getLearners,
  getPlatformReport,
} from "./services/learningDataService";

test("provides a synthetic learner dataset for admin and adaptive reports", () => {
  const learners = getLearners();
  const platformReport = getPlatformReport();
  const learnerReport = getLearnerDetailReport("learner-001");

  expect(learners).toHaveLength(100);
  expect(platformReport.eventCount).toBeGreaterThan(1000);
  expect(platformReport.exerciseCount).toBeGreaterThan(20);
  expect(learnerReport.learner.targetLanguage).toBe("German");
  expect(learnerReport.decisions.length).toBeGreaterThan(0);
});
