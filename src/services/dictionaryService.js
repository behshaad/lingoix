const dictionaryEntries = [
  {
    de: "hallo",
    fa: "سلام",
    en: "hello",
    pronunciation: "Hallo",
    examples: { de: "Hallo, wie geht es dir?", fa: "سلام، حالت چطور است؟" },
  },
  {
    de: "guten",
    fa: "خوب",
    en: "good",
    pronunciation: "guten",
    examples: { de: "Guten Morgen", fa: "صبح بخیر" },
  },
  {
    de: "morgen",
    fa: "صبح",
    en: "morning",
    pronunciation: "Morgen",
    examples: { de: "Guten Morgen", fa: "صبح بخیر" },
  },
  {
    de: "danke",
    fa: "متشکرم",
    en: "thank you",
    pronunciation: "Danke",
    examples: { de: "Danke sehr", fa: "خیلی ممنون" },
  },
  {
    de: "bitte",
    fa: "لطفاً",
    en: "please / you're welcome",
    pronunciation: "bitte",
    examples: { de: "Bitte sprechen Sie langsam.", fa: "لطفاً آرام صحبت کنید." },
  },
  {
    de: "ich",
    fa: "من",
    en: "I",
    pronunciation: "ich",
    examples: { de: "Ich lerne Deutsch.", fa: "من آلمانی یاد می‌گیرم." },
  },
  {
    de: "du",
    fa: "تو",
    en: "you",
    pronunciation: "du",
    examples: { de: "Du lernst schnell.", fa: "تو سریع یاد می‌گیری." },
  },
  {
    de: "lerne",
    fa: "یاد می‌گیرم",
    en: "learn",
    pronunciation: "lerne",
    examples: { de: "Ich lerne Deutsch.", fa: "من آلمانی یاد می‌گیرم." },
  },
  {
    de: "deutsch",
    fa: "آلمانی",
    en: "German",
    pronunciation: "Deutsch",
    examples: { de: "Ich spreche Deutsch.", fa: "من آلمانی صحبت می‌کنم." },
  },
  {
    de: "persisch",
    fa: "فارسی",
    en: "Persian",
    pronunciation: "Persisch",
    examples: { de: "Ich spreche Persisch.", fa: "من فارسی صحبت می‌کنم." },
  },
  {
    de: "spreche",
    fa: "صحبت می‌کنم",
    en: "speak",
    pronunciation: "spreche",
    examples: { de: "Ich spreche Deutsch.", fa: "من آلمانی صحبت می‌کنم." },
  },
  {
    de: "wasser",
    fa: "آب",
    en: "water",
    pronunciation: "Wasser",
    examples: { de: "Ich trinke Wasser.", fa: "من آب می‌نوشم." },
  },
  {
    de: "haus",
    fa: "خانه",
    en: "house",
    pronunciation: "Haus",
    examples: { de: "Das Haus ist groß.", fa: "خانه بزرگ است." },
  },
  {
    de: "schule",
    fa: "مدرسه",
    en: "school",
    pronunciation: "Schule",
    examples: { de: "Die Schule ist nah.", fa: "مدرسه نزدیک است." },
  },
  {
    de: "buch",
    fa: "کتاب",
    en: "book",
    pronunciation: "Buch",
    examples: { de: "Das Buch ist neu.", fa: "کتاب جدید است." },
  },
  {
    de: "سلام",
    fa: "سلام",
    en: "hello",
    pronunciation: "سلام",
    examples: { de: "Hallo", fa: "سلام" },
  },
  {
    de: "آلمانی",
    fa: "آلمانی",
    en: "German",
    pronunciation: "آلمانی",
    examples: { de: "Deutsch", fa: "آلمانی" },
  },
];

const phraseTranslations = {
  de: {
    fa: [
      [/guten morgen/gi, "صبح بخیر"],
      [/ich lerne deutsch/gi, "من آلمانی یاد می‌گیرم"],
      [/ich spreche deutsch/gi, "من آلمانی صحبت می‌کنم"],
      [/danke sehr/gi, "خیلی ممنون"],
    ],
  },
  fa: {
    de: [
      [/صبح بخیر/g, "Guten Morgen"],
      [/من آلمانی یاد می‌گیرم/g, "Ich lerne Deutsch"],
      [/من آلمانی صحبت می‌کنم/g, "Ich spreche Deutsch"],
      [/خیلی ممنون/g, "Danke sehr"],
    ],
  },
};

const persianRegex = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]/;
const germanRegex = /[äöüßÄÖÜ]|\b(ich|du|der|die|das|und|nicht|guten|morgen|deutsch|spreche|lerne)\b/i;

export const stripWordPunctuation = (value = "") =>
  String(value)
    .trim()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

export const detectLanguage = (text = "") => {
  if (persianRegex.test(text)) return "fa";
  if (germanRegex.test(text)) return "de";
  return "auto";
};

const normalized = (value = "") => stripWordPunctuation(value).toLocaleLowerCase("de-DE");

export const lookupWord = (word = "") => {
  const cleanWord = stripWordPunctuation(word);
  if (!cleanWord) return null;
  const key = normalized(cleanWord);
  const entry = dictionaryEntries.find(
    (item) =>
      normalized(item.de) === key ||
      normalized(item.fa) === key ||
      normalized(item.en) === key
  );
  if (!entry) {
    return {
      word: cleanWord,
      sourceLang: detectLanguage(cleanWord),
      meaning: "",
      translation: "",
      pronunciation: cleanWord,
      found: false,
    };
  }

  const sourceLang =
    normalized(entry.fa) === key ? "fa" : normalized(entry.de) === key ? "de" : "en";

  return {
    ...entry,
    word: cleanWord,
    sourceLang,
    meaning: entry.en,
    translation: sourceLang === "fa" ? entry.de : entry.fa,
    found: true,
  };
};

const translateToken = (token, targetLang) => {
  const entry = lookupWord(token);
  if (!entry?.found) return token;
  if (targetLang === "fa") return entry.fa;
  if (targetLang === "de") return entry.de.charAt(0).toUpperCase() + entry.de.slice(1);
  return entry.en;
};

export const translateLocally = (text = "", sourceLang = "auto", targetLang = "fa") => {
  const resolvedSource = sourceLang === "auto" ? detectLanguage(text) : sourceLang;
  const phraseSet = phraseTranslations[resolvedSource]?.[targetLang] || [];
  let translated = text;
  phraseSet.forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement);
  });
  return translated.replace(/[\p{L}\p{N}]+/gu, (token) => translateToken(token, targetLang));
};

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
