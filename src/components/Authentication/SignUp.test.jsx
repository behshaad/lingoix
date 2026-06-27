import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from "./SignUp";
import i18n from "../../i18n";
import { apiClient } from "../../services/apiClient";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => {
    const React = require("react");
    return React.createElement("a", { href: to, ...props }, children);
  },
  useNavigate: () => mockNavigate,
}));

jest.mock("../../services/apiClient", () => ({
  apiClient: {
    signup: jest.fn(),
  },
}));

beforeEach(async () => {
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
  mockNavigate.mockClear();
  await i18n.changeLanguage("en");
});

test("remembers successful signup emails without rendering login suggestions", async () => {
  apiClient.signup.mockResolvedValueOnce({
    account: {
      id: "account-1",
      email: "newlearner@example.com",
      role: "learner",
      learnerId: null,
    },
  });

  render(<SignUp />);

  await userEvent.type(screen.getByPlaceholderText("Email"), "newlearner@example.com");
  await userEvent.type(screen.getByPlaceholderText("Password"), "secret1");
  await userEvent.type(screen.getByPlaceholderText("Confirm password"), "secret1");
  await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

  await waitFor(() => {
    expect(localStorage.getItem("lingoixRememberedLoginEmails")).toContain("newlearner@example.com");
  });
});
