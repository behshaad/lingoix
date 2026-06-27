const Database = require("better-sqlite3");
const { createDictionaryLookupService } = require("../../server/dictionaryLookupService");

const createDb = () => {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE dictionary_cache (
      cache_key TEXT PRIMARY KEY,
      word TEXT NOT NULL,
      source_lang TEXT NOT NULL,
      target_lang TEXT NOT NULL,
      provider TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
};

const response = (body, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => body,
});

test("falls back to Free Dictionary API when Gemini fails", async () => {
  const fetchImpl = jest
    .fn()
    .mockResolvedValueOnce(response({}, false, 500))
    .mockResolvedValueOnce(
      response([
        {
          word: "resilient",
          phonetic: "/rɪˈzɪliənt/",
          meanings: [
            {
              partOfSpeech: "adjective",
              definitions: [
                {
                  definition: "Able to recover quickly from difficulties.",
                  example: "A resilient learner keeps practicing.",
                  synonyms: ["flexible"],
                  antonyms: ["fragile"],
                },
              ],
            },
          ],
        },
      ])
    );

  const service = createDictionaryLookupService({
    db: createDb(),
    fetchImpl,
    env: { GEMINI_API_KEY: "test-key" },
  });

  await expect(service.lookup({ word: "resilient", sourceLang: "en", targetLang: "fa" })).resolves.toMatchObject({
    definition: "Able to recover quickly from difficulties.",
    partOfSpeech: "adjective",
    provider: "free-dictionary-api",
    found: true,
  });
  expect(fetchImpl).toHaveBeenCalledTimes(2);
});

test("caches successful provider lookups", async () => {
  const fetchImpl = jest.fn().mockResolvedValue(
    response([
      {
        word: "durable",
        meanings: [{ partOfSpeech: "adjective", definitions: [{ definition: "Able to last.", synonyms: [], antonyms: [] }] }],
      },
    ])
  );
  const service = createDictionaryLookupService({ db: createDb(), fetchImpl, env: {} });

  const first = await service.lookup({ word: "durable", sourceLang: "en", targetLang: "fa" });
  const second = await service.lookup({ word: "durable", sourceLang: "en", targetLang: "fa" });

  expect(first.found).toBe(true);
  expect(second.cached).toBe(true);
  expect(fetchImpl).toHaveBeenCalledTimes(1);
});

test("translates full text through a configured backend provider", async () => {
  const fetchImpl = jest.fn().mockResolvedValue(
    response({
      candidates: [
        {
          content: {
            parts: [{ text: JSON.stringify({ translatedText: "سلام" }) }],
          },
        },
      ],
    })
  );
  const service = createDictionaryLookupService({
    db: createDb(),
    fetchImpl,
    env: { GEMINI_API_KEY: "test-key" },
  });

  await expect(service.translate({ text: "Hello", sourceLang: "en", targetLang: "fa" })).resolves.toMatchObject({
    sourceText: "Hello",
    translatedText: "سلام",
    provider: "gemini",
    translated: true,
  });
});

test("does not treat unchanged full text as a successful translation", async () => {
  const fetchImpl = jest.fn().mockResolvedValue(
    response({
      candidates: [
        {
          content: {
            parts: [{ text: JSON.stringify({ translatedText: "Hello" }) }],
          },
        },
      ],
    })
  );
  const service = createDictionaryLookupService({
    db: createDb(),
    fetchImpl,
    env: { GEMINI_API_KEY: "test-key" },
  });

  await expect(service.translate({ text: "Hello", sourceLang: "en", targetLang: "fa" })).resolves.toMatchObject({
    translatedText: "",
    translated: false,
    error: "translation_failed",
  });
});
