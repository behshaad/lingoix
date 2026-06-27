import { apiClient } from "./apiClient";
import { dictionaryService } from "./dictionaryService";

export const translationService = {
  async translate(text, sourceLang, targetLang) {
    const { translation } = await apiClient.dictionaryTranslate(text, sourceLang, targetLang);
    if (!translation?.translated || !translation.translatedText) {
      throw new Error(translation?.error || "translation_failed");
    }
    return translation.translatedText;
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
