// Translation service using Google Cloud Translation API
const API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;

if (!API_KEY) {
  console.error(
    "Google Translate API key is not configured. Please add REACT_APP_GOOGLE_TRANSLATE_API_KEY to your environment variables."
  );
}

const BASE_URL = "https://translation.googleapis.com/language/translate/v2";

export const translationService = {
  async translate(text, sourceLang, targetLang) {
    if (!API_KEY) {
      throw new Error("Translation API key is not configured");
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
    try {
      // For now, return empty suggestions since Google Translate API doesn't provide word suggestions
      // In a real implementation, you might want to use a dictionary API or implement your own suggestion logic
      return [];
    } catch (error) {
      console.error("Suggestions error:", error);
      throw error;
    }
  },

  detectLanguage(text) {
    // Simple language detection based on character sets
    const persianRegex = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]/;
    const germanRegex = /[äöüßÄÖÜ]/;

    if (persianRegex.test(text)) {
      return "fa";
    } else if (germanRegex.test(text)) {
      return "de";
    }

    return "auto";
  },
};
