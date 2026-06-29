const PROGRESS_KEY = "deerLinguaDemoProgress";

export const deerLinguaLessons = [
  {
    id: "basics-1",
    section: "German Basics",
    unit: "Unit 1",
    title: "Greetings",
    xp: 10,
    exercises: [
      {
        id: "hello-choice",
        type: "multiple_choice",
        prompt: "What does Hallo mean?",
        promptFa: "«Hallo» به چه معناست؟",
        options: ["Hello", "Goodbye", "Thanks", "Please"],
        answer: "Hello",
      },
      {
        id: "thanks-fill",
        type: "fill_blank",
        prompt: "Complete: Danke means ____.",
        promptFa: "کامل کنید: «Danke» یعنی ____.",
        options: ["thanks", "water", "book", "night"],
        answer: "thanks",
      },
      {
        id: "morning-translation",
        type: "translation",
        prompt: "Translate to English: Guten Morgen",
        promptFa: "به انگلیسی ترجمه کنید: Guten Morgen",
        options: ["Good morning", "Good night", "See you", "My name is"],
        answer: "Good morning",
      },
    ],
  },
  {
    id: "basics-2",
    section: "German Basics",
    unit: "Unit 1",
    title: "Introductions",
    xp: 15,
    exercises: [
      {
        id: "name-choice",
        type: "multiple_choice",
        prompt: "Ich heiße Sara means...",
        promptFa: "«Ich heiße Sara» یعنی...",
        options: ["My name is Sara", "I am from Sara", "Sara is learning", "Goodbye Sara"],
        answer: "My name is Sara",
      },
      {
        id: "please-fill",
        type: "fill_blank",
        prompt: "Bitte means ____.",
        promptFa: "«Bitte» یعنی ____.",
        options: ["please", "today", "green", "teacher"],
        answer: "please",
      },
    ],
  },
];

export const defaultDemoProgress = {
  xp: 0,
  level: 1,
  streak: 1,
  completedLessons: [],
  correctAnswers: 0,
  wrongAnswers: 0,
  dailyQuests: [
    { id: "earn-20-xp", target: 20, progress: 0, labelKey: "deerLingua.quests.earnXp" },
    { id: "answer-3", target: 3, progress: 0, labelKey: "deerLingua.quests.answerQuestions" },
  ],
  reviewQueue: [],
};

export const loadDemoProgress = () => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? { ...defaultDemoProgress, ...JSON.parse(stored) } : defaultDemoProgress;
  } catch {
    return defaultDemoProgress;
  }
};

export const saveDemoProgress = (progress) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return progress;
};

export const resetDemoProgress = () => saveDemoProgress(defaultDemoProgress);

export const nextLevelForXp = (xp) => Math.max(1, Math.floor(xp / 50) + 1);

export const applyAnswerResult = (progress, { isCorrect, lessonId, exerciseId, xpAward = 0 }) => {
  const nextXp = progress.xp + xpAward;
  const answerQuestProgress = progress.dailyQuests.map((quest) => {
    if (quest.id === "earn-20-xp") {
      return { ...quest, progress: Math.min(quest.target, quest.progress + xpAward) };
    }
    if (quest.id === "answer-3") {
      return { ...quest, progress: Math.min(quest.target, quest.progress + 1) };
    }
    return quest;
  });

  return {
    ...progress,
    xp: nextXp,
    level: nextLevelForXp(nextXp),
    correctAnswers: progress.correctAnswers + (isCorrect ? 1 : 0),
    wrongAnswers: progress.wrongAnswers + (isCorrect ? 0 : 1),
    dailyQuests: answerQuestProgress,
    reviewQueue: isCorrect
      ? progress.reviewQueue.filter((item) => item.exerciseId !== exerciseId)
      : [
          ...progress.reviewQueue.filter((item) => item.exerciseId !== exerciseId),
          { lessonId, exerciseId, due: Date.now() + 1000 * 60 * 60 * 24 },
        ],
  };
};

export const completeLesson = (progress, lesson) => {
  const completedLessons = progress.completedLessons.includes(lesson.id)
    ? progress.completedLessons
    : [...progress.completedLessons, lesson.id];

  return saveDemoProgress({
    ...progress,
    completedLessons,
  });
};

export const emitDeerLinguaReaction = (detail) => {
  window.dispatchEvent(new CustomEvent("deerlingua:reaction", { detail }));
};
