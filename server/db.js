const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const dataModule = require("../src/data/learningData");

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "lingoix.sqlite");
const schemaPath = path.join(__dirname, "schema.sql");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

const runSchema = () => {
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);
};

const defaultExerciseContent = (exercise) => {
  const title = exercise.title || exercise.titleKey || "Exercise";

  if (exercise.skillArea === "vocabulary-recall") {
    return {
      interactionType: "flashcard",
      prompt: `Review the German vocabulary item for ${exercise.subskill}.`,
      expectedAnswer: "Recall the Persian meaning and mark your confidence.",
      choices: [],
      scoringRule: { type: "self_assessed" },
      supportText: "Use this card to identify whether recall is automatic, slow, or missing.",
    };
  }

  if (exercise.skillArea === "listening-comprehension") {
    return {
      interactionType: "listening_check",
      prompt: `Listen to the ${exercise.subskill} material and check your understanding.`,
      expectedAnswer: "Mark correct if you understood the main meaning without guessing.",
      choices: [],
      scoringRule: { type: "exact_text" },
      supportText: "Replay audio only when needed; transcript use is counted as a hint.",
    };
  }

  if (exercise.skillArea === "writing-quality") {
    return {
      interactionType: "writing_prompt",
      prompt: `Write a short German answer focused on ${exercise.subskill}.`,
      expectedAnswer: "A clear German response with acceptable spelling and sentence order.",
      choices: [],
      scoringRule: { type: "min_length_keywords", minLength: 80, keywords: [] },
      supportText: "Aim for at least two complete German sentences.",
    };
  }

  if (exercise.skillArea === "grammar-accuracy") {
    return {
      interactionType: "multiple_choice",
      prompt: `Complete a German grammar task about ${exercise.subskill}.`,
      expectedAnswer: "Use the correct German form.",
      choices: ["Use the correct German form.", "Use Persian word order.", "Skip the verb ending."],
      scoringRule: { type: "exact_choice" },
      supportText: "Pay attention to verb position, tense, case, and agreement.",
    };
  }

  if (exercise.skillArea === "speaking-ability") {
    return {
      interactionType: "conversation_practice",
      prompt: `Answer a short German conversation prompt about ${exercise.subskill}.`,
      expectedAnswer: "Respond with a relevant German phrase or short sentence.",
      choices: [],
      scoringRule: { type: "contains_keywords", keywords: [] },
      supportText: "Focus on useful conversation language; pronunciation analysis will come later.",
    };
  }

  if (exercise.skillArea === "translation-direction") {
    return {
      interactionType: "flashcard",
      prompt: `Translate in the required direction: ${exercise.subskill}.`,
      expectedAnswer: "A meaning-preserving translation.",
      choices: [],
      scoringRule: { type: "self_assessed" },
      supportText: "Focus on direction-specific errors and false friends.",
    };
  }

  return {
    interactionType: "flashcard",
    prompt: title,
    expectedAnswer: "Complete the task and mark the result honestly.",
    choices: [],
    scoringRule: { type: "self_assessed" },
    supportText: "This exercise is managed from the admin exercise bank.",
  };
};

