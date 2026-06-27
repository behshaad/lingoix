import { useState } from "react";
import { translationService } from "../services/translationService";

export const useTranslation = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("fa");

  const resolveTargetLang = (detectedSource) => {
    if (detectedSource === targetLang) return targetLang === "de" ? "fa" : "de";
    return targetLang;
  };

  const translate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const detectedSource =
        sourceLang === "auto" ? translationService.detectLanguage(inputText) : sourceLang;
      const resolvedTarget = resolveTargetLang(detectedSource);
      const translated = await translationService.translate(
        inputText,
        detectedSource,
        resolvedTarget
      );
      setTranslatedText(translated);
      if (resolvedTarget !== targetLang) setTargetLang(resolvedTarget);
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (text) => {
      setInputText(text);
      setError(null);

      if (!text.trim()) {
        setSuggestions([]);
        setTranslatedText("");
        return;
      }

      const detectedLang = translationService.detectLanguage(text);
      if (sourceLang === "auto") {
        setSourceLang(detectedLang);
        setTargetLang((current) => (current === detectedLang ? (detectedLang === "de" ? "fa" : "de") : current));
      }
      setSuggestions([]);
  };

  const swapLanguages = () => {
    const oppositeLearningLang = targetLang === "de" ? "fa" : "de";
    if (sourceLang === "auto") {
      const detectedLang = translationService.detectLanguage(inputText);
      setSourceLang(targetLang);
      setTargetLang(detectedLang === "en" ? oppositeLearningLang : detectedLang);
    } else if (sourceLang === "en") {
      setSourceLang(targetLang);
      setTargetLang(oppositeLearningLang);
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
