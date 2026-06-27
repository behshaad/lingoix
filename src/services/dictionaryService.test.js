import { apiClient } from "./apiClient";
import { dictionaryService } from "./dictionaryService";

jest.mock("./apiClient", () => ({
  apiClient: {
    dictionaryLookup: jest.fn(),
    dictionaryTranslate: jest.fn(),
  },
}));

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test("looks up any word through the backend and caches successful results locally", async () => {
  apiClient.dictionaryLookup.mockResolvedValueOnce({
    lookup: {
      word: "serendipity",
      sourceLang: "en",
      targetLang: "fa",
      definition: "The occurrence of happy discoveries by chance.",
      translation: "خوش‌یابی",
      partOfSpeech: "noun",
      pronunciation: "ser-en-DIP-i-tee",
      example: "Finding the book was pure serendipity.",
      synonyms: ["chance"],
      antonyms: [],
      suggestions: [],
      provider: "gemini",
      found: true,
    },
  });

  const first = await dictionaryService.lookupWord("serendipity", "en", "fa");
  const second = await dictionaryService.lookupWord("serendipity", "en", "fa");

  expect(first.definition).toContain("happy discoveries");
  expect(second.cached).toBe(true);
  expect(apiClient.dictionaryLookup).toHaveBeenCalledTimes(1);
});

test("returns a safe empty lookup when the backend fails", async () => {
  apiClient.dictionaryLookup.mockRejectedValueOnce(new Error("network_down"));

  await expect(dictionaryService.lookupWord("unknownword", "en", "fa")).resolves.toMatchObject({
    word: "unknownword",
    found: false,
    error: "lookup_failed",
  });
});
