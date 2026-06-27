import { apiClient } from "./apiClient";
import { translationService } from "./translationService";

jest.mock("./apiClient", () => ({
  apiClient: {
    dictionaryTranslate: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("translates full text through the backend dictionary workspace API", async () => {
  apiClient.dictionaryTranslate.mockResolvedValueOnce({
    translation: {
      sourceText: "Hello",
      translatedText: "سلام",
      sourceLang: "en",
      targetLang: "fa",
      provider: "gemini",
      translated: true,
    },
  });

  await expect(translationService.translate("Hello", "en", "fa")).resolves.toBe("سلام");
  expect(apiClient.dictionaryTranslate).toHaveBeenCalledWith("Hello", "en", "fa");
});

test("throws when the backend cannot produce a real translation", async () => {
  apiClient.dictionaryTranslate.mockResolvedValueOnce({
    translation: {
      sourceText: "Hello",
      translatedText: "",
      sourceLang: "en",
      targetLang: "fa",
      provider: "",
      translated: false,
      error: "translation_failed",
    },
  });

  await expect(translationService.translate("Hello", "en", "fa")).rejects.toThrow("translation_failed");
});
