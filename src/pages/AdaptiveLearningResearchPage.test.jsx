import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdaptiveLearningResearchPage from "./AdaptiveLearningResearchPage";
import i18n from "../i18n";
import { apiClient } from "../services/apiClient";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => {
    const React = require("react");
    return React.createElement("a", { href: to, ...props }, children);
  },
}));

jest.mock("../services/apiClient", () => ({
  apiClient: {
    adaptiveLearningResearch: jest.fn(),
    adaptiveLearningResearchFigureUrl: (fileName) => `/figures/${fileName}`,
    adaptiveLearningResearchReportUrl: () => "/report",
  },
}));

const researchPayload = {
  manifest: { learners: 100, interactions: 34837 },
  figures: ["mastery_histogram.png"],
  reportMarkdown: "# Report",
  tables: {
    classification: [
      { model: "Random Forest", status: "trained", accuracy: 0.92, f1: 0.91 },
      { model: "SVM", status: "trained", accuracy: 0.84, f1: 0.83 },
    ],
    regression: [
      { model: "Linear Regression", status: "trained", rmse: 1.14, r2: 0.98 },
    ],
    clustering: [
      { model: "K-Means", cluster_count: 5, silhouette_score: 0.16 },
    ],
    statisticalTests: [
      { metric: "mastery_growth", adaptive_mean: 83, traditional_mean: 75 },
    ],
    archetypes: [
      { learner_archetype: "balanced_learner", count: 25 },
    ],
    weaknesses: [
      { weakness_category: "grammar_weakness", count: 20 },
    ],
    featureImportance: [
      { feature: "grammar_error_rate", importance: 0.09 },
    ],
    ruleDecisions: [
      { learner_id: "L001", engine: "rule_based", target_skill: "grammar" },
    ],
  },
};

beforeEach(async () => {
  jest.clearAllMocks();
  apiClient.adaptiveLearningResearch.mockResolvedValue({ research: researchPayload });
  await i18n.changeLanguage("en");
});

test("filters research tables by selected model family", async () => {
  render(<AdaptiveLearningResearchPage />);

  expect(await screen.findByText("Model selector")).toBeInTheDocument();
  expect(screen.getByText("Classification Results")).toBeInTheDocument();
  expect(screen.getByText("Regression Results")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Classifier models" }));
  expect(screen.getByText("Weakness classification view")).toBeInTheDocument();
  expect(screen.getByText("Feature Importance")).toBeInTheDocument();
  expect(screen.queryByText("Regression Results")).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Regression models" }));
  expect(screen.getByText("Outcome regression view")).toBeInTheDocument();
  expect(screen.getByText("Regression Results")).toBeInTheDocument();
  expect(screen.getByText("Statistical Tests")).toBeInTheDocument();
  expect(screen.queryByText("Feature Importance")).not.toBeInTheDocument();
});
