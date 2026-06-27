import { useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Bookmark, BookmarkCheck, Search, Volume2 } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useTranslation as useI18nTranslation } from "react-i18next";
import { useSavedWords } from "../../hooks/useSavedWords";
import { dictionaryService } from "../../services/dictionaryService";

const Dictionary = () => {
  const { t } = useI18nTranslation();
  const textareaRef = useRef(null);
  const translatedRef = useRef(null);
  const [selectedLookup, setSelectedLookup] = useState(null);
  const [pronunciationMessage, setPronunciationMessage] = useState("");

  const {
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
  } = useTranslation();

  const { savedWords, showSaved, addWord, removeWord, toggleShowSaved } =
    useSavedWords();

  const canPronounce = useMemo(() => dictionaryService.canPronounce(), []);

  const updateLookup = (word) => {
    const lookup = dictionaryService.lookupWord(word);
    setSelectedLookup(lookup);
    setPronunciationMessage("");
  };

  const handleSourceSelection = (event) => {
    const { selectionStart, selectionEnd, value } = event.currentTarget;
    if (selectionEnd <= selectionStart) return;
    updateLookup(value.slice(selectionStart, selectionEnd));
  };

  const handleTranslatedSelection = () => {
    const selection = window.getSelection?.().toString();
    if (selection) updateLookup(selection);
  };

  const handlePronounce = () => {
    if (!selectedLookup) return;
    const didSpeak = dictionaryService.pronounceWord(
      selectedLookup.pronunciation || selectedLookup.word,
      selectedLookup.sourceLang
    );
    if (!didSpeak) {
      setPronunciationMessage(t("dictionary.pronunciationUnavailable"));
    }
  };

  const selectedText = selectedLookup?.word || "";
  const selectedMeaning = selectedLookup?.found
    ? selectedLookup.meaning
    : t("dictionary.wordNotFound");
  const selectedTranslation = selectedLookup?.found ? selectedLookup.translation : "";

  return (
    <main className="mx-auto max-w-6xl p-4 text-gray-950 dark:text-white">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            {t("dictionary.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold">{t("dictionary.title")}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t("dictionary.subtitle")}
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              aria-label={t("dictionary.sourceLanguage")}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-950"
            >
              <option value="auto">{t("dictionary.sourceAuto")}</option>
              <option value="de">{t("dictionary.german")}</option>
              <option value="fa">{t("dictionary.persian")}</option>
            </select>
            <button
              type="button"
              onClick={swapLanguages}
              aria-label={t("dictionary.swapLanguages")}
              className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              aria-label={t("dictionary.targetLanguage")}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-950"
            >
              <option value="de">{t("dictionary.german")}</option>
              <option value="fa">{t("dictionary.persian")}</option>
            </select>
          </div>
          <button
            type="button"
            onClick={toggleShowSaved}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Bookmark className="h-5 w-5" />
            <span>{t("dictionary.savedWords")}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_320px]">
          <div className="relative">
            <label htmlFor="dictionary-source-text" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t("dictionary.sourceText")}
            </label>
            <textarea
              id="dictionary-source-text"
              ref={textareaRef}
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              onSelect={handleSourceSelection}
              placeholder={t("dictionary.placeholder")}
              className="h-72 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-4 leading-7 text-gray-950 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputText(suggestion);
                      handleInputChange(suggestion);
                    }}
                    className="w-full px-4 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label id="dictionary-translated-text-label" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t("dictionary.translatedText")}
            </label>
            <div
              aria-labelledby="dictionary-translated-text-label"
              ref={translatedRef}
              onMouseUp={handleTranslatedSelection}
              onKeyUp={handleTranslatedSelection}
              tabIndex={0}
              className="h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-gray-300 bg-gray-50 p-4 leading-7 text-gray-950 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              {translatedText || (
                <span className="text-gray-500 dark:text-gray-400">
                  {t("dictionary.translationPlaceholder")}
                </span>
              )}
            </div>
            {isLoading && (
              <div className="absolute inset-x-0 bottom-0 top-7 flex items-center justify-center rounded-lg bg-white/60 dark:bg-gray-950/60">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
              </div>
            )}
            {error && (
              <div className="absolute inset-x-0 bottom-0 top-7 flex items-center justify-center rounded-lg bg-white/80 dark:bg-gray-950/80">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </div>

          <aside className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Search className="h-4 w-4" />
              {t("dictionary.selectedWord")}
            </div>

            {selectedLookup ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-2xl font-bold">{selectedText}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {selectedLookup.sourceLang === "fa"
                      ? t("dictionary.persian")
                      : selectedLookup.sourceLang === "de"
                        ? t("dictionary.german")
                        : t("dictionary.detectedWord")}
                  </p>
                </div>

                <div className="rounded-md bg-white p-3 text-sm dark:bg-gray-900">
                  <p className="font-semibold">{t("dictionary.meaning")}</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{selectedMeaning}</p>
                  {selectedTranslation && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {t("dictionary.translation")}: {selectedTranslation}
                    </p>
                  )}
                </div>

                {selectedLookup.examples && (
                  <div className="rounded-md bg-white p-3 text-sm dark:bg-gray-900">
                    <p className="font-semibold">{t("dictionary.example")}</p>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      {selectedLookup.examples.de}
                    </p>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      {selectedLookup.examples.fa}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handlePronounce}
                    disabled={!canPronounce}
                    className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-950"
                  >
                    <Volume2 className="h-4 w-4" />
                    {t("dictionary.pronounce")}
                  </button>
                  <button
                    type="button"
                    onClick={() => addWord(selectedText)}
                    className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold transition hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {t("dictionary.saveWord")}
                  </button>
                </div>
                {pronunciationMessage && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{pronunciationMessage}</p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {t("dictionary.selectWordHint")}
              </p>
            )}
          </aside>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => addWord(translatedText || inputText)}
            disabled={!translatedText && !inputText.trim()}
            className="rounded-md bg-gray-100 px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {t("dictionary.saveWord")}
          </button>
          <button
            type="button"
            onClick={translate}
            disabled={isLoading || !inputText.trim()}
            className="rounded-md bg-gray-950 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-950"
          >
            {t("dictionary.translate")}
          </button>
        </div>

        {showSaved && (
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
            <h3 className="mb-4 text-lg font-semibold">{t("dictionary.savedWords")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {savedWords.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800"
                >
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => removeWord(word)}
                    className="rounded-full p-1 transition-colors hover:bg-white dark:hover:bg-gray-900"
                  >
                    <BookmarkCheck className="h-4 w-4 text-emerald-600" />
                  </button>
                </div>
              ))}
              {!savedWords.length && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("dictionary.noSavedWords")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dictionary;
