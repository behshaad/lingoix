import {
  getLearnerDetailReport,
  getLearners,
  getPlatformReport,
} from "./services/learningDataService";
const { validateAccountProfileInput } = require("../server/accountProfileValidation");

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

test("validates account profile fields before saving", () => {
  expect(
    validateAccountProfileInput({
      displayName: "A",
      phone: "+98 912 345 6789",
      bio: "Short bio",
    }).error
  ).toBe("display_name_too_short");

  expect(
    validateAccountProfileInput({
      displayName: "Arman Rahimi",
      phone: "call me maybe",
      bio: "Short bio",
    }).error
  ).toBe("invalid_phone");

  expect(
    validateAccountProfileInput({
      displayName: "Arman Rahimi",
      phone: "+98 912 345 6789",
      bio: "x".repeat(281),
    }).error
  ).toBe("bio_too_long");

  expect(
    validateAccountProfileInput({
      displayName: "  Arman Rahimi  ",
      phone: " +98 (912) 345-6789 ",
      bio: "  Short bio  ",
    })
  ).toEqual({
    value: {
      displayName: "Arman Rahimi",
      phone: "+98 (912) 345-6789",
      bio: "Short bio",
      avatarUrl: null,
    },
  });
});
