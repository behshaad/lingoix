import { apiClient } from "./apiClient";

const CACHE_KEY = "lingoixDictionaryLookupCache";

const persianRegex = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]/;
const germanRegex = /[äöüßÄÖÜ]|\b(ich|du|der|die|das|und|nicht|guten|morgen|deutsch|sprechen|lernen)\b/i;

export const stripWordPunctuation = (value = "") =>
  String(value)
    .trim()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

export const detectLanguage = (text = "") => {
  if (persianRegex.test(text)) return "fa";
  if (germanRegex.test(text)) return "de";
  return "en";
};

const emptyLookup = ({ word, sourceLang = "auto", targetLang = "fa", error = "" }) => ({
  word,
  sourceLang,
  targetLang,
  definition: "",
  translation: "",
  partOfSpeech: "",
  pronunciation: word,
  example: "",
  synonyms: [],
  antonyms: [],
  suggestions: [],
  provider: "",
  found: false,
  error,
});

const cacheKeyFor = (word, sourceLang, targetLang) =>
  `${stripWordPunctuation(word).toLocaleLowerCase("de-DE")}::${sourceLang}::${targetLang}`;

const readLookupCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeLookupCache = (cache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Local cache failure should never block dictionary lookup.
  }
};

export const lookupWord = async (word = "", sourceLang = "auto", targetLang = "fa") => {
  const cleanWord = stripWordPunctuation(word);
  if (!cleanWord) return emptyLookup({ word: "", sourceLang, targetLang, error: "invalid_word" });

  const resolvedSource = sourceLang === "auto" ? detectLanguage(cleanWord) : sourceLang;
  const cacheKey = cacheKeyFor(cleanWord, resolvedSource, targetLang);
  const cache = readLookupCache();
  if (cache[cacheKey]) return { ...cache[cacheKey], cached: true };

  try {
    const { lookup } = await apiClient.dictionaryLookup(cleanWord, resolvedSource, targetLang);
    if (lookup?.found) {
      cache[cacheKey] = lookup;
      writeLookupCache(cache);
    }
    return lookup || emptyLookup({ word: cleanWord, sourceLang: resolvedSource, targetLang, error: "lookup_failed" });
  } catch {
    return emptyLookup({ word: cleanWord, sourceLang: resolvedSource, targetLang, error: "lookup_failed" });
  }
};

export const translateLocally = (text = "") => text;

export const canPronounce = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

export const pronounceWord = (word, lang = "de") => {
  if (!canPronounce()) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = lang === "fa" ? "fa-IR" : lang === "de" ? "de-DE" : "en-US";
  window.speechSynthesis.speak(utterance);
  return true;
};

export const dictionaryService = {
  detectLanguage,
  lookupWord,
  translateLocally,
  pronounceWord,
  canPronounce,
};
