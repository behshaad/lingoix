import { useState, useCallback } from "react";
import { translationService } from "../services/translationService";
import debounce from "lodash/debounce";

export const useTranslation = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("de");

  const translate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const translated = await translationService.translate(
        inputText,
        sourceLang,
        targetLang
      );
      setTranslatedText(translated);
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback(
    debounce(async (text) => {
      setInputText(text);
      setError(null);

      if (!text.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const detectedLang = translationService.detectLanguage(text);
        if (sourceLang === "auto") {
          setSourceLang(detectedLang);
        }

        const suggestions = await translationService.getSuggestions(
          text,
          detectedLang
        );
        setSuggestions(suggestions);
      } catch (err) {
        console.error("Error getting suggestions:", err);
        setSuggestions([]);
      }
    }, 300),
    [sourceLang]
  );

  const swapLanguages = () => {
    if (sourceLang === "auto") {
      const detectedLang = translationService.detectLanguage(inputText);
      setSourceLang(detectedLang);
    } else {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
    }
  };

  return {
    inputText,
    translatedText,
    suggestions,
    isLoading,
    error,
    sourceLang,
    targetLang,
    setInputText,
    setSourceLang,
    setTargetLang,
    handleInputChange,
    translate,
    swapLanguages,
  };
};
