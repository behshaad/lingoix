import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { MdThumbUp, MdThumbDown, MdRefresh, MdGrade } from "react-icons/md";
import {
  collectLearningEvent,
  createAttemptTimer,
  eventStatusLabelKey,
  learningEventStatus,
} from "../../services/learningEventCollector";
import {
  errorTypeForExercise,
  exerciseExpectedAnswer,
  exercisePrompt,
  exerciseSupportText,
  exerciseTitle,
  loadPracticeExercises,
} from "../../services/exercisePracticeService";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

export default function VocabularyPractice() {
  const { t } = useTranslation();
  const [vocabularyData, setVocabularyData] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [eventStatus, setEventStatus] = useState(learningEventStatus.idle);
  const cardRef = useRef(null);
  const attemptTimerRef = useRef(createAttemptTimer());

  useEffect(() => {
    let isMounted = true;
    loadPracticeExercises("vocabulary-recall")
      .then((items) => {
        if (!isMounted) return;
        setVocabularyData(items);
        setLoadStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadStatus("failed");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!cardRef.current) return;

    // Animate card flip
    if (isFlipped) {
      gsap.to(cardRef.current, {
        rotateY: 180,
        duration: 0.6,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(cardRef.current, {
        rotateY: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }
  }, [isFlipped]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(true);
  };

  const handleDifficulty = async (level) => {
    const responseMs = attemptTimerRef.current.elapsedMs();
    setDifficulty(level);
    setEventStatus(learningEventStatus.saving);

    try {
      await collectLearningEvent({
        type: "answer_submitted",
        exerciseId: currentVocabulary.id,
        skillArea: currentVocabulary.skillArea,
        subskill: currentVocabulary.subskill,
        correct: level !== "hard",
        responseMs,
        retries: level === "medium" ? 1 : 0,
        errorType:
          level === "hard"
            ? errorTypeForExercise(currentVocabulary)
            : level === "medium"
            ? "slow but correct response"
            : null,
      });
      setEventStatus(learningEventStatus.saved);
    } catch (error) {
      setEventStatus(learningEventStatus.failed);
    }

    setIsFlipped(false);
    setShowAnswer(false);
    setCurrentCard((prev) => (prev + 1) % vocabularyData.length);
    attemptTimerRef.current.reset();
  };

  const currentVocabulary = vocabularyData[currentCard];

  if (loadStatus === "loading") {
    return (
      <div className="min-h-screen bg-background py-8 text-foreground">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">{t("practice.loading")}</p>
        </div>
      </div>
    );
  }

  if (loadStatus === "failed" || !currentVocabulary) {
    return (
      <div className="min-h-screen bg-background py-8 text-foreground">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">{t("practice.loadFailed")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">تمرین واژگان</h1>
        <p className="mb-4 text-muted-foreground">
          سطح انتخاب شده: {difficulty === "easy" ? "آسان" : difficulty === "medium" ? "متوسط" : "سخت"}
        </p>
        {eventStatusLabelKey(eventStatus) && (
          <p className="mb-4 text-sm text-muted-foreground">
            {t(eventStatusLabelKey(eventStatus))}
          </p>
        )}

        {/* Flashcard */}
        <div className="max-w-2xl mx-auto mb-8">
          <div
            ref={cardRef}
            className="relative h-96 cursor-pointer perspective-1000"
            onClick={handleFlip}
          >
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full bg-card rounded-lg p-8 flex flex-col items-center justify-center shadow-lg">
                <h2 className="text-4xl font-bold mb-4">
                  {exerciseTitle(currentVocabulary, t)}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {exercisePrompt(currentVocabulary, t)}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {exerciseSupportText(currentVocabulary)}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="h-full bg-card rounded-lg p-8 flex flex-col items-center justify-center shadow-lg">
                <h2 className="text-4xl font-bold mb-4">
                  {t("practice.expectedAnswer")}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {exerciseExpectedAnswer(currentVocabulary)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Buttons */}
        {showAnswer && (
          <div className="max-w-2xl mx-auto flex justify-center gap-4">
            <button
              onClick={() => handleDifficulty("easy")}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <MdThumbUp className="h-5 w-5" />
              <span>آسان</span>
            </button>
            <button
              onClick={() => handleDifficulty("medium")}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <MdGrade className="h-5 w-5" />
              <span>متوسط</span>
            </button>
            <button
              onClick={() => handleDifficulty("hard")}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <MdThumbDown className="h-5 w-5" />
              <span>سخت</span>
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">پیشرفت</span>
            <span className="text-sm font-medium">
              {currentCard + 1} / {vocabularyData.length}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${((currentCard + 1) / vocabularyData.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="max-w-2xl mx-auto mt-8 flex justify-center">
          <button
            onClick={() => {
              setCurrentCard(0);
              setIsFlipped(false);
              setShowAnswer(false);
              attemptTimerRef.current.reset();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            <MdRefresh className="h-5 w-5" />
            <span>شروع مجدد</span>
          </button>
        </div>
      </div>
    </div>
  );
}
