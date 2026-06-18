const learnerNames = [
  "Arman Rahimi",
  "Sara Ahmadi",
  "Nika Moradi",
  "Darya Karimi",
  "Mahan Rezaei",
  "Tara Mohammadi",
  "Kian Hosseini",
  "Roya Sadeghi",
  "Parsa Kazemi",
  "Mina Ghasemi",
  "Arian Ebrahimi",
  "Hana Jafari",
  "Shayan Azizi",
  "Yasamin Farhadi",
  "Sina Abbasi",
  "Negin Salehi",
  "Pouya Akbari",
  "Ava Najafi",
  "Amir Maleki",
  "Liana Shariati",
];

export const skillAreas = [
  {
    id: "vocabulary-recall",
    label: "Vocabulary recall",
    subskills: ["nouns", "daily verbs", "separable verbs", "prepositions"],
  },
  {
    id: "grammar-accuracy",
    label: "Grammar accuracy",
    subskills: ["verb position", "cases", "present tense", "modal verbs"],
  },
  {
    id: "listening-comprehension",
    label: "Listening comprehension",
    subskills: ["numbers", "slow dialogue", "chapter audio", "dictation"],
  },
  {
    id: "reading-comprehension",
    label: "Reading comprehension",
    subskills: ["short texts", "instructions", "PDF passages", "dialogues"],
  },
  {
    id: "writing-quality",
    label: "Writing quality",
    subskills: ["sentence order", "spelling", "short answers", "email writing"],
  },
  {
    id: "translation-direction",
    label: "Translation direction",
    subskills: ["German to Persian", "Persian to German", "false friends"],
  },
  {
    id: "speaking-ability",
    label: "Speaking ability",
    subskills: ["greetings", "food", "entertainment", "daily life"],
  },
];

export const resources = [
  {
    id: "resource-hueber-a1",
    title: "Hueber German A1 Course PDF",
    type: "book",
    cefrLevel: "A1",
    skillArea: "reading-comprehension",
    sourceUrl: "/Hueber.pdf",
    description: "Primary beginner German course book used for reading and grammar review.",
  },
  {
    id: "resource-kapitel-2",
    title: "Kapitel 2 Audio",
    type: "audio",
    cefrLevel: "A1",
    skillArea: "listening-comprehension",
    sourceUrl: "/audio/kapitel2.mp3",
    description: "Listening practice for early A1 classroom and daily-life phrases.",
  },
  {
    id: "resource-kapitel-3",
    title: "Kapitel 3 Audio",
    type: "audio",
    cefrLevel: "A1",
    skillArea: "listening-comprehension",
    sourceUrl: "/audio/kapitel3.mp3",
    description: "Listening practice for questions, numbers, and short dialogues.",
  },
  {
    id: "resource-kapitel-4",
    title: "Kapitel 4 Audio",
    type: "audio",
    cefrLevel: "A2",
    skillArea: "listening-comprehension",
    sourceUrl: "/audio/kapitel4.mp3",
    description: "Listening practice for routines, travel, and intermediate phrases.",
  },
  {
    id: "resource-verb-bank",
    title: "Core German Verb Bank",
    type: "vocabulary",
    cefrLevel: "A1",
    skillArea: "vocabulary-recall",
    sourceUrl: "",
    description: "Essential verbs for synthetic learner practice and targeted exercises.",
  },
  {
    id: "resource-grammar-notes",
    title: "A1-A2 Grammar Notes",
    type: "grammar",
    cefrLevel: "A2",
    skillArea: "grammar-accuracy",
    sourceUrl: "",
    description: "Short explanations for verb position, present tense, cases, and modal verbs.",
  },
  {
    id: "resource-conversation-topics",
    title: "A1 Conversation Topics",
    type: "conversation",
    cefrLevel: "A1",
    skillArea: "speaking-ability",
    sourceUrl: "",
    description: "Topic-based speaking prompts for greetings, food, entertainment, and daily life.",
  },
];

