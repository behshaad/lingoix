import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountProfilePage from "./AccountProfilePage";
import i18n from "../i18n";
import { apiClient } from "../services/apiClient";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../services/apiClient", () => ({
  apiClient: {
    me: jest.fn(),
    updateAccountProfile: jest.fn(),
    logout: jest.fn(),
  },
}));

const renderPage = async (language = "en") => {
  await i18n.changeLanguage(language);
  apiClient.me.mockResolvedValue({
    account: {
      displayName: "Arman Rahimi",
      email: "learner@lingoix.test",
      role: "learner",
      learnerId: null,
      phone: "",
      bio: "",
      avatarUrl: "",
    },
  });

  const view = render(<AccountProfilePage />);

  await screen.findByDisplayValue("Arman Rahimi");
  return view;
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
});

test("renders account profile for a profile-incomplete learner", async () => {
  await renderPage();

  expect(screen.getByRole("heading", { name: "Your profile" })).toBeInTheDocument();
  expect(screen.getByText("AR")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save profile" })).toBeInTheDocument();
});

test("uses RTL direction when Persian is active", async () => {
  const { container } = await renderPage("fa");

  expect(container.querySelector("main")).toHaveAttribute("dir", "rtl");
});

test("blocks saving when display name is too short", async () => {
  await renderPage();

  const displayName = screen.getByLabelText("Display name");
  await userEvent.clear(displayName);
  await userEvent.type(displayName, "A");
  await userEvent.click(screen.getByRole("button", { name: "Save profile" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Display name must be at least 2 characters."
  );
  expect(apiClient.updateAccountProfile).not.toHaveBeenCalled();
  await waitFor(() => expect(apiClient.me).toHaveBeenCalledTimes(1));
});
