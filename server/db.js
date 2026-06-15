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
      id, title, type, cefr_level, skill_area, source_url, description
    ) VALUES (
      @id, @title, @type, @cefrLevel, @skillArea, @sourceUrl, @description
    )
  `);
  const insertExercise = db.prepare(`
    INSERT INTO exercises (
      id, title, title_key, sequence, cefr_level, difficulty, skill_area,
      subskill, resource_id, estimated_minutes
    ) VALUES (
      @id, @title, @titleKey, @sequence, @cefrLevel, @difficulty, @skillArea,
      @subskill, @resourceId, @estimatedMinutes
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
      targeted_exercise_ids, created_at
    ) VALUES (
      @id, @learnerId, @type, @status, @reason, @skillArea, @subskill,
      @targetedExerciseIds, @createdAt
    )
  `);

  const transaction = db.transaction(() => {
    dataModule.resources.forEach((resource) => insertResource.run(resource));
    dataModule.exerciseBank.forEach((exercise) => insertExercise.run(exercise));
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
        targetedExerciseIds: JSON.stringify(decision.targetedExerciseIds),
      }));
    });
  });

  transaction();
};

const initializeDatabase = () => {
  runSchema();
  seedAccounts();
  seedDomainData();
};

module.exports = {
  db,
  initializeDatabase,
};