export const germanVerbBank = [
  { infinitive: "sein", meaning: "to be", level: "A1", type: "irregular" },
  { infinitive: "haben", meaning: "to have", level: "A1", type: "irregular" },
  { infinitive: "gehen", meaning: "to go", level: "A1", type: "regular" },
  { infinitive: "kommen", meaning: "to come", level: "A1", type: "regular" },
  { infinitive: "machen", meaning: "to do/make", level: "A1", type: "regular" },
  { infinitive: "lernen", meaning: "to learn", level: "A1", type: "regular" },
  { infinitive: "sprechen", meaning: "to speak", level: "A1", type: "irregular" },
  { infinitive: "lesen", meaning: "to read", level: "A1", type: "irregular" },
  { infinitive: "schreiben", meaning: "to write", level: "A1", type: "regular" },
  { infinitive: "hoeren", meaning: "to hear/listen", level: "A1", type: "regular" },
  { infinitive: "verstehen", meaning: "to understand", level: "A1", type: "regular" },
  { infinitive: "arbeiten", meaning: "to work", level: "A1", type: "regular" },
  { infinitive: "wohnen", meaning: "to live/reside", level: "A1", type: "regular" },
  { infinitive: "kaufen", meaning: "to buy", level: "A1", type: "regular" },
  { infinitive: "essen", meaning: "to eat", level: "A1", type: "irregular" },
  { infinitive: "trinken", meaning: "to drink", level: "A1", type: "regular" },
  { infinitive: "fahren", meaning: "to drive/travel", level: "A2", type: "irregular" },
  { infinitive: "nehmen", meaning: "to take", level: "A2", type: "irregular" },
  { infinitive: "anrufen", meaning: "to call", level: "A2", type: "separable" },
  { infinitive: "aufstehen", meaning: "to get up", level: "A2", type: "separable" },
  { infinitive: "einkaufen", meaning: "to shop", level: "A2", type: "separable" },
  { infinitive: "mitbringen", meaning: "to bring along", level: "A2", type: "separable" },
  { infinitive: "koennen", meaning: "can/to be able", level: "A2", type: "modal" },
  { infinitive: "muessen", meaning: "must/to have to", level: "A2", type: "modal" },
  { infinitive: "wollen", meaning: "to want", level: "A2", type: "modal" },
  { infinitive: "sollen", meaning: "should/to be supposed to", level: "B1", type: "modal" },
];

const exerciseTemplates = [
  ["vocabulary-recall", "daily verbs", "flashcardReview"],
  ["vocabulary-recall", "separable verbs", "verbMeaningMatch"],
  ["grammar-accuracy", "verb position", "sentenceOrdering"],
  ["grammar-accuracy", "cases", "articleCaseDrill"],
  ["grammar-accuracy", "modal verbs", "modalVerbCompletion"],
  ["listening-comprehension", "chapter audio", "audioComprehensionQuiz"],
  ["listening-comprehension", "numbers", "numberDictation"],
  ["reading-comprehension", "PDF passages", "shortPassageQuestions"],
  ["reading-comprehension", "instructions", "instructionMatching"],
  ["writing-quality", "sentence order", "shortWritingCorrection"],
  ["writing-quality", "email writing", "guidedEmailSubmission"],
  ["translation-direction", "Persian to German", "translationProduction"],
  ["translation-direction", "German to Persian", "translationRecognition"],
  ["speaking-ability", "greetings", "conversationGreetings"],
  ["speaking-ability", "food", "conversationFood"],
];

export const exerciseBank = Array.from({ length: 39 }, (_, index) => {
  const [skillArea, subskill, titleKey] = exerciseTemplates[index % exerciseTemplates.length];
  const cefrLevel = index < 15 ? "A1" : index < 30 ? "A2" : "B1";
  const difficulty = index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard";
  const sequence = Math.floor(index / exerciseTemplates.length) + 1;

  return {
    id: `exercise-${String(index + 1).padStart(3, "0")}`,
    title: `${titleKey} ${sequence}`,
    titleKey,
    sequence,
    cefrLevel,
    difficulty,
    skillArea,
    subskill,
    resourceId: resources[index % resources.length].id,
    estimatedMinutes: 6 + (index % 5) * 2,
  };
});

const classes = [
  { id: "class-a1-alpha", name: "A1 Alpha", teacher: "Mina Farzan", school: "Lingoix Tehran" },
  { id: "class-a1-beta", name: "A1 Beta", teacher: "Omid Nouri", school: "Lingoix Tehran" },
  { id: "class-a2-delta", name: "A2 Delta", teacher: "Leila Rahbar", school: "Lingoix Shiraz" },
  { id: "class-b1-sigma", name: "B1 Sigma", teacher: "Kaveh Mehr", school: "Lingoix Online" },
];

const seededNumber = (seed) => {
  const raw = Math.sin(seed * 9301 + 49297) * 233280;
  return raw - Math.floor(raw);
};

const pick = (items, seed) => items[Math.floor(seededNumber(seed) * items.length) % items.length];

const clampScore = (value) => Math.max(35, Math.min(98, Math.round(value)));

const levelForIndex = (index) => {
  if (index % 10 === 0) return "B1";
  if (index % 3 === 0) return "A2";
  return "A1";
};

const eventTypes = ["answer_submitted", "hint_requested", "audio_replayed", "word_searched", "writing_submitted"];
const errorTypes = [
  "vocabulary recall error",
  "grammar tense error",
  "listening misrecognition",
  "spelling error",
  "translation direction error",
  "slow but correct response",
];

const buildPerformance = (index) =>
  skillAreas.reduce((performance, skill, skillIndex) => {
    const base = levelForIndex(index) === "B1" ? 72 : levelForIndex(index) === "A2" ? 64 : 56;
    performance[skill.id] = clampScore(base + seededNumber(index + skillIndex * 17) * 34 - 12);
    return performance;
  }, {});

