import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dictionary from "./Dictionary";
import i18n from "../../i18n";

beforeEach(async () => {
  localStorage.clear();
  await i18n.changeLanguage("en");
});

test("translates full text locally and shows meaning for a selected word", async () => {
  render(<Dictionary />);

  const source = screen.getByLabelText("Source text");
  await userEvent.type(source, "Ich lerne Deutsch heute.");
  await act(async () => {
    await userEvent.click(screen.getByRole("button", { name: "Translate" }));
  });

  expect(await screen.findByText("من آلمانی یاد می‌گیرم heute.")).toBeInTheDocument();

  source.setSelectionRange(10, 17);
  fireEvent.select(source);

  expect(await screen.findByText("Deutsch")).toBeInTheDocument();
  expect(screen.getAllByText("German").length).toBeGreaterThan(0);
  expect(screen.getAllByText(/آلمانی/).length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: "Pronounce" })).toBeInTheDocument();
});
