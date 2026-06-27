import { dictionaryService } from "./dictionaryService";

test("translates known German words locally while preserving the full text", () => {
  expect(dictionaryService.translateLocally("Ich lerne Deutsch heute.", "de", "fa")).toBe(
    "من آلمانی یاد می‌گیرم heute."
  );
});

test("looks up a selected word meaning and translation", () => {
  expect(dictionaryService.lookupWord("Deutsch")).toMatchObject({
    word: "Deutsch",
    sourceLang: "de",
    meaning: "German",
    translation: "آلمانی",
    found: true,
  });
});
