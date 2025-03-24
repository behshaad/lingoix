import { useRef } from "react";
import { ArrowLeftRight, Bookmark, BookmarkCheck } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useSavedWords } from "../../hooks/useSavedWords";

const Dictionary = () => {
  const textareaRef = useRef(null);

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-card rounded-lg shadow-lg p-6">
        {/* Language Selection */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="bg-muted border border-border rounded-md px-3 py-2"
            >
              <option value="auto">Auto Detect</option>
              <option value="de">German</option>
              <option value="fa">Persian</option>
            </select>
            <button
              onClick={swapLanguages}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-muted border border-border rounded-md px-3 py-2"
            >
              <option value="de">German</option>
              <option value="fa">Persian</option>
            </select>
          </div>
          <button
            onClick={toggleShowSaved}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            <Bookmark className="h-5 w-5" />
            <span>Saved Words</span>
          </button>
        </div>

        {/* Translation Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-48 p-4 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputText(suggestion);
                      handleInputChange(suggestion);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <textarea
              value={translatedText}
              readOnly
              className="w-full h-48 p-4 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={translate}
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Translate
          </button>
        </div>

        {/* Saved Words Section */}
        {showSaved && (
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Saved Words</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedWords.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span>{word}</span>
                  <button
                    onClick={() => removeWord(word)}
                    className="p-1 hover:bg-background rounded-full transition-colors"
                  >
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;
