"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Check, Headphones, MessageCircle, PenLine, X } from "lucide-react";
import {
  collectLearningEvent,
  createAttemptTimer,
  eventStatusLabelKey,
  learningEventStatus,
} from "../../services/learningEventCollector";
import {
  choicesForExercise,
  errorTypeForExercise,
  eventTypeForInteraction,
  exerciseExpectedAnswer,
  exercisePrompt,
  exerciseSupportText,
  exerciseTitle,
  loadPracticeExercises,
} from "../../services/exercisePracticeService";

export default function FlashcardApp() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [eventStatus, setEventStatus] = useState(learningEventStatus.idle);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [countsByExercise, setCountsByExercise] = useState({});
  const [writingByExercise, setWritingByExercise] = useState({});
  const attemptTimerRef = useRef(createAttemptTimer());

  useEffect(() => {
    let isMounted = true;
    loadPracticeExercises()
      .then((items) => {
        if (!isMounted) return;
        setExercises(items);
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

  const skillGroups = useMemo(() => {
    return exercises.reduce((groups, exercise) => {
      groups[exercise.skillArea] = groups[exercise.skillArea] || [];
      groups[exercise.skillArea].push(exercise);
      return groups;
    }, {});
  }, [exercises]);

  const selectedExercises = selectedSkill ? skillGroups[selectedSkill] || [] : [];

  const handleCardFlip = (exerciseId) => {
    setFlippedCardId(flippedCardId === exerciseId ? null : exerciseId);
  };

  const recordLearningEvent = async (exercise, extra = {}) => {
    const responseMs = attemptTimerRef.current.elapsedMs();
    setEventStatus(learningEventStatus.saving);
    try {
      const result = await collectLearningEvent({
        type: eventTypeForInteraction(exercise),
        exerciseId: exercise.id,
        correct: extra.correct,
        responseValue: extra.responseValue,
        responseMs,
        hintsUsed: extra.hintsUsed ?? (flippedCardId === exercise.id ? 1 : 0),
        retries: extra.correct === false ? 1 : 0,
        errorType: errorTypeForExercise(exercise),
      });
      const serverCorrect = Boolean(result.event?.correct);
      setCountsByExercise((current) => {
        const counts = current[exercise.id] || { correct: 0, wrong: 0 };
        return {
          ...current,
          [exercise.id]: {
            correct: counts.correct + (serverCorrect ? 1 : 0),
            wrong: counts.wrong + (serverCorrect ? 0 : 1),
          },
        };
      });
      setEventStatus(learningEventStatus.saved);
    } catch (error) {
      setEventStatus(learningEventStatus.failed);
    }

    setFlippedCardId(null);
    attemptTimerRef.current.reset();
  };

  const handleAnswerFeedback = async (exercise, isCorrect) => {
    await recordLearningEvent(exercise, {
      correct: isCorrect,
      responseValue: isCorrect ? "self_assessed_correct" : "self_assessed_incorrect",
    });
  };

  const handleChoice = async (exercise, choice) => {
    await recordLearningEvent(exercise, { responseValue: choice });
  };

  const handleWritingSubmit = async (exercise) => {
    const text = writingByExercise[exercise.id] || "";
    if (!text.trim()) return;
    await recordLearningEvent(exercise, { responseValue: text, hintsUsed: 0 });
  };

  const handleBackToSkills = () => {
    setSelectedSkill(null);
    setFlippedCardId(null);
    setEventStatus(learningEventStatus.idle);
    attemptTimerRef.current.reset();
  };

  const renderExercise = (exercise) => {
    const counts = countsByExercise[exercise.id] || { correct: 0, wrong: 0 };
    const interactionType = exercise.interactionType || "flashcard";

    if (interactionType === "multiple_choice") {
      return (
        <div className="flex h-full flex-col">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {exerciseTitle(exercise, t)}
          </p>
          <p className="mb-3 text-base font-medium">{exercisePrompt(exercise, t)}</p>
          <div className="flex-1 space-y-2">
            {choicesForExercise(exercise).map((choice) => (
              <button
                key={choice}
                type="button"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-left text-sm transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                onClick={(event) => {
                  event.stopPropagation();
                  handleChoice(exercise, choice);
                }}
              >
                {choice}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {t("practice.correct")}: {counts.correct} · {t("practice.wrong")}: {counts.wrong}
          </p>
        </div>
      );
    }

    if (interactionType === "writing_prompt" || interactionType === "conversation_practice") {
      const Icon = interactionType === "conversation_practice" ? MessageCircle : PenLine;
      return (
        <div className="flex h-full flex-col">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Icon className="h-4 w-4" />
            <span>{exerciseTitle(exercise, t)}</span>
          </div>
          <p className="mb-2 text-base font-medium">{exercisePrompt(exercise, t)}</p>
          <textarea
            value={writingByExercise[exercise.id] || ""}
            onChange={(event) =>
              setWritingByExercise({
                ...writingByExercise,
                [exercise.id]: event.target.value,
              })
            }
            onClick={(event) => event.stopPropagation()}
            className="min-h-20 flex-1 resize-none rounded-md border border-gray-200 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <button
            type="button"
            className="mt-3 rounded-md bg-gray-950 px-3 py-2 text-sm text-white dark:bg-white dark:text-gray-950"
            onClick={(event) => {
              event.stopPropagation();
              handleWritingSubmit(exercise);
            }}
          >
            {t("writing.submit")}
          </button>
        </div>
      );
    }

    if (interactionType === "listening_check") {
      return (
        <div className="flex h-full flex-col">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Headphones className="h-4 w-4" />
            <span>{exerciseTitle(exercise, t)}</span>
          </div>
          <p className="flex-1 text-base font-medium">{exercisePrompt(exercise, t)}</p>
          {exercise.resourceSourceUrl && (
            <audio
              controls
              src={exercise.resourceSourceUrl}
              className="mb-3 w-full"
              onClick={(event) => event.stopPropagation()}
            />
          )}
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            {exerciseSupportText(exercise)}
          </p>
          <div className="flex justify-between">
            <button
              type="button"
              className="mr-2 flex flex-1 items-center justify-center rounded-md border border-green-500 px-3 py-1 text-sm transition hover:bg-green-50 dark:hover:bg-green-950"
              onClick={(event) => {
                event.stopPropagation();
                recordLearningEvent(exercise, { responseValue: exerciseExpectedAnswer(exercise) });
              }}
            >
              <Check className="mr-1 h-4 w-4 text-green-500" />
              {t("practice.correct")}
            </button>
            <button
              type="button"
              className="ml-2 flex flex-1 items-center justify-center rounded-md border border-red-500 px-3 py-1 text-sm transition hover:bg-red-50 dark:hover:bg-red-950"
              onClick={(event) => {
                event.stopPropagation();
                recordLearningEvent(exercise, { responseValue: "" });
              }}
            >
              <X className="mr-1 h-4 w-4 text-red-500" />
              {t("practice.wrong")}
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {flippedCardId === exercise.id ? (
          <div className="flex h-full flex-col">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {t("practice.expectedAnswer")}
            </p>
            <p className="flex-1 text-base font-medium">
              {exerciseExpectedAnswer(exercise)}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                className="mr-2 flex flex-1 items-center justify-center rounded-md border border-green-500 px-3 py-1 text-sm transition hover:bg-green-50 dark:hover:bg-green-950"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAnswerFeedback(exercise, true);
                }}
              >
                <Check className="mr-1 h-4 w-4 text-green-500" />
                {t("practice.correct")}
              </button>
              <button
                type="button"
                className="ml-2 flex flex-1 items-center justify-center rounded-md border border-red-500 px-3 py-1 text-sm transition hover:bg-red-50 dark:hover:bg-red-950"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAnswerFeedback(exercise, false);
                }}
              >
                <X className="mr-1 h-4 w-4 text-red-500" />
                {t("practice.wrong")}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {exerciseTitle(exercise, t)}
            </p>
            <p className="flex-1 text-base font-medium">
              {exercisePrompt(exercise, t)}
            </p>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              {exerciseSupportText(exercise)}
            </p>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{t("practice.correct")}: {counts.correct}</span>
              <span>{t("practice.wrong")}: {counts.wrong}</span>
            </div>
          </div>
        )}
      </>
    );
  };

  if (loadStatus === "loading") {
    return (
      <section className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-center text-gray-500 dark:text-gray-400">{t("practice.loading")}</p>
      </section>
    );
  }

  if (loadStatus === "failed") {
    return (
      <section className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-center text-gray-500 dark:text-gray-400">{t("practice.loadFailed")}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        {t("practice.exercisePractice")}
      </h1>
      {eventStatusLabelKey(eventStatus) && (
        <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {t(eventStatusLabelKey(eventStatus))}
        </p>
      )}

      {!selectedSkill ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-semibold">{t("practice.chooseSkill")}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(skillGroups).map(([skillArea, items]) => (
                <button
                  key={skillArea}
                  type="button"
                  className="rounded-lg border border-gray-200 bg-white p-6 text-left transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                  onClick={() => {
                    setSelectedSkill(skillArea);
                    attemptTimerRef.current.reset();
                  }}
                >
                  <h3 className="text-lg font-medium">{t(`domain.${skillArea}`, skillArea)}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t("practice.exerciseCount", { count: items.length })}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-6 flex items-center">
            <button
              type="button"
              onClick={handleBackToSkills}
              className="mr-4 flex items-center justify-center rounded-md border border-gray-300 px-3 py-1 text-sm transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("practice.backToSkills")}
            </button>
            <h2 className="text-2xl font-semibold">{t(`domain.${selectedSkill}`, selectedSkill)}</h2>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 text-xl font-semibold">{t("practice.exerciseCards")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {selectedExercises.map((exercise) => {
                return (
                  <div
                    key={exercise.id}
                    className={`relative h-56 cursor-pointer rounded-lg border border-gray-200 shadow-sm transition dark:border-gray-700 ${
                      flippedCardId === exercise.id
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-900"
                    }`}
                    onClick={() => handleCardFlip(exercise.id)}
                  >
                    <div className="absolute inset-0 flex flex-col p-5">
                      {renderExercise(exercise)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
