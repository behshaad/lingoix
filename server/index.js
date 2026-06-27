const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const { db, initializeDatabase } = require("./db");
const { validateAccountProfileInput } = require("./accountProfileValidation");
const { createDictionaryLookupService } = require("./dictionaryLookupService");

const app = express();
const PORT = process.env.API_PORT || 4000;
const SESSION_COOKIE = "lingoix_session";
const DAY_MS = 24 * 60 * 60 * 1000;
const SKILL_AREAS = [
  "vocabulary-recall",
  "grammar-accuracy",
  "listening-comprehension",
  "reading-comprehension",
  "writing-quality",
  "translation-direction",
  "speaking-ability",
];
const REVIEW_STATUSES = ["approved", "rejected", "overridden"];
const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const RESOURCE_STATUSES = ["draft", "published", "archived"];
const RESOURCE_ATTACHMENT_TYPES = ["pdf", "audio", "video", "image", "link", "text"];
const researchOutputDir = path.join(__dirname, "..", "research", "adaptive_learning", "outputs");

initializeDatabase();
const dictionaryLookupService = createDictionaryLookupService({ db });

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());

const jsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const parseCsv = (content) => {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const [headers = [], ...dataRows] = rows;
  return dataRows.map((dataRow) =>
    headers.reduce((record, header, index) => {
      const value = dataRow[index] ?? "";
      const numeric = Number(value);
      record[header] = value !== "" && Number.isFinite(numeric) ? numeric : value;
      return record;
    }, {})
  );
};

const readResearchJson = () => {
  const manifestPath = path.join(researchOutputDir, "manifest.json");
  const reportPath = path.join(researchOutputDir, "final_report.md");
  const tableDir = path.join(researchOutputDir, "tables");
  const readTable = (fileName) => parseCsv(fs.readFileSync(path.join(tableDir, fileName), "utf8"));

  return {
    manifest: jsonParse(fs.readFileSync(manifestPath, "utf8"), {}),
    reportMarkdown: fs.readFileSync(reportPath, "utf8"),
    tables: {
      classification: readTable("classification_results.csv"),
      regression: readTable("regression_results.csv"),
      clustering: readTable("clustering_results.csv"),
      statisticalTests: readTable("statistical_tests.csv"),
      archetypes: readTable("archetype_distribution.csv"),
      weaknesses: readTable("weakness_distribution.csv"),
      questionTypeErrors: readTable("question_type_errors.csv"),
      featureImportance: readTable("feature_importance.csv"),
      ruleDecisions: readTable("rule_based_adaptive_decisions.csv").slice(0, 8),
      mlDecisions: readTable("ml_based_adaptive_decisions.csv").slice(0, 8),
    },
    figures: [
      "mastery_histogram.png",
      "error_rate_boxplot.png",
      "correlation_heatmap.png",
      "learning_trend.png",
      "cluster_pca.png",
    ],
  };
};