const ensureColumns = (tableName, additions) => {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all().map((column) => column.name);
  additions.forEach(([name, definition]) => {
    if (!columns.includes(name)) {
      db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${name} ${definition}`);
    }
  });
};

const ensureContentColumns = () => {
  const additions = [
    ["interaction_type", "TEXT NOT NULL DEFAULT 'flashcard'"],
    ["prompt", "TEXT NOT NULL DEFAULT ''"],
    ["expected_answer", "TEXT NOT NULL DEFAULT ''"],
    ["choices", "TEXT NOT NULL DEFAULT '[]'"],
    ["scoring_rule", "TEXT NOT NULL DEFAULT '{}'"],
    ["support_text", "TEXT NOT NULL DEFAULT ''"],
  ];

  ensureColumns("exercises", additions);
  ensureColumns("resources", [
    ["status", "TEXT NOT NULL DEFAULT 'published'"],
    ["attachments", "TEXT NOT NULL DEFAULT '[]'"],
  ]);
  ensureColumns("accounts", [
    ["avatar_url", "TEXT"],
    ["phone", "TEXT NOT NULL DEFAULT ''"],
    ["bio", "TEXT NOT NULL DEFAULT ''"],
  ]);
  ensureColumns("learning_events", [
    ["response_value", "TEXT"],
    ["score", "REAL"],
  ]);
  ensureColumns("adaptive_decisions", [
    ["evidence_snapshot", "TEXT NOT NULL DEFAULT '{}'"],
    ["override_targeted_exercise_ids", "TEXT NOT NULL DEFAULT '[]'"],
    ["priority", "TEXT NOT NULL DEFAULT 'medium'"],
    ["applied_at", "TEXT"],
  ]);
};

const backfillExerciseContent = () => {
  const exercises = db.prepare("SELECT * FROM exercises").all();
  const update = db.prepare(`
    UPDATE exercises
    SET interaction_type = @interactionType,
      prompt = @prompt,
      expected_answer = @expectedAnswer,
      choices = @choices,
      scoring_rule = @scoringRule,
      support_text = @supportText
    WHERE id = @id
  `);

  const transaction = db.transaction(() => {
    exercises.forEach((exercise) => {
      const content = defaultExerciseContent({
        title: exercise.title,
        titleKey: exercise.title_key,
        skillArea: exercise.skill_area,
        subskill: exercise.subskill,
      });
      if (
        exercise.interaction_type === content.interactionType &&
        exercise.prompt &&
        exercise.expected_answer &&
        exercise.choices &&
        exercise.scoring_rule &&
        exercise.scoring_rule !== "{}" &&
        exercise.support_text
      ) return;
      update.run({
        id: exercise.id,
        ...content,
        choices: JSON.stringify(content.choices),
        scoringRule: JSON.stringify(content.scoringRule),
      });
    });
  });

  transaction();
};

const ensureSpeakingSeedData = () => {
  const resource = {
    id: "resource-conversation-topics",
    title: "A1 Conversation Topics",
    type: "conversation",
    cefrLevel: "A1",
    skillArea: "speaking-ability",
    sourceUrl: "",
    description: "Topic-based speaking prompts for greetings, food, entertainment, and daily life.",
    status: "published",
    attachments: JSON.stringify([]),
  };
  db.prepare(`
    INSERT OR IGNORE INTO resources (
      id, title, type, cefr_level, skill_area, source_url, description, status, attachments
    ) VALUES (
      @id, @title, @type, @cefrLevel, @skillArea, @sourceUrl, @description, @status, @attachments
    )
  `).run(resource);

  const exercises = [
    {
      id: "exercise-speaking-greetings",
      title: "Conversation greetings 1",
      titleKey: "conversationGreetings",
      sequence: 1,
      cefrLevel: "A1",
      difficulty: "easy",
      skillArea: "speaking-ability",
      subskill: "greetings",
      resourceId: resource.id,
      estimatedMinutes: 6,
      interactionType: "conversation_practice",
      prompt: "A classmate says: Hallo! Wie heisst du? Answer in German.",
      expectedAnswer: "Hallo, ich heisse ...",
      choices: [],
      scoringRule: { type: "contains_keywords", keywords: ["ich", "heisse"] },
      supportText: "Use a short greeting and introduce yourself.",
    },
    {
      id: "exercise-speaking-food",
      title: "Conversation food 1",
      titleKey: "conversationFood",
      sequence: 1,
      cefrLevel: "A1",
      difficulty: "easy",
      skillArea: "speaking-ability",
      subskill: "food",
      resourceId: resource.id,
      estimatedMinutes: 8,
      interactionType: "conversation_practice",
      prompt: "Answer in German: Was isst du gern?",
      expectedAnswer: "Ich esse gern ...",
      choices: [],
      scoringRule: { type: "contains_keywords", keywords: ["ich", "esse", "gern"] },
      supportText: "Name one food and keep the sentence conversational.",
    },
  ];

  const insertExercise = db.prepare(`
    INSERT OR IGNORE INTO exercises (
      id, title, title_key, sequence, cefr_level, difficulty, skill_area,
      subskill, resource_id, estimated_minutes, interaction_type, prompt,
      expected_answer, choices, scoring_rule, support_text
    ) VALUES (
      @id, @title, @titleKey, @sequence, @cefrLevel, @difficulty, @skillArea,
      @subskill, @resourceId, @estimatedMinutes, @interactionType, @prompt,
      @expectedAnswer, @choices, @scoringRule, @supportText
    )
  `);

  const transaction = db.transaction(() => {
    exercises.forEach((exercise) => insertExercise.run({
      ...exercise,
      choices: JSON.stringify(exercise.choices),
      scoringRule: JSON.stringify(exercise.scoringRule),
    }));
  });
  transaction();
};

const normalizeAdaptiveDecisionStatuses = () => {
  db.prepare(`
    UPDATE adaptive_decisions
    SET status = 'proposed'
    WHERE status IN ('active', 'teacher_review')
  `).run();
};

const seedAccounts = () => {
  const insertAccount = db.prepare(`
    INSERT OR IGNORE INTO accounts (
      id, email, password_hash, role, display_name, learner_id, teacher_name, school_name
    ) VALUES (
      @id, @email, @passwordHash, @role, @displayName, @learnerId, @teacherName, @schoolName
    )
  `);
  const passwordHash = bcrypt.hashSync("Lingoix123!", 10);
  const accounts = [
    {
      id: "account-learner-demo",
      email: "learner@lingoix.test",
      passwordHash,
      role: "learner",
      displayName: "Arman Rahimi",
      learnerId: "learner-001",
      teacherName: null,
      schoolName: null,
    },
    {
      id: "account-teacher-demo",
      email: "teacher@lingoix.test",
      passwordHash,
      role: "teacher",
      displayName: "Mina Farzan",
      learnerId: null,
      teacherName: "Mina Farzan",
      schoolName: "Lingoix Tehran",
    },
    {
      id: "account-school-admin-demo",
      email: "school@lingoix.test",
      passwordHash,
      role: "school_admin",
      displayName: "Lingoix Tehran Admin",
      learnerId: null,
      teacherName: null,
      schoolName: "Lingoix Tehran",
    },
    {
      id: "account-platform-admin-demo",
      email: "admin@lingoix.test",
      passwordHash,
      role: "platform_admin",
      displayName: "Platform Admin",
      learnerId: null,
      teacherName: null,
      schoolName: null,
    },
  ];

  const transaction = db.transaction(() => {
    accounts.forEach((account) => insertAccount.run(account));
  });
  transaction();
};

const seedDomainData = () => {
  const existing = db.prepare("SELECT COUNT(*) AS count FROM learners").get();
  if (existing.count > 0) return;

  const insertLearner = db.prepare(`
    INSERT INTO learners (
      id, name, email, cefr_level, native_language, target_language, goal,
      class_id, class_name, teacher, school, current_lesson, learning_path,
      performance, progress_percent, completed_exercises, accuracy, average_response_ms
    ) VALUES (
      @id, @name, @email, @cefrLevel, @nativeLanguage, @targetLanguage, @goal,
      @classId, @className, @teacher, @school, @currentLesson, @learningPath,
      @performance, @progressPercent, @completedExercises, @accuracy, @averageResponseMs
    )
  `);
  const insertResource = db.prepare(`
    INSERT INTO resources (
      id, title, type, cefr_level, skill_area, source_url, description, status, attachments
    ) VALUES (
      @id, @title, @type, @cefrLevel, @skillArea, @sourceUrl, @description, 'published', '[]'
    )
  `);
  const insertExercise = db.prepare(`
    INSERT INTO exercises (
      id, title, title_key, sequence, cefr_level, difficulty, skill_area,
      subskill, resource_id, estimated_minutes, interaction_type, prompt,
      expected_answer, choices, scoring_rule, support_text
    ) VALUES (
      @id, @title, @titleKey, @sequence, @cefrLevel, @difficulty, @skillArea,
      @subskill, @resourceId, @estimatedMinutes, @interactionType, @prompt,
      @expectedAnswer, @choices, @scoringRule, @supportText
    )
  `);
  const insertWeakness = db.prepare(`
    INSERT INTO skill_weaknesses (
      id, learner_id, skill_area, subskill, severity, evidence_count
    ) VALUES (
      @id, @learnerId, @skillArea, @subskill, @severity, @evidenceCount
    )
  `);
  const insertEvent = db.prepare(`
    INSERT INTO learning_events (
      id, learner_id, type, exercise_id, skill_area, subskill, correct,
      response_ms, hints_used, retries, error_type, occurred_at
    ) VALUES (
      @id, @learnerId, @type, @exerciseId, @skillArea, @subskill, @correct,
      @responseMs, @hintsUsed, @retries, @errorType, @occurredAt
    )
  `);
  const insertDecision = db.prepare(`
    INSERT INTO adaptive_decisions (
      id, learner_id, type, status, reason, skill_area, subskill,
      targeted_exercise_ids, evidence_snapshot, priority, created_at
    ) VALUES (
      @id, @learnerId, @type, @status, @reason, @skillArea, @subskill,
      @targetedExerciseIds, '{}', 'medium', @createdAt
    )
  `);

  const transaction = db.transaction(() => {
    dataModule.resources.forEach((resource) => insertResource.run(resource));
    dataModule.exerciseBank.forEach((exercise) => insertExercise.run({
      ...exercise,
      ...defaultExerciseContent(exercise),
      choices: JSON.stringify(defaultExerciseContent(exercise).choices),
      scoringRule: JSON.stringify(defaultExerciseContent(exercise).scoringRule),
    }));
    dataModule.learners.forEach((learner) => {
      insertLearner.run({
        ...learner,
        learningPath: JSON.stringify(learner.learningPath),
        performance: JSON.stringify(learner.performance),
      });
      learner.skillWeaknesses.forEach((weakness) => insertWeakness.run({
        ...weakness,
        learnerId: learner.id,
      }));
      learner.learningEvents.forEach((event) => insertEvent.run({
        ...event,
        correct: event.correct ? 1 : 0,
      }));
      learner.adaptiveDecisions.forEach((decision) => insertDecision.run({
        ...decision,
        status: decision.status === "active" || decision.status === "teacher_review" ? "proposed" : decision.status,
        targetedExerciseIds: JSON.stringify(decision.targetedExerciseIds),
      }));
    });
  });

  transaction();
};

const initializeDatabase = () => {
  runSchema();
  ensureContentColumns();
  seedAccounts();
  seedDomainData();
  ensureSpeakingSeedData();
  normalizeAdaptiveDecisionStatuses();
  backfillExerciseContent();
};

module.exports = {
  db,
  initializeDatabase,
};
