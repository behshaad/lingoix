import { useMemo, useState } from "react";
import { Award, Flame, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  applyAnswerResult,
  completeLesson,
  deerLinguaLessons,
  emitDeerLinguaReaction,
  loadDemoProgress,
  saveDemoProgress,
} from "../../services/deerLinguaLearningEngine";
import "./DeerLinguaLessonFlow.css";

const DeerLinguaLessonFlow = () => {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const [progress, setProgress] = useState(() => loadDemoProgress());
  const [lessonIndex, setLessonIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const lesson = deerLinguaLessons[lessonIndex];
  const exercise = lesson.exercises[exerciseIndex];
  const completedCount = progress.completedLessons.length;
  const lessonProgress = Math.round((exerciseIndex / lesson.exercises.length) * 100);

  const questItems = useMemo(
    () =>
      progress.dailyQuests.map((quest) => ({
        ...quest,
        percent: Math.round((quest.progress / quest.target) * 100),
      })),
    [progress.dailyQuests]
  );

  const handleAnswer = (answer) => {
    if (feedback) return;
    const isCorrect = answer === exercise.answer;
    const xpAward = isCorrect ? lesson.xp : 0;
    const nextProgress = applyAnswerResult(progress, {
      isCorrect,
      lessonId: lesson.id,
      exerciseId: exercise.id,
      xpAward,
    });
    saveDemoProgress(nextProgress);
    setProgress(nextProgress);
    setSelectedAnswer(answer);
    setFeedback(isCorrect ? "correct" : "wrong");
    emitDeerLinguaReaction({
      type: isCorrect ? "celebrating" : "reacting",
      lessonId: lesson.id,
      exerciseId: exercise.id,
    });
  };

  const goNext = () => {
    if (exerciseIndex + 1 < lesson.exercises.length) {
      setExerciseIndex((current) => current + 1);
      setSelectedAnswer("");
      setFeedback(null);
      emitDeerLinguaReaction({ type: "walking" });
      return;
    }

    const nextProgress = completeLesson(progress, lesson);
    setProgress(nextProgress);
    setSelectedAnswer("");
    setFeedback(null);
    setExerciseIndex(0);
    setLessonIndex((current) => (current + 1) % deerLinguaLessons.length);
    emitDeerLinguaReaction({ type: "celebrating" });
  };

  return (
    <section className="deerlingua-lesson" dir={isFa ? "rtl" : "ltr"}>
      <div className="deerlingua-lesson__hero">
        <div>
          <p className="deerlingua-lesson__eyebrow">
            <Sparkles size={17} aria-hidden="true" />
            {t("deerLingua.practiceEyebrow")}
          </p>
          <h1>{t("deerLingua.practiceTitle")}</h1>
          <p>{t("deerLingua.practiceSubtitle")}</p>
        </div>
        <div className="deerlingua-lesson__stats" aria-label={t("deerLingua.statsLabel")}>
          <span>
            <Award size={18} aria-hidden="true" />
            {progress.xp} XP
          </span>
          <span>
            <Trophy size={18} aria-hidden="true" />
            {t("deerLingua.level", { level: progress.level })}
          </span>
          <span>
            <Flame size={18} aria-hidden="true" />
            {t("deerLingua.streak", { count: progress.streak })}
          </span>
        </div>
      </div>

      <div className="deerlingua-lesson__grid">
        <article className="deerlingua-lesson__card">
          <div className="deerlingua-lesson__card-header">
            <div>
              <p>{lesson.section} · {lesson.unit}</p>
              <h2>{lesson.title}</h2>
            </div>
            <span>{completedCount}/{deerLinguaLessons.length}</span>
          </div>

          <div className="deerlingua-lesson__progress">
            <span style={{ width: `${lessonProgress}%` }} />
          </div>

          <div className="deerlingua-lesson__prompt">
            <span>{t(`deerLingua.exerciseTypes.${exercise.type}`)}</span>
            <h3>{isFa ? exercise.promptFa : exercise.prompt}</h3>
          </div>

          <div className="deerlingua-lesson__answers">
            {exercise.options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={Boolean(feedback)}
                className={[
                  selectedAnswer === option ? "is-selected" : "",
                  feedback && option === exercise.answer ? "is-correct" : "",
                  feedback === "wrong" && selectedAnswer === option ? "is-wrong" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`deerlingua-lesson__feedback deerlingua-lesson__feedback--${feedback}`}>
              <p>
                {feedback === "correct"
                  ? t("deerLingua.correctFeedback")
                  : t("deerLingua.wrongFeedback", { answer: exercise.answer })}
              </p>
              <button type="button" onClick={goNext}>
                {t("continue")}
              </button>
            </div>
          )}
        </article>

        <aside className="deerlingua-lesson__side">
          <section>
            <h2>{t("deerLingua.dailyQuests")}</h2>
            {questItems.map((quest) => (
              <div className="deerlingua-lesson__quest" key={quest.id}>
                <div>
                  <span>{t(quest.labelKey)}</span>
                  <strong>{quest.progress}/{quest.target}</strong>
                </div>
                <div>
                  <span style={{ width: `${quest.percent}%` }} />
                </div>
              </div>
            ))}
          </section>

          <section>
            <h2>{t("deerLingua.reviewQueue")}</h2>
            <p>{t("deerLingua.reviewCount", { count: progress.reviewQueue.length })}</p>
          </section>

          <button
            type="button"
            className="deerlingua-lesson__reset"
            onClick={() => {
              const clean = {
                xp: 0,
                level: 1,
                streak: 1,
                completedLessons: [],
                correctAnswers: 0,
                wrongAnswers: 0,
                dailyQuests: progress.dailyQuests.map((quest) => ({ ...quest, progress: 0 })),
                reviewQueue: [],
              };
              saveDemoProgress(clean);
              setProgress(clean);
              setLessonIndex(0);
              setExerciseIndex(0);
              setFeedback(null);
              setSelectedAnswer("");
              emitDeerLinguaReaction({ type: "thinking" });
            }}
          >
            <RotateCcw size={16} aria-hidden="true" />
            {t("deerLingua.resetDemo")}
          </button>
        </aside>
      </div>
    </section>
  );
};

export default DeerLinguaLessonFlow;
