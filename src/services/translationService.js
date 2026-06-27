// Translation service using Google Cloud Translation API
import { dictionaryService } from "./dictionaryService";

const API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;

const BASE_URL = "https://translation.googleapis.com/language/translate/v2";

export const translationService = {
  async translate(text, sourceLang, targetLang) {
    if (!API_KEY) {
      return dictionaryService.translateLocally(text, sourceLang, targetLang);
    }

    try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang === "auto" ? undefined : sourceLang,
          target: targetLang,
          format: "text",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Translation failed: ${response.statusText}. ${
            errorData.error?.message || ""
          }`
        );
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  },

  async getSuggestions(text, lang) {
    // Google Translate does not provide word suggestions. Keep this extension point
    // explicit so a dictionary service can be added without changing the hook.
    return [];
  },

  detectLanguage(text) {
    return dictionaryService.detectLanguage(text);
  },
};
