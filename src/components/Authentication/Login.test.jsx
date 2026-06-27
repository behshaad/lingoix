import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import i18n from "../../i18n";
import { apiClient } from "../../services/apiClient";
import { rememberLoginEmail } from "../../services/rememberedLoginEmails";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => {
    const React = require("react");
    return React.createElement("a", { href: to, ...props }, children);
  },
  useLocation: () => ({ state: null }),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../services/apiClient", () => ({
  apiClient: {
    me: jest.fn(),
    login: jest.fn(),
  },
}));

beforeEach(async () => {
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
  mockNavigate.mockClear();
  apiClient.me.mockRejectedValue(new Error("not_authenticated"));
  await i18n.changeLanguage("en");
});

const renderLogin = () =>
  render(<Login />);

test("suggests remembered login emails and fills the email field", async () => {
  rememberLoginEmail("learner@example.com");
  renderLogin();

  const emailInput = screen.getByPlaceholderText("Email");
  await userEvent.click(emailInput);
  await userEvent.click(await screen.findByText("learner@example.com"));

  expect(emailInput).toHaveValue("learner@example.com");
});

test("stores an email only after successful login", async () => {
  apiClient.login.mockResolvedValueOnce({
    account: {
      id: "account-1",
      email: "learner@example.com",
      role: "learner",
      learnerId: "learner-1",
    },
  });
  renderLogin();

  await userEvent.type(screen.getByPlaceholderText("Email"), "learner@example.com");
  await userEvent.type(screen.getByPlaceholderText("Password"), "secret1");
  await userEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(localStorage.getItem("lingoixRememberedLoginEmails")).toContain("learner@example.com");
  });
});
