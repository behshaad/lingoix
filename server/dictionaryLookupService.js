const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";
const DEFAULT_OPENROUTER_MODEL = "google/gemini-2.0-flash-exp:free";
const LOOKUP_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const stripWordPunctuation = (value = "") =>
  String(value)
    .trim()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

const persianRegex = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]/;
const germanRegex = /[äöüßÄÖÜ]|\b(ich|du|der|die|das|und|nicht|guten|morgen|deutsch|sprechen|lernen)\b/i;

const detectLanguage = (text = "") => {
  if (persianRegex.test(text)) return "fa";
  if (germanRegex.test(text)) return "de";
  return "en";
};

const cacheKeyFor = (word, sourceLang, targetLang) =>
  `${stripWordPunctuation(word).toLocaleLowerCase("de-DE")}::${sourceLang || "auto"}::${targetLang || "fa"}`;

const emptyLookup = ({ word, sourceLang, targetLang, suggestions = [], error = "" }) => ({
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
  suggestions,
  provider: "",
  found: false,
  error,
});

const normalizeLookup = (lookup, fallback) => ({
  word: lookup.word || fallback.word,
  sourceLang: lookup.sourceLang || fallback.sourceLang,
  targetLang: lookup.targetLang || fallback.targetLang,
  definition: lookup.definition || lookup.meaning || "",
  translation: lookup.translation || "",
  partOfSpeech: lookup.partOfSpeech || lookup.part_of_speech || "",
  pronunciation: lookup.pronunciation || lookup.phonetic || fallback.word,
  example: lookup.example || "",
  synonyms: Array.isArray(lookup.synonyms) ? lookup.synonyms.filter(Boolean).slice(0, 8) : [],
  antonyms: Array.isArray(lookup.antonyms) ? lookup.antonyms.filter(Boolean).slice(0, 8) : [],
  suggestions: Array.isArray(lookup.suggestions) ? lookup.suggestions.filter(Boolean).slice(0, 6) : [],
  provider: lookup.provider || "",
  found: Boolean(lookup.found ?? (lookup.definition || lookup.translation)),
  error: lookup.error || "",
});

const safeJsonFromText = (text) => {
  const jsonMatch = String(text || "").match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
};

const lookupPrompt = ({ word, sourceLang, targetLang }) => `
Return ONLY valid JSON for a dictionary lookup.
Word: ${word}
Source language: ${sourceLang}
Target translation language: ${targetLang}
JSON shape:
{
  "definition": "short learner-friendly definition",
  "translation": "translation in target language",
  "partOfSpeech": "noun|verb|adjective|...",
  "pronunciation": "pronunciation or IPA if known",
  "example": "short example sentence",
  "synonyms": ["..."],
  "antonyms": ["..."],
  "suggestions": ["similar spelling suggestions if the input looks misspelled"],
  "found": true
}
If the word is not valid, set found false and suggestions if possible.
`;

const createGeminiProvider = ({ fetchImpl, env }) => ({
  name: "gemini",
  isConfigured: () => Boolean(env.GEMINI_API_KEY || env.REACT_APP_GEMINI_API_KEY),
  lookup: async (request) => {
    const apiKey = env.GEMINI_API_KEY || env.REACT_APP_GEMINI_API_KEY;
    const model = env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
    const response = await fetchImpl(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: lookupPrompt(request) }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );
    if (!response.ok) throw new Error(`gemini_${response.status}`);
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n");
    const parsed = safeJsonFromText(text);
    if (!parsed) throw new Error("gemini_invalid_json");
    return { ...parsed, provider: "gemini" };
  },
});

const createOpenRouterProvider = ({ fetchImpl, env }) => ({
  name: "openrouter",
  isConfigured: () => Boolean(env.OPENROUTER_API_KEY || env.REACT_APP_OPENROUTER_API_KEY),
  lookup: async (request) => {
    const apiKey = env.OPENROUTER_API_KEY || env.REACT_APP_OPENROUTER_API_KEY;
    const model = env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
    const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": env.APP_PUBLIC_URL || "http://localhost:3000",
        "X-Title": "Lingoix",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: lookupPrompt(request) }],
        response_format: { type: "json_object" },
      }),
    });
    if (!response.ok) throw new Error(`openrouter_${response.status}`);
    const data = await response.json();
    const parsed = safeJsonFromText(data?.choices?.[0]?.message?.content);
    if (!parsed) throw new Error("openrouter_invalid_json");
    return { ...parsed, provider: "openrouter" };
  },
});