const buildWeaknesses = (learnerId, performance) =>
  Object.entries(performance)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([skillAreaId], weaknessIndex) => {
      const skill = skillAreas.find((item) => item.id === skillAreaId);
      const subskill = skill.subskills[(learnerId.length + weaknessIndex) % skill.subskills.length];
      return {
        id: `${learnerId}-weakness-${weaknessIndex + 1}`,
        skillArea: skillAreaId,
        subskill,
        severity: weaknessIndex === 0 ? "high" : "medium",
        evidenceCount: 5 + weaknessIndex * 3,
      };
    });

const buildLearningEvents = (learnerId, performance, weaknesses, index) => {
  const events = [];

  for (let eventIndex = 0; eventIndex < 28; eventIndex += 1) {
    const eventType = eventTypes[(index + eventIndex) % eventTypes.length];
    const exercise = exerciseBank[(index * 7 + eventIndex) % exerciseBank.length];
    const weakness = weaknesses[eventIndex % weaknesses.length];
    const isWeakSkill = exercise.skillArea === weakness.skillArea;
    const score = performance[exercise.skillArea] || 60;
    const correctChance = (score - (isWeakSkill ? 14 : 0)) / 100;
    const correct = seededNumber(index * 100 + eventIndex) < correctChance;
    const responseMs = Math.round(2600 + (1 - score / 100) * 9000 + seededNumber(index + eventIndex * 23) * 5500);

    events.push({
      id: `${learnerId}-event-${String(eventIndex + 1).padStart(2, "0")}`,
      learnerId,
      type: eventType,
      exerciseId: exercise.id,
      skillArea: exercise.skillArea,
      subskill: exercise.subskill,
      correct,
      responseMs,
      hintsUsed: eventType === "hint_requested" ? 1 + (eventIndex % 2) : seededNumber(eventIndex + index) > 0.82 ? 1 : 0,
      retries: correct ? 0 : 1 + (eventIndex % 3 === 0 ? 1 : 0),
      errorType: correct ? null : errorTypes[(index + eventIndex) % errorTypes.length],
      occurredAt: `2026-06-${String(1 + (eventIndex % 14)).padStart(2, "0")}T${String(8 + (eventIndex % 10)).padStart(2, "0")}:00:00Z`,
    });
  }

  return events;
};

const buildAdaptiveDecisions = (learnerId, weaknesses, index) =>
  weaknesses.map((weakness, decisionIndex) => {
    const targetedExercises = exerciseBank
      .filter((exercise) => exercise.skillArea === weakness.skillArea)
      .slice(0, 4)
      .map((exercise) => exercise.id);

    return {
      id: `${learnerId}-decision-${decisionIndex + 1}`,
      learnerId,
      type: decisionIndex === 0 ? "remediation" : "practice_boost",
      status: index % 9 === 0 ? "teacher_review" : "active",
      reason: `${weakness.severity} ${weakness.subskill} weakness`,
      skillArea: weakness.skillArea,
      subskill: weakness.subskill,
      targetedExerciseIds: targetedExercises,
      createdAt: "2026-06-15T10:00:00Z",
    };
  });

export const learners = Array.from({ length: 100 }, (_, zeroIndex) => {
  const index = zeroIndex + 1;
  const id = `learner-${String(index).padStart(3, "0")}`;
  const cefrLevel = levelForIndex(index);
  const performance = buildPerformance(index);
  const skillWeaknesses = buildWeaknesses(id, performance);
  const learningEvents = buildLearningEvents(id, performance, skillWeaknesses, index);
  const adaptiveDecisions = buildAdaptiveDecisions(id, skillWeaknesses, index);
  const classInfo = classes[index % classes.length];
  const completedExercises = learningEvents.filter((event) => event.type === "answer_submitted" || event.type === "writing_submitted").length;
  const accuracy = Math.round((learningEvents.filter((event) => event.correct).length / learningEvents.length) * 100);

  return {
    id,
    name: `${learnerNames[zeroIndex % learnerNames.length]} ${Math.floor(zeroIndex / learnerNames.length) + 1}`,
    email: `learner${String(index).padStart(3, "0")}@lingoix.test`,
    role: "Learner",
    cefrLevel,
    nativeLanguage: "Persian",
    targetLanguage: "German",
    goal: pick(["university admission", "migration interview", "travel confidence", "work communication"], index),
    classId: classInfo.id,
    className: classInfo.name,
    teacher: classInfo.teacher,
    school: classInfo.school,
    currentLesson: `Kapitel ${1 + (index % 4)}`,
    learningPath: [
      "Placement review",
      `Kapitel ${1 + (index % 4)} resource study`,
      "Targeted exercise block",
      "Checkpoint assessment",
      "Next lesson unlock",
    ],
    performance,
    progressPercent: clampScore(38 + index * 0.42 + seededNumber(index) * 28),
    completedExercises,
    accuracy,
    averageResponseMs: Math.round(
      learningEvents.reduce((sum, event) => sum + event.responseMs, 0) / learningEvents.length
    ),
    skillWeaknesses,
    learningEvents,
    adaptiveDecisions,
  };
});

export const platformRoles = ["Learner", "Teacher", "School Admin", "Platform Admin"];
export const classCatalog = classes;
