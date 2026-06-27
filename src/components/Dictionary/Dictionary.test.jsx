import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dictionary from "./Dictionary";
import i18n from "../../i18n";
import { apiClient } from "../../services/apiClient";

jest.mock("../../services/apiClient", () => ({
  apiClient: {
    dictionaryLookup: jest.fn(),
    dictionaryTranslate: jest.fn(),
  },
}));

beforeEach(async () => {
  localStorage.clear();
  jest.clearAllMocks();
  await i18n.changeLanguage("en");
});

test("translates full text through the backend and shows meaning for a selected word", async () => {
  apiClient.dictionaryTranslate.mockResolvedValueOnce({
    translation: {
      sourceText: "Ich lerne Deutsch heute.",
      translatedText: "من امروز آلمانی یاد می‌گیرم.",
      sourceLang: "de",
      targetLang: "fa",
      provider: "gemini",
      translated: true,
    },
  });
  apiClient.dictionaryLookup.mockResolvedValueOnce({
    lookup: {
      word: "Deutsch",
      sourceLang: "de",
      targetLang: "fa",
      definition: "The German language.",
      translation: "آلمانی",
      partOfSpeech: "noun",
      pronunciation: "Deutsch",
      example: "Ich lerne Deutsch.",
      synonyms: ["German"],
      antonyms: [],
      suggestions: [],
      provider: "gemini",
      found: true,
    },
  });

  render(<Dictionary />);

  const source = screen.getByLabelText("Source text");
  await userEvent.type(source, "Ich lerne Deutsch heute.");
  await act(async () => {
    await userEvent.click(screen.getByRole("button", { name: "Translate" }));
  });

  expect(screen.getByText("من امروز آلمانی یاد می‌گیرم.")).toBeInTheDocument();
  expect(screen.queryAllByText("Ich lerne Deutsch heute.")).toHaveLength(1);

  source.setSelectionRange(10, 17);
  fireEvent.select(source);

  expect(await screen.findByText("Deutsch")).toBeInTheDocument();
  expect(screen.getByText("The German language.")).toBeInTheDocument();
  expect(screen.getAllByText(/آلمانی/).length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: "Pronounce" })).toBeInTheDocument();
});