const normalizeChoices = (choices) => {
  if (Array.isArray(choices)) return choices;
  if (typeof choices === "string") {
    return choices
      .split("\n")
      .map((choice) => choice.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeScoringRule = (rule, interactionType) => {
  const parsedRule = typeof rule === "string" ? jsonParse(rule, {}) : rule || {};
  if (parsedRule.type) {
    return {
      ...parsedRule,
      keywords: normalizeChoices(parsedRule.keywords || []),
      minLength: Number(parsedRule.minLength || 0),
    };
  }

  if (interactionType === "multiple_choice") return { type: "exact_choice" };
  if (interactionType === "writing_prompt") {
    return { type: "min_length_keywords", minLength: 80, keywords: [] };
  }
  if (interactionType === "listening_check") return { type: "exact_text" };
  if (interactionType === "conversation_practice") return { type: "contains_keywords", keywords: [] };
  return { type: "self_assessed" };
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");

const scoreExerciseResponse = (exercise, body) => {
  const scoringRule = normalizeScoringRule(exercise.scoringRule, exercise.interactionType);
  const responseValue = body.responseValue ?? body.response ?? "";
  const normalizedResponse = normalizeText(responseValue);
  const normalizedAnswer = normalizeText(exercise.expectedAnswer);

  if (scoringRule.type === "exact_choice" || scoringRule.type === "exact_text") {
    const correct = normalizedResponse.length > 0 && normalizedResponse === normalizedAnswer;
    return { correct, score: correct ? 1 : 0, responseValue, scoringRule };
  }

  if (scoringRule.type === "contains_keywords") {
    const keywords = normalizeChoices(scoringRule.keywords).map(normalizeText);
    const matched = keywords.filter((keyword) => keyword && normalizedResponse.includes(keyword));
    const correct = keywords.length > 0 && matched.length === keywords.length;
    return {
      correct,
      score: keywords.length > 0 ? matched.length / keywords.length : 0,
      responseValue,
      scoringRule,
    };
  }

  if (scoringRule.type === "min_length_keywords") {
    const keywords = normalizeChoices(scoringRule.keywords).map(normalizeText).filter(Boolean);
    const minLength = Number(scoringRule.minLength || 0);
    const lengthOk = String(responseValue || "").trim().length >= minLength;
    const matched = keywords.filter((keyword) => normalizedResponse.includes(keyword));
    const keywordOk = keywords.length === 0 || matched.length === keywords.length;
    const correct = lengthOk && keywordOk;
    const lengthScore = minLength > 0 ? Math.min(1, String(responseValue || "").trim().length / minLength) : 1;
    const keywordScore = keywords.length > 0 ? matched.length / keywords.length : 1;
    return {
      correct,
      score: Math.min(lengthScore, keywordScore),
      responseValue,
      scoringRule,
    };
  }

  const correct = Boolean(body.correct);
  return { correct, score: correct ? 1 : 0, responseValue: body.responseValue ?? null, scoringRule };
};

const publicAccount = (account) => {
  if (!account) return null;
  return {
    id: account.id,
    email: account.email,
    role: account.role,
    displayName: account.display_name,
    learnerId: account.learner_id,
    teacherName: account.teacher_name,
    schoolName: account.school_name,
    avatarUrl: account.avatar_url,
    phone: account.phone || "",
    bio: account.bio || "",
  };
};

const serializeLearner = (row) => {
  const base = {
    id: row.id,
    name: row.name,
    email: row.email,
    cefrLevel: row.cefr_level,
    nativeLanguage: row.native_language,
    targetLanguage: row.target_language,
    goal: row.goal,
    classId: row.class_id,
    className: row.class_name,
    teacher: row.teacher,
    school: row.school,
    currentLesson: row.current_lesson,
    performance: jsonParse(row.performance, {}),
    progressPercent: row.progress_percent,
    completedExercises: row.completed_exercises,
    accuracy: row.accuracy,
    averageResponseMs: row.average_response_ms,
    avatarUrl: row.avatar_url || null,
  };
  const learningPath = normalizeLearningPathItems(jsonParse(row.learning_path, []), base);
  const nextItem =
    learningPath.find((item) => item.status === "next") ||
    learningPath.find((item) => item.status === "in_progress") ||
    learningPath.find((item) => item.status !== "done");

  return {
    ...base,
    currentLesson: nextItem?.title || row.current_lesson,
    learningPath,
    progressPercent: pathProgressPercent(learningPath),
  };
};

const serializeResource = (row) => ({
  id: row.id,
  title: row.title,
  type: row.type,
  cefrLevel: row.cefr_level,
  skillArea: row.skill_area,
  sourceUrl: row.source_url,
  description: row.description,
  status: row.status || "published",
  attachments: jsonParse(row.attachments, []),
});

const normalizeResourceAttachments = (attachments) => {
  const items = Array.isArray(attachments) ? attachments : [];
  return items
    .map((attachment, index) => ({
      id: attachment.id || `attachment-${index + 1}`,
      type: RESOURCE_ATTACHMENT_TYPES.includes(attachment.type) ? attachment.type : "link",
      label: String(attachment.label || attachment.type || `Attachment ${index + 1}`).trim(),
      value: String(attachment.value || attachment.url || attachment.path || attachment.content || "").trim(),
    }))
    .filter((attachment) => attachment.label && attachment.value);
};

const normalizeResourcePayload = (body, id) => {
  const status = RESOURCE_STATUSES.includes(body.status) ? body.status : "published";
  return {
    id: id || body.id,
    title: String(body.title || "").trim(),
    type: String(body.type || "book").trim(),
    cefrLevel: CEFR_LEVELS.includes(body.cefrLevel) ? body.cefrLevel : "A1",
    skillArea: String(body.skillArea || "reading-comprehension").trim(),
    sourceUrl: String(body.sourceUrl || "").trim(),
    description: String(body.description || "").trim(),
    status,
    attachments: normalizeResourceAttachments(body.attachments),
  };
};

const serializeExercise = (row) => ({
  id: row.id,
  title: row.title,
  titleKey: row.title_key,
  sequence: row.sequence,
  cefrLevel: row.cefr_level,
  difficulty: row.difficulty,
  skillArea: row.skill_area,
  subskill: row.subskill,
  resourceId: row.resource_id,
  estimatedMinutes: row.estimated_minutes,
  interactionType: row.interaction_type,
  prompt: row.prompt,
  expectedAnswer: row.expected_answer,
  choices: jsonParse(row.choices, []),
  scoringRule: normalizeScoringRule(row.scoring_rule, row.interaction_type),
  supportText: row.support_text,
  resourceSourceUrl: row.resource_source_url,
});

const serializeEvent = (row) => ({
  id: row.id,
  learnerId: row.learner_id,
  type: row.type,
  exerciseId: row.exercise_id,
  skillArea: row.skill_area,
  subskill: row.subskill,
  correct: Boolean(row.correct),
  responseMs: row.response_ms,
  hintsUsed: row.hints_used,
  retries: row.retries,
  errorType: row.error_type,
  responseValue: row.response_value,
  score: row.score,
  occurredAt: row.occurred_at,
});

const serializeWeakness = (row) => ({
  id: row.id,
  learnerId: row.learner_id,
  skillArea: row.skill_area,
  subskill: row.subskill,
  severity: row.severity,
  evidenceCount: row.evidence_count,
});

const serializeDecision = (row) => ({
  id: row.id,
  learnerId: row.learner_id,
  type: row.type,
  status: row.status,
  reason: row.reason,
  skillArea: row.skill_area,
  subskill: row.subskill,
  targetedExerciseIds: jsonParse(row.targeted_exercise_ids, []),
  evidenceSnapshot: jsonParse(row.evidence_snapshot, {}),
  overrideTargetedExerciseIds: jsonParse(row.override_targeted_exercise_ids, []),
  priority: row.priority,
  teacherNote: row.teacher_note,
  reviewedBy: row.reviewed_by,
  reviewedAt: row.reviewed_at,
  appliedAt: row.applied_at,
  createdAt: row.created_at,
});

const getSessionAccount = (token) => {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT accounts.*
       FROM sessions
       JOIN accounts ON accounts.id = sessions.account_id
       WHERE sessions.token = ? AND sessions.expires_at > datetime('now')`
    )
    .get(token);
  return row || null;
};

const requireAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : null;
  const account = getSessionAccount(bearerToken || req.cookies[SESSION_COOKIE]);
  if (!account) {
    res.status(401).json({ error: "not_authenticated" });
    return;
  }
  req.account = account;
  next();
};

const requireRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.account.role)) {
    res.status(403).json({ error: "forbidden" });
    return;
  }
  next();
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const createSession = (account, res, remember = true) => {
  const token = crypto.randomBytes(32).toString("hex");
  const durationMs = remember ? 30 * DAY_MS : 1 * DAY_MS;
  const expiresAt = new Date(Date.now() + durationMs).toISOString();
  db.prepare("INSERT INTO sessions (token, account_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    account.id,
    expiresAt
  );

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
  };
  if (remember) cookieOptions.maxAge = durationMs;
  res.cookie(SESSION_COOKIE, token, cookieOptions);

  return token;
};

const buildInitialPerformance = () => ({
  "vocabulary-recall": 0,
  "grammar-accuracy": 0,
  "listening-comprehension": 0,
  "reading-comprehension": 0,
  "writing-quality": 0,
  "translation-direction": 0,
  "speaking-ability": 0,
});

const slugify = (value) =>
  String(value || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildLearningPathItem = ({
  id,
  type = "lesson",
  title,
  status = "locked",
  cefrLevel = "A1",
  skillArea = "vocabulary-recall",
  exerciseIds = [],
}) => ({
  id: id || `path-${slugify(title)}`,
  type,
  title: title || "Learning path item",
  status,
  cefrLevel,
  skillArea,
  exerciseIds,
});

const buildInitialLearningPath = (cefrLevel) => [
  buildLearningPathItem({
    id: `setup-${cefrLevel.toLowerCase()}`,
    type: "lesson",
    title: "Learner profile setup",
    status: "done",
    cefrLevel,
    skillArea: "vocabulary-recall",
  }),
  buildLearningPathItem({
    id: `orientation-${cefrLevel.toLowerCase()}`,
    type: "lesson",
    title: `${cefrLevel} orientation`,
    status: "next",
    cefrLevel,
    skillArea: "reading-comprehension",
  }),
  buildLearningPathItem({
    id: `matched-resources-${cefrLevel.toLowerCase()}`,
    type: "review",
    title: "Matched resources",
    status: "locked",
    cefrLevel,
    skillArea: "listening-comprehension",
  }),
  buildLearningPathItem({
    id: `first-practice-${cefrLevel.toLowerCase()}`,
    type: "exercise",
    title: "First practice session",
    status: "locked",
    cefrLevel,
    skillArea: "grammar-accuracy",
  }),
  buildLearningPathItem({
    id: `conversation-${cefrLevel.toLowerCase()}`,
    type: "exercise",
    title: "Conversation warm-up",
    status: "locked",
    cefrLevel,
    skillArea: "speaking-ability",
    exerciseIds: ["exercise-speaking-greetings"],
  }),
];

const normalizeLearningPathItems = (rawPath, learner = {}) => {
  const items = Array.isArray(rawPath) ? rawPath : [];
  if (!items.length) return buildInitialLearningPath(learner.cefrLevel || learner.cefr_level || "A1");

  const doneCount = Math.round((items.length * Number(learner.progressPercent || learner.progress_percent || 0)) / 100);
  return items.map((item, index) => {
    if (item && typeof item === "object" && item.id && item.title) {
      return buildLearningPathItem({
        ...item,
        status: item.status || (index === 0 ? "next" : "locked"),
        cefrLevel: item.cefrLevel || learner.cefrLevel || learner.cefr_level || "A1",
        skillArea: item.skillArea || SKILL_AREAS[index % SKILL_AREAS.length],
        exerciseIds: Array.isArray(item.exerciseIds) ? item.exerciseIds : [],
      });
    }

    const title = String(item || `Path item ${index + 1}`);
    const status = index < doneCount ? "done" : index === doneCount ? "next" : "locked";
    return buildLearningPathItem({
      id: `${learner.id || learner.email || "learner"}-path-${index + 1}`,
      type: index % 4 === 3 ? "review" : index % 2 === 0 ? "lesson" : "exercise",
      title,
      status,
      cefrLevel: learner.cefrLevel || learner.cefr_level || "A1",
      skillArea: SKILL_AREAS[index % SKILL_AREAS.length],
    });
  });
};

const pathProgressPercent = (items) => {
  if (!items.length) return 0;
  const doneCount = items.filter((item) => item.status === "done").length;
  return Math.round((doneCount / items.length) * 100);
};

const learnerScopeClause = (account) => {
  if (account.role === "platform_admin") return { sql: "", params: [] };
  if (account.role === "school_admin") return { sql: "WHERE learners.school = ?", params: [account.school_name] };
  if (account.role === "teacher") return { sql: "WHERE learners.teacher = ?", params: [account.teacher_name] };
  return { sql: "WHERE learners.id = ?", params: [account.learner_id] };
};

const getLearnerRowsForAccount = (account) => {
  const scope = learnerScopeClause(account);
  return db
    .prepare(
      `SELECT learners.*, accounts.avatar_url AS avatar_url
       FROM learners
       LEFT JOIN accounts ON accounts.email = learners.email
       ${scope.sql}
       ORDER BY learners.name`
    )
    .all(...scope.params);
};

const canAccessLearner = (account, learner) => {
  if (!learner) return false;
  if (account.role === "platform_admin") return true;
  if (account.role === "school_admin") return learner.school === account.school_name;
  if (account.role === "teacher") return learner.teacher === account.teacher_name;
  return learner.id === account.learner_id;
};

const getLearnerBundle = (learnerId) => {
  const learnerRow = db
    .prepare(
      `SELECT learners.*, accounts.avatar_url AS avatar_url
       FROM learners
       LEFT JOIN accounts ON accounts.email = learners.email
       WHERE learners.id = ?`
    )
    .get(learnerId);
  if (!learnerRow) return null;
  const learner = serializeLearner(learnerRow);
  const skillWeaknesses = db
    .prepare("SELECT * FROM skill_weaknesses WHERE learner_id = ? ORDER BY severity")
    .all(learnerId)
    .map(serializeWeakness);
  const learningEvents = db
    .prepare("SELECT * FROM learning_events WHERE learner_id = ? ORDER BY occurred_at DESC")
    .all(learnerId)
    .map(serializeEvent);
  const adaptiveDecisions = db
    .prepare("SELECT * FROM adaptive_decisions WHERE learner_id = ? ORDER BY created_at DESC")
    .all(learnerId)
    .map(serializeDecision);
  const bundle = {
    ...learner,
    skillWeaknesses,
    learningEvents,
    adaptiveDecisions,
  };
  return {
    ...bundle,
    dashboardSummary: buildDashboardSummary(bundle),
  };
};

const getPlatformReport = (account) => {
  const learners = getLearnerRowsForAccount(account).map(serializeLearner);
  const learnerIds = learners.map((learner) => learner.id);
  if (learnerIds.length === 0) {
    return { learnerCount: 0, eventCount: 0, adaptiveDecisionCount: 0 };
  }

  const placeholders = learnerIds.map(() => "?").join(",");
  const events = db
    .prepare(`SELECT * FROM learning_events WHERE learner_id IN (${placeholders})`)
    .all(...learnerIds)
    .map(serializeEvent);
  const weaknesses = db
    .prepare(`SELECT * FROM skill_weaknesses WHERE learner_id IN (${placeholders})`)
    .all(...learnerIds)
    .map(serializeWeakness);
  const decisions = db
    .prepare(`SELECT * FROM adaptive_decisions WHERE learner_id IN (${placeholders})`)
    .all(...learnerIds)
    .map(serializeDecision);
  const resources = db.prepare("SELECT * FROM resources ORDER BY title").all().map(serializeResource);
  const exercises = db.prepare("SELECT * FROM exercises ORDER BY id").all().map(serializeExercise);

  const countBy = (items, selector) =>
    items.reduce((counts, item) => {
      const key = selector(item);
      if (!key) return counts;
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});

  const errorCounts = countBy(events, (event) => event.errorType);
  const weaknessCounts = countBy(weaknesses, (weakness) => weakness.skillArea);

  return {
    learnerCount: learners.length,
    resourceCount: resources.length,
    exerciseCount: exercises.length,
    eventCount: events.length,
    adaptiveDecisionCount: decisions.length,
    averageAccuracy: Math.round(learners.reduce((sum, learner) => sum + learner.accuracy, 0) / learners.length),
    averageProgress: Math.round(learners.reduce((sum, learner) => sum + learner.progressPercent, 0) / learners.length),
    commonErrorPatterns: Object.entries(errorCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    weaknessDistribution: Object.entries(weaknessCounts)
      .map(([skillArea, count]) => ({ skillArea, count }))
      .sort((a, b) => b.count - a.count),
  };
};

const scoringReliabilityForRule = (rule, exercise) => {
  const type = rule?.type || normalizeScoringRule(rule, exercise?.interactionType).type;
  if ((type === "exact_choice" || type === "exact_text") && exercise?.expectedAnswer) return "high";
  if (type === "contains_keywords") return normalizeChoices(rule?.keywords || []).length > 0 ? "medium" : "low";
  if (type === "min_length_keywords") return normalizeChoices(rule?.keywords || []).length > 0 ? "medium" : "low";
  return "low";
};

const average = (items, selector) => {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + selector(item), 0) / items.length);
};

const buildLanguagePerformanceProfile = (learner, events = []) =>
  SKILL_AREAS.map((skillArea) => {
    const skillEvents = events.filter((event) => event.skillArea === skillArea).slice(0, 12);
    const fallback = learner.performance?.[skillArea] ?? null;
    if (skillEvents.length < 3) {
      return {
        skillArea,
        value: fallback,
        eventCount: skillEvents.length,
        source: fallback === null ? "not_enough_evidence" : "seeded_fallback",
      };
    }
    const eventValue = average(skillEvents, (event) => {
      if (typeof event.score === "number") return event.score * 100;
      return event.correct ? 100 : 0;
    });
    return {
      skillArea,
      value: eventValue,
      eventCount: skillEvents.length,
      source: "learning_events",
    };
  });

const deriveErrorPatterns = (events) => {
  const grouped = events.reduce((groups, event) => {
    if (!event.errorType) return groups;
    const key = `${event.skillArea}|${event.subskill}|${event.errorType}`;
    groups[key] = groups[key] || {
      skillArea: event.skillArea,
      subskill: event.subskill,
      errorType: event.errorType,
      count: 0,
      eventIds: [],
    };
    groups[key].count += 1;
    groups[key].eventIds.push(event.id);
    return groups;
  }, {});
  return Object.values(grouped)
    .filter((pattern) => pattern.count >= 2)
    .sort((a, b) => b.count - a.count);
};

const buildEvidenceSnapshot = (learnerId, skillArea, subskill, targetedExercises) => {
  const learnerEvents = db
    .prepare("SELECT * FROM learning_events WHERE learner_id = ? ORDER BY occurred_at DESC")
    .all(learnerId)
    .map(serializeEvent);
  const matchingEvents = learnerEvents
    .filter((event) => event.skillArea === skillArea && event.subskill === subskill)
    .slice(0, 12);
  const incorrectEvents = matchingEvents.filter((event) => !event.correct);
  const supportingSignalEvents = matchingEvents.filter(
    (event) => event.hintsUsed > 0 || event.retries > 0 || event.responseMs >= 10000
  );
  const learnerAverageResponseMs = average(learnerEvents, (event) => event.responseMs);
  const responseAverageMs = average(matchingEvents, (event) => event.responseMs);

  return {
    createdAt: new Date().toISOString(),
    trigger: {
      incorrectCount: incorrectEvents.length,
      supportingSignalCount: supportingSignalEvents.length,
      threshold: "3 incorrect events or 2 incorrect events plus supporting signals",
    },
    eventIds: matchingEvents.map((event) => event.id),
    events: matchingEvents.map((event) => ({
      id: event.id,
      type: event.type,
      exerciseId: event.exerciseId,
      correct: event.correct,
      score: event.score,
      responseMs: event.responseMs,
      hintsUsed: event.hintsUsed,
      retries: event.retries,
      errorType: event.errorType,
      occurredAt: event.occurredAt,
    })),
    errorPatterns: deriveErrorPatterns(matchingEvents),
    responseSpeed: {
      averageMs: responseAverageMs,
      learnerAverageMs: learnerAverageResponseMs,
      slowResponseCount: matchingEvents.filter((event) => event.responseMs > learnerAverageResponseMs * 1.2).length,
    },
    hintUsage: matchingEvents.reduce((sum, event) => sum + event.hintsUsed, 0),
    retries: matchingEvents.reduce((sum, event) => sum + event.retries, 0),
    targetedExercises: targetedExercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      skillArea: exercise.skillArea,
      subskill: exercise.subskill,
      difficulty: exercise.difficulty,
      estimatedMinutes: exercise.estimatedMinutes,
      matchReason: exercise.subskill === subskill ? "same subskill" : "same skill area",
    })),
  };
};

const buildDashboardSummary = (learner) => {
  const recentEvents = learner.learningEvents || [];
  const approvedDecisions = (learner.adaptiveDecisions || []).filter((decision) =>
    ["approved", "overridden"].includes(decision.status)
  );
  return {
    languagePerformanceProfile: buildLanguagePerformanceProfile(learner, recentEvents),
    recentLearningEvents: recentEvents.slice(0, 8),
    activeAdaptiveDecisions: approvedDecisions,
    proposedAdaptiveDecisions: (learner.adaptiveDecisions || []).filter((decision) => decision.status === "proposed"),
    targetedExerciseInsertions: approvedDecisions.map((decision) => ({
      decisionId: decision.id,
      skillArea: decision.skillArea,
      subskill: decision.subskill,
      targetedExerciseIds:
        decision.status === "overridden" && decision.overrideTargetedExerciseIds.length
          ? decision.overrideTargetedExerciseIds
          : decision.targetedExerciseIds,
      appliedAt: decision.appliedAt,
    })),
  };
};

const buildAdaptiveEvaluationMetrics = (account) => {
  const learnerIds = getLearnerRowsForAccount(account).map((learner) => learner.id);
  if (!learnerIds.length) {
    return {
      proposedDecisionCount: 0,
      approvalRate: 0,
      scoringReliability: [],
      improvementRate: 0,
      timeToMasteryProxy: [],
      exerciseEffectiveness: [],
    };
  }
  const placeholders = learnerIds.map(() => "?").join(",");
  const decisions = db
    .prepare(`SELECT * FROM adaptive_decisions WHERE learner_id IN (${placeholders})`)
    .all(...learnerIds)
    .map(serializeDecision);
  const events = db
    .prepare(`SELECT * FROM learning_events WHERE learner_id IN (${placeholders})`)
    .all(...learnerIds)
    .map(serializeEvent);
  const exercises = db.prepare("SELECT * FROM exercises").all().map(serializeExercise);
  const reviewed = decisions.filter((decision) => decision.reviewedAt);
  const approved = reviewed.filter((decision) => ["approved", "overridden"].includes(decision.status));

  const scoringReliabilityCounts = exercises.reduce((counts, exercise) => {
    const reliability = scoringReliabilityForRule(exercise.scoringRule, exercise);
    counts[reliability] = (counts[reliability] || 0) + 1;
    return counts;
  }, {});

  const improvementSamples = approved.map((decision) => {
    const createdAt = new Date(decision.createdAt).getTime();
    const related = events.filter((event) => event.learnerId === decision.learnerId && event.skillArea === decision.skillArea);
    const before = related.filter((event) => new Date(event.occurredAt).getTime() < createdAt).slice(-5);
    const after = related.filter((event) => new Date(event.occurredAt).getTime() >= createdAt).slice(0, 5);
    if (!before.length || !after.length) return null;
    const beforeScore = average(before, (event) => (typeof event.score === "number" ? event.score * 100 : event.correct ? 100 : 0));
    const afterScore = average(after, (event) => (typeof event.score === "number" ? event.score * 100 : event.correct ? 100 : 0));
    return afterScore - beforeScore;
  }).filter((value) => value !== null);

  const timeToMasteryProxy = SKILL_AREAS.map((skillArea) => {
    const skillEvents = events.filter((event) => event.skillArea === skillArea);
    const learnerGroups = learnerIds.map((learnerId) => skillEvents.filter((event) => event.learnerId === learnerId));
    const mastered = learnerGroups.filter((group) => {
      const recent = group.slice(-5);
      if (recent.length < 5) return false;
      const correctRate = recent.filter((event) => event.correct).length / recent.length;
      const scoreAverage = recent.reduce((sum, event) => sum + (typeof event.score === "number" ? event.score : event.correct ? 1 : 0), 0) / recent.length;
      const hints = recent.reduce((sum, event) => sum + event.hintsUsed, 0);
      const retries = recent.reduce((sum, event) => sum + event.retries, 0);
      return correctRate >= 0.8 && scoreAverage >= 0.8 && hints <= 1 && retries <= 1;
    });
    return { skillArea, masteredCount: mastered.length, learnerCount: learnerGroups.filter((group) => group.length > 0).length };
  });

  const exerciseEffectiveness = exercises.slice(0, 12).map((exercise) => {
    const exerciseEvents = events.filter((event) => event.exerciseId === exercise.id);
    return {
      exerciseId: exercise.id,
      title: exercise.title,
      skillArea: exercise.skillArea,
      eventCount: exerciseEvents.length,
      averageScore: average(exerciseEvents, (event) => (typeof event.score === "number" ? event.score * 100 : event.correct ? 100 : 0)),
      reliability: scoringReliabilityForRule(exercise.scoringRule, exercise),
    };
  }).sort((a, b) => b.eventCount - a.eventCount);

  return {
    proposedDecisionCount: decisions.filter((decision) => decision.status === "proposed").length,
    reviewedDecisionCount: reviewed.length,
    approvalRate: reviewed.length ? Math.round((approved.length / reviewed.length) * 100) : 0,
    scoringReliability: Object.entries(scoringReliabilityCounts).map(([label, count]) => ({ label, count })),
    improvementRate: improvementSamples.length ? average(improvementSamples, (value) => value) : 0,
    timeToMasteryProxy,
    exerciseEffectiveness,
  };
};

const runAdaptiveRulesForLearner = (learnerId) => {
  const rows = db
    .prepare(
      `SELECT skill_area, subskill,
        SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS misses,
        SUM(CASE WHEN hints_used > 0 OR retries > 0 OR response_ms >= 10000 THEN 1 ELSE 0 END) AS supporting_signals
       FROM learning_events
       WHERE learner_id = ?
       GROUP BY skill_area, subskill
       HAVING misses >= 3 OR (misses >= 2 AND supporting_signals >= 1)`
    )
    .all(learnerId);

  const insertDecision = db.prepare(`
    INSERT OR IGNORE INTO adaptive_decisions (
      id, learner_id, type, status, reason, skill_area, subskill,
      targeted_exercise_ids, evidence_snapshot, priority, created_at
    ) VALUES (
      @id, @learnerId, 'remediation', 'proposed', @reason, @skillArea, @subskill,
      @targetedExerciseIds, @evidenceSnapshot, @priority, @createdAt
    )
  `);

  rows.forEach((row) => {
    const targeted = db
      .prepare("SELECT * FROM exercises WHERE skill_area = ? ORDER BY CASE WHEN subskill = ? THEN 0 ELSE 1 END, estimated_minutes LIMIT 4")
      .all(row.skill_area, row.subskill)
      .map(serializeExercise);
    const targetedExerciseIds = targeted.map((exercise) => exercise.id);
    const evidenceSnapshot = buildEvidenceSnapshot(learnerId, row.skill_area, row.subskill, targeted);
    const priority = row.misses >= 5 || row.supporting_signals >= 4 ? "high" : row.misses >= 3 ? "medium" : "low";

    insertDecision.run({
      id: `${learnerId}-rule-${row.skill_area}-${row.subskill}`.replace(/\s+/g, "-"),
      learnerId,
      reason: `${row.misses} repeated misses in ${row.subskill}`,
      skillArea: row.skill_area,
      subskill: row.subskill,
      targetedExerciseIds: JSON.stringify(targetedExerciseIds),
      evidenceSnapshot: JSON.stringify(evidenceSnapshot),
      priority,
      createdAt: new Date().toISOString(),
    });
  });
};

const applyAdaptiveDecision = (decision) => {
  const learner = getLearnerBundle(decision.learner_id);
  if (!learner) return;
  const currentPath = Array.isArray(learner.learningPath) ? learner.learningPath : [];
  const insertionId = `targeted-${decision.id}`;
  if (currentPath.some((item) => item.id === insertionId)) return;
  const targetedExerciseIds =
    decision.status === "overridden" && decision.override_targeted_exercise_ids
      ? jsonParse(decision.override_targeted_exercise_ids, [])
      : jsonParse(decision.targeted_exercise_ids, []);
  const insertion = buildLearningPathItem({
    id: insertionId,
    type: "targeted_exercise_insertion",
    title: `Targeted practice: ${decision.subskill}`,
    status: "next",
    cefrLevel: learner.cefrLevel,
    skillArea: decision.skill_area,
    exerciseIds: targetedExerciseIds,
  });
  const demotedPath = currentPath.map((item) =>
    item.status === "next" ? { ...item, status: "in_progress" } : item
  );
  db.prepare("UPDATE learners SET learning_path = ? WHERE id = ?").run(
    JSON.stringify([...demotedPath, insertion]),
    decision.learner_id
  );
};

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  const remember = req.body.remember !== false;
  const email = normalizeEmail(req.body.email);
  const account = db.prepare("SELECT * FROM accounts WHERE email = ?").get(email);
  if (!account || !bcrypt.compareSync(password || "", account.password_hash)) {
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }

  const token = createSession(account, res, remember);
  res.json({ account: publicAccount(account), sessionToken: token });
});

app.post("/api/auth/signup", (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "invalid_email" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "password_too_short" });
    return;
  }

  const existing = db.prepare("SELECT id FROM accounts WHERE email = ?").get(email);
  if (existing) {
    res.status(409).json({ error: "account_exists" });
    return;
  }

  const account = {
    id: `account-${crypto.randomUUID()}`,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: "learner",
    displayName: email.split("@")[0],
    learnerId: null,
    teacherName: null,
    schoolName: null,
  };

  db.prepare(`
    INSERT INTO accounts (
      id, email, password_hash, role, display_name, learner_id, teacher_name, school_name
    ) VALUES (
      @id, @email, @passwordHash, @role, @displayName, @learnerId, @teacherName, @schoolName
    )
  `).run(account);

  const savedAccount = db.prepare("SELECT * FROM accounts WHERE id = ?").get(account.id);
  const token = createSession(savedAccount, res);
  res.status(201).json({ account: publicAccount(savedAccount), sessionToken: token });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : null;
  db.prepare("DELETE FROM sessions WHERE token = ?").run(bearerToken || req.cookies[SESSION_COOKIE]);
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ account: publicAccount(req.account) });
});

app.get("/api/dictionary/lookup", async (req, res) => {
  try {
    const lookup = await dictionaryLookupService.lookup({
      word: req.query.word,
      sourceLang: req.query.sourceLang || "auto",
      targetLang: req.query.targetLang || "fa",
    });
    res.json({ lookup });
  } catch (error) {
    res.status(200).json({
      lookup: {
        word: String(req.query.word || ""),
        sourceLang: req.query.sourceLang || "auto",
        targetLang: req.query.targetLang || "fa",
        definition: "",
        translation: "",
        partOfSpeech: "",
        pronunciation: String(req.query.word || ""),
        example: "",
        synonyms: [],
        antonyms: [],
        suggestions: [],
        provider: "",
        found: false,
        error: "lookup_failed",
      },
    });
  }
});

app.post("/api/dictionary/translate", async (req, res) => {
  try {
    const translation = await dictionaryLookupService.translate({
      text: req.body.text,
      sourceLang: req.body.sourceLang || "auto",
      targetLang: req.body.targetLang || "fa",
    });
    if (!translation.translated) {
      res.status(503).json({ error: translation.error || "translation_failed", translation });
      return;
    }
    res.json({ translation });
  } catch (error) {
    res.status(503).json({ error: "translation_failed" });
  }
});

app.put("/api/account/profile", requireAuth, (req, res) => {
  const validation = validateAccountProfileInput(req.body);
  if (validation.error) {
    res.status(400).json({ error: validation.error });
    return;
  }
  const { displayName, phone, bio, avatarUrl } = validation.value;

  db.prepare(
    `UPDATE accounts
     SET display_name = @displayName,
       phone = @phone,
       bio = @bio,
       avatar_url = @avatarUrl
     WHERE id = @id`
  ).run({
    id: req.account.id,
    displayName,
    phone,
    bio,
    avatarUrl,
  });

  if (req.account.learner_id) {
    db.prepare("UPDATE learners SET name = ? WHERE id = ?").run(displayName, req.account.learner_id);
  }

  const account = db.prepare("SELECT * FROM accounts WHERE id = ?").get(req.account.id);
  res.json({ account: publicAccount(account) });
});

app.get("/api/learners", requireAuth, (req, res) => {
  res.json({ learners: getLearnerRowsForAccount(req.account).map(serializeLearner) });
});

app.post("/api/learners/profile", requireAuth, requireRoles("learner"), (req, res) => {
  if (req.account.learner_id) {
    const learner = getLearnerBundle(req.account.learner_id);
    res.status(409).json({ error: "profile_already_exists", learner });
    return;
  }

  const cefrLevel = CEFR_LEVELS.includes(req.body.cefrLevel) ? req.body.cefrLevel : "A1";
  const nativeLanguage = String(req.body.nativeLanguage || "Persian").trim() || "Persian";
  const targetLanguage = String(req.body.targetLanguage || "German").trim() || "German";
  const goal = String(req.body.goal || "general").trim() || "general";
  const displayName = String(req.body.name || req.account.display_name || req.account.email.split("@")[0]).trim();
  const learnerId = `learner-${crypto.randomUUID()}`;
  const learningPath = buildInitialLearningPath(cefrLevel);

  const transaction = db.transaction(() => {
    db.prepare(`
      INSERT INTO learners (
        id, name, email, cefr_level, native_language, target_language, goal,
        class_id, class_name, teacher, school, current_lesson, learning_path,
        performance, progress_percent, completed_exercises, accuracy, average_response_ms
      ) VALUES (
        @id, @name, @email, @cefrLevel, @nativeLanguage, @targetLanguage, @goal,
        @classId, @className, @teacher, @school, @currentLesson, @learningPath,
        @performance, @progressPercent, @completedExercises, @accuracy, @averageResponseMs
      )
    `).run({
      id: learnerId,
      name: displayName,
      email: req.account.email,
      cefrLevel,
      nativeLanguage,
      targetLanguage,
      goal,
      classId: "self-guided",
      className: "Self-guided learners",
      teacher: "Self-guided",
      school: "Lingoix",
      currentLesson: `${cefrLevel} orientation`,
      learningPath: JSON.stringify(learningPath),
      performance: JSON.stringify(buildInitialPerformance()),
      progressPercent: 0,
      completedExercises: 0,
      accuracy: 0,
      averageResponseMs: 0,
    });

    db.prepare("UPDATE accounts SET learner_id = ?, display_name = ? WHERE id = ?").run(
      learnerId,
      displayName,
      req.account.id
    );
  });

  transaction();

  const account = db.prepare("SELECT * FROM accounts WHERE id = ?").get(req.account.id);
  res.status(201).json({
    account: publicAccount(account),
    learner: getLearnerBundle(learnerId),
  });
});

app.get("/api/learners/:learnerId", requireAuth, (req, res) => {
  const bundle = getLearnerBundle(req.params.learnerId);
  if (!bundle || !canAccessLearner(req.account, bundle)) {
    res.status(404).json({ error: "learner_not_found" });
    return;
  }
  res.json({ learner: bundle });
});

app.get("/api/resources", requireAuth, (req, res) => {
  const includeArchived = req.account.role === "platform_admin";
  const rows = includeArchived
    ? db.prepare("SELECT * FROM resources ORDER BY status, title").all()
    : db.prepare("SELECT * FROM resources WHERE status = 'published' ORDER BY title").all();
  res.json({ resources: rows.map(serializeResource) });
});

app.post("/api/resources", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const resource = normalizeResourcePayload(req.body);
  db.prepare(
    `INSERT INTO resources (id, title, type, cefr_level, skill_area, source_url, description, status, attachments)
     VALUES (@id, @title, @type, @cefrLevel, @skillArea, @sourceUrl, @description, @status, @attachments)`
  ).run({
    ...resource,
    attachments: JSON.stringify(resource.attachments),
  });
  res.status(201).json({ resource });
});

app.put("/api/resources/:resourceId", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const resource = normalizeResourcePayload(req.body, req.params.resourceId);
  db.prepare(
    `UPDATE resources SET title=@title, type=@type, cefr_level=@cefrLevel,
     skill_area=@skillArea, source_url=@sourceUrl, description=@description,
     status=@status, attachments=@attachments WHERE id=@id`
  ).run({
    ...resource,
    attachments: JSON.stringify(resource.attachments),
  });
  res.json({ resource });
});

app.delete("/api/resources/:resourceId", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const existing = db.prepare("SELECT * FROM resources WHERE id = ?").get(req.params.resourceId);
  if (!existing) {
    res.status(404).json({ error: "resource_not_found" });
    return;
  }
  db.prepare("UPDATE resources SET status = 'archived' WHERE id = ?").run(req.params.resourceId);
  const resource = db.prepare("SELECT * FROM resources WHERE id = ?").get(req.params.resourceId);
  res.json({ resource: serializeResource(resource) });
});

app.get("/api/exercises", requireAuth, (req, res) => {
  res.json({
    exercises: db
      .prepare(
        `SELECT exercises.*, resources.source_url AS resource_source_url
         FROM exercises
         LEFT JOIN resources ON resources.id = exercises.resource_id
         ORDER BY exercises.id`
      )
      .all()
      .map(serializeExercise),
  });
});

app.post("/api/exercises", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const exercise = {
    interactionType: "flashcard",
    prompt: "",
    expectedAnswer: "",
    choices: [],
    scoringRule: null,
    supportText: "",
    ...req.body,
  };
  const scoringRule = normalizeScoringRule(exercise.scoringRule, exercise.interactionType);
  db.prepare(
    `INSERT INTO exercises (
       id, title, title_key, sequence, cefr_level, difficulty, skill_area,
       subskill, resource_id, estimated_minutes, interaction_type, prompt,
       expected_answer, choices, scoring_rule, support_text
     )
     VALUES (
       @id, @title, @titleKey, @sequence, @cefrLevel, @difficulty, @skillArea,
       @subskill, @resourceId, @estimatedMinutes, @interactionType, @prompt,
       @expectedAnswer, @choices, @scoringRule, @supportText
     )`
  ).run({
    ...exercise,
    choices: JSON.stringify(normalizeChoices(exercise.choices)),
    scoringRule: JSON.stringify(scoringRule),
  });
  res.status(201).json({ exercise });
});

app.put("/api/exercises/:exerciseId", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const exercise = {
    interactionType: "flashcard",
    prompt: "",
    expectedAnswer: "",
    choices: [],
    scoringRule: null,
    supportText: "",
    ...req.body,
    id: req.params.exerciseId,
  };
  const scoringRule = normalizeScoringRule(exercise.scoringRule, exercise.interactionType);
  db.prepare(
    `UPDATE exercises
     SET title=@title, title_key=@titleKey, sequence=@sequence, cefr_level=@cefrLevel,
       difficulty=@difficulty, skill_area=@skillArea, subskill=@subskill,
       resource_id=@resourceId, estimated_minutes=@estimatedMinutes,
       interaction_type=@interactionType, prompt=@prompt,
       expected_answer=@expectedAnswer, choices=@choices,
       scoring_rule=@scoringRule, support_text=@supportText
     WHERE id=@id`
  ).run({
    ...exercise,
    choices: JSON.stringify(normalizeChoices(exercise.choices)),
    scoringRule: JSON.stringify(scoringRule),
  });
  res.json({ exercise });
});

app.post("/api/learning-events", requireAuth, (req, res) => {
  const exerciseRow = db.prepare("SELECT * FROM exercises WHERE id = ?").get(req.body.exerciseId);
  if (!exerciseRow) {
    res.status(404).json({ error: "exercise_not_found" });
    return;
  }
  const exercise = serializeExercise(exerciseRow);
  const scoring = scoreExerciseResponse(exercise, req.body);
  const event = {
    id: req.body.id || `event-${crypto.randomUUID()}`,
    learnerId: req.body.learnerId || req.account.learner_id,
    type: req.body.type || (exercise.interactionType === "writing_prompt" ? "writing_submitted" : "answer_submitted"),
    exerciseId: exercise.id,
    skillArea: exercise.skillArea,
    subskill: exercise.subskill,
    correct: scoring.correct ? 1 : 0,
    responseMs: req.body.responseMs,
    hintsUsed: req.body.hintsUsed || 0,
    retries: req.body.retries ?? (scoring.correct ? 0 : 1),
    errorType: scoring.correct ? null : req.body.errorType || null,
    responseValue: scoring.responseValue,
    score: scoring.score,
    occurredAt: req.body.occurredAt || new Date().toISOString(),
  };
  const learner = getLearnerBundle(event.learnerId);
  if (!canAccessLearner(req.account, learner)) {
    res.status(403).json({ error: "forbidden" });
    return;
  }

  db.prepare(
    `INSERT INTO learning_events (
       id, learner_id, type, exercise_id, skill_area, subskill, correct,
       response_ms, hints_used, retries, error_type, response_value, score, occurred_at
     )
     VALUES (
       @id, @learnerId, @type, @exerciseId, @skillArea, @subskill, @correct,
       @responseMs, @hintsUsed, @retries, @errorType, @responseValue, @score, @occurredAt
     )`
  ).run(event);
  runAdaptiveRulesForLearner(event.learnerId);
  res.status(201).json({
    event: { ...event, correct: Boolean(event.correct) },
    scoring: {
      correct: scoring.correct,
      score: scoring.score,
      rule: scoring.scoringRule,
    },
  });
});

app.get("/api/adaptive-decisions", requireAuth, (req, res) => {
  const learners = getLearnerRowsForAccount(req.account).map((learner) => learner.id);
  if (learners.length === 0) {
    res.json({ decisions: [] });
    return;
  }
  const placeholders = learners.map(() => "?").join(",");
  const decisions = db
    .prepare(`SELECT * FROM adaptive_decisions WHERE learner_id IN (${placeholders}) ORDER BY created_at DESC`)
    .all(...learners)
    .map(serializeDecision);
  res.json({ decisions });
});

app.put(
  "/api/adaptive-decisions/:decisionId/review",
  requireAuth,
  requireRoles("teacher", "school_admin", "platform_admin"),
  (req, res) => {
    const decision = db.prepare("SELECT * FROM adaptive_decisions WHERE id = ?").get(req.params.decisionId);
    if (!decision) {
      res.status(404).json({ error: "decision_not_found" });
      return;
    }
    const learner = getLearnerBundle(decision.learner_id);
    if (!canAccessLearner(req.account, learner)) {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    if (!REVIEW_STATUSES.includes(req.body.status)) {
      res.status(400).json({ error: "invalid_review_status" });
      return;
    }
    const overrideTargetedExerciseIds = normalizeChoices(req.body.overrideTargetedExerciseIds || []);
    const priority = ["low", "medium", "high"].includes(req.body.priority) ? req.body.priority : decision.priority || "medium";
    const reviewedAt = new Date().toISOString();
    const appliedAt = ["approved", "overridden"].includes(req.body.status) ? reviewedAt : null;

    db.prepare(
      `UPDATE adaptive_decisions
       SET status = @status,
         teacher_note = @teacherNote,
         reviewed_by = @reviewedBy,
         reviewed_at = @reviewedAt,
         applied_at = @appliedAt,
         override_targeted_exercise_ids = @overrideTargetedExerciseIds,
         priority = @priority
       WHERE id = @id`
    ).run({
      id: req.params.decisionId,
      status: req.body.status,
      teacherNote: req.body.teacherNote || null,
      reviewedBy: req.account.id,
      reviewedAt,
      appliedAt,
      overrideTargetedExerciseIds: JSON.stringify(overrideTargetedExerciseIds),
      priority,
    });
    const updated = db.prepare("SELECT * FROM adaptive_decisions WHERE id = ?").get(req.params.decisionId);
    if (appliedAt) applyAdaptiveDecision(updated);
    res.json({ decision: serializeDecision(db.prepare("SELECT * FROM adaptive_decisions WHERE id = ?").get(req.params.decisionId)) });
  }
);

app.get("/api/reports/platform", requireAuth, (req, res) => {
  res.json({ report: getPlatformReport(req.account) });
});

app.get("/api/reports/adaptive-metrics", requireAuth, requireRoles("teacher", "school_admin", "platform_admin"), (req, res) => {
  res.json({ metrics: buildAdaptiveEvaluationMetrics(req.account) });
});

app.get(
  "/api/research/adaptive-learning",
  requireAuth,
  requireRoles("teacher", "school_admin", "platform_admin"),
  (req, res) => {
    try {
      res.json({ research: readResearchJson() });
    } catch (error) {
      res.status(404).json({ error: "research_outputs_not_found" });
    }
  }
);

app.get(
  "/api/research/adaptive-learning/figures/:fileName",
  requireAuth,
  requireRoles("teacher", "school_admin", "platform_admin"),
  (req, res) => {
    const safeFileName = path.basename(req.params.fileName);
    const figurePath = path.join(researchOutputDir, "figures", safeFileName);
    if (!safeFileName.endsWith(".png") || !fs.existsSync(figurePath)) {
      res.status(404).json({ error: "figure_not_found" });
      return;
    }
    res.sendFile(figurePath);
  }
);

app.get(
  "/api/research/adaptive-learning/tables/:fileName",
  requireAuth,
  requireRoles("teacher", "school_admin", "platform_admin"),
  (req, res) => {
    const safeFileName = path.basename(req.params.fileName);
    const tablePath = path.join(researchOutputDir, "tables", safeFileName);
    if (!safeFileName.endsWith(".csv") || !fs.existsSync(tablePath)) {
      res.status(404).json({ error: "table_not_found" });
      return;
    }
    res.type("text/csv").sendFile(tablePath);
  }
);

app.get(
  "/api/research/adaptive-learning/data/:fileName",
  requireAuth,
  requireRoles("teacher", "school_admin", "platform_admin"),
  (req, res) => {
    const safeFileName = path.basename(req.params.fileName);
    const dataPath = path.join(researchOutputDir, "data", safeFileName);
    if (!safeFileName.endsWith(".csv") || !fs.existsSync(dataPath)) {
      res.status(404).json({ error: "dataset_not_found" });
      return;
    }
    res.type("text/csv").sendFile(dataPath);
  }
);

app.get(
  "/api/research/adaptive-learning/report",
  requireAuth,
  requireRoles("teacher", "school_admin", "platform_admin"),
  (req, res) => {
    const reportPath = path.join(researchOutputDir, "final_report.md");
    if (!fs.existsSync(reportPath)) {
      res.status(404).json({ error: "report_not_found" });
      return;
    }
    res.type("text/markdown").sendFile(reportPath);
  }
);

app.listen(PORT, () => {
  console.log(`Lingoix API running on http://localhost:${PORT}`);
});