const createFreeDictionaryProvider = ({ fetchImpl }) => ({
  name: "free-dictionary-api",
  isConfigured: () => true,
  lookup: async ({ word, sourceLang }) => {
    if (sourceLang !== "en") throw new Error("free_dictionary_english_only");
    const response = await fetchImpl(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    const data = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(data)) {
      return { found: false, provider: "free-dictionary-api", suggestions: data?.resolution ? [data.resolution] : [] };
    }
    const entry = data[0];
    const meaning = entry.meanings?.[0];
    const definition = meaning?.definitions?.[0];
    return {
      word,
      sourceLang: "en",
      definition: definition?.definition || "",
      translation: "",
      partOfSpeech: meaning?.partOfSpeech || "",
      pronunciation: entry.phonetic || entry.phonetics?.find((item) => item.text)?.text || word,
      example: definition?.example || "",
      synonyms: [...(definition?.synonyms || []), ...(meaning?.synonyms || [])],
      antonyms: [...(definition?.antonyms || []), ...(meaning?.antonyms || [])],
      found: Boolean(definition?.definition),
      provider: "free-dictionary-api",
    };
  },
});

const createWiktionaryProvider = ({ fetchImpl }) => ({
  name: "wiktionary",
  isConfigured: () => true,
  lookup: async ({ word, sourceLang }) => {
    const wikiLang = sourceLang === "fa" ? "fa" : sourceLang === "de" ? "de" : "en";
    const response = await fetchImpl(
      `https://${wikiLang}.wiktionary.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(word)}`
    );
    if (!response.ok) throw new Error(`wiktionary_${response.status}`);
    const data = await response.json();
    const page = Object.values(data?.query?.pages || {})[0];
    const extract = page?.extract || "";
    if (!extract || page?.missing) throw new Error("wiktionary_not_found");
    return {
      word,
      sourceLang,
      definition: extract.split("\n").find(Boolean) || extract.slice(0, 240),
      pronunciation: word,
      found: true,
      provider: "wiktionary",
    };
  },
});

const createWiktionarySuggestProvider = ({ fetchImpl }) => async ({ word, sourceLang }) => {
  const wikiLang = sourceLang === "fa" ? "fa" : sourceLang === "de" ? "de" : "en";
  const response = await fetchImpl(
    `https://${wikiLang}.wiktionary.org/w/api.php?action=opensearch&format=json&origin=*&limit=5&search=${encodeURIComponent(word)}`
  );
  if (!response.ok) return [];
  const data = await response.json().catch(() => []);
  return Array.isArray(data?.[1]) ? data[1].slice(0, 5) : [];
};

const createDictionaryLookupService = ({ db, fetchImpl = fetch, env = process.env } = {}) => {
  const providers = [
    createGeminiProvider({ fetchImpl, env }),
    createOpenRouterProvider({ fetchImpl, env }),
    createFreeDictionaryProvider({ fetchImpl }),
    createWiktionaryProvider({ fetchImpl }),
  ];
  const suggestFromWiktionary = createWiktionarySuggestProvider({ fetchImpl });

  const readCache = (cacheKey) => {
    if (!db) return null;
    const row = db.prepare("SELECT payload, created_at FROM dictionary_cache WHERE cache_key = ?").get(cacheKey);
    if (!row) return null;
    const age = Date.now() - new Date(row.created_at).getTime();
    if (age > LOOKUP_TTL_MS) return null;
    try {
      return JSON.parse(row.payload);
    } catch {
      return null;
    }
  };

  const writeCache = (cacheKey, payload) => {
    if (!db || !payload?.found) return;
    db.prepare(`
      INSERT INTO dictionary_cache (cache_key, word, source_lang, target_lang, provider, payload, created_at)
      VALUES (@cacheKey, @word, @sourceLang, @targetLang, @provider, @payload, CURRENT_TIMESTAMP)
      ON CONFLICT(cache_key) DO UPDATE SET
        provider = excluded.provider,
        payload = excluded.payload,
        created_at = CURRENT_TIMESTAMP
    `).run({
      cacheKey,
      word: payload.word,
      sourceLang: payload.sourceLang,
      targetLang: payload.targetLang,
      provider: payload.provider,
      payload: JSON.stringify(payload),
    });
  };

  const lookup = async ({ word, sourceLang = "auto", targetLang = "fa" }) => {
    const cleanWord = stripWordPunctuation(word);
    if (!cleanWord) return emptyLookup({ word: "", sourceLang, targetLang, error: "invalid_word" });
    const resolvedSource = sourceLang === "auto" ? detectLanguage(cleanWord) : sourceLang;
    const fallback = { word: cleanWord, sourceLang: resolvedSource, targetLang };
    const cacheKey = cacheKeyFor(cleanWord, resolvedSource, targetLang);
    const cached = readCache(cacheKey);
    if (cached) return { ...cached, cached: true };

    for (const provider of providers) {
      if (!provider.isConfigured()) continue;
      try {
        const result = normalizeLookup(await provider.lookup(fallback), fallback);
        if (result.found) {
          writeCache(cacheKey, result);
          return result;
        }
      } catch {
        // Providers are intentionally isolated so one outage cannot break lookup.
      }
    }

    const suggestions = await suggestFromWiktionary(fallback).catch(() => []);
    return emptyLookup({ ...fallback, suggestions, error: "lookup_not_found" });
  };

  return { lookup, detectLanguage, stripWordPunctuation };
};

module.exports = { createDictionaryLookupService, detectLanguage, stripWordPunctuation };
