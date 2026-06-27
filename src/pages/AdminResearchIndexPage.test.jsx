import { render, screen } from "@testing-library/react";
import AdminResearchIndexPage from "./AdminResearchIndexPage";
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
    adaptiveLearningResearchTableUrl: (fileName) => `/tables/${fileName}`,
    adaptiveLearningResearchDataUrl: (fileName) => `/data/${fileName}`,
    adaptiveLearningResearchReportUrl: () => "/report",
  },
}));

beforeEach(async () => {
  jest.clearAllMocks();
  await i18n.changeLanguage("en");
});

test("renders research artifact navigation and generated output links", async () => {
  apiClient.adaptiveLearningResearch.mockResolvedValueOnce({
    research: {
      manifest: { learners: 100, interactions: 34837 },
      figures: ["mastery_histogram.png", "cluster_pca.png"],
    },
  });

  render(<AdminResearchIndexPage />);

  expect(await screen.findByText("Generated research artifacts")).toBeInTheDocument();
  expect(await screen.findByText("mastery_histogram.png")).toBeInTheDocument();
  expect(screen.getByText("Adaptive Learning Research Results")).toBeInTheDocument();
  expect(screen.getByText("Classification Results")).toBeInTheDocument();
  expect(screen.getAllByText("Learners").length).toBeGreaterThan(1);
  expect(screen.getByText("learner_features.csv")).toBeInTheDocument();
});
