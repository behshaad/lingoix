const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const { db, initializeDatabase } = require("./db");

const app = express();
const PORT = process.env.API_PORT || 4000;
const SESSION_COOKIE = "lingoix_session";
const DAY_MS = 24 * 60 * 60 * 1000;

initializeDatabase();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const jsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
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
  };
};

const serializeLearner = (row) => ({
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
  learningPath: jsonParse(row.learning_path, []),
  performance: jsonParse(row.performance, {}),
  progressPercent: row.progress_percent,
  completedExercises: row.completed_exercises,
  accuracy: row.accuracy,
  averageResponseMs: row.average_response_ms,
});

const serializeResource = (row) => ({
  id: row.id,
  title: row.title,
  type: row.type,
  cefrLevel: row.cefr_level,
  skillArea: row.skill_area,
  sourceUrl: row.source_url,
  description: row.description,
});

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
  teacherNote: row.teacher_note,
  reviewedBy: row.reviewed_by,
  reviewedAt: row.reviewed_at,
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

const learnerScopeClause = (account) => {
  if (account.role === "platform_admin") return { sql: "", params: [] };
  if (account.role === "school_admin") return { sql: "WHERE school = ?", params: [account.school_name] };
  if (account.role === "teacher") return { sql: "WHERE teacher = ?", params: [account.teacher_name] };
  return { sql: "WHERE id = ?", params: [account.learner_id] };
};

const getLearnerRowsForAccount = (account) => {
  const scope = learnerScopeClause(account);
  return db.prepare(`SELECT * FROM learners ${scope.sql} ORDER BY name`).all(...scope.params);
};

const canAccessLearner = (account, learner) => {
  if (!learner) return false;
  if (account.role === "platform_admin") return true;
  if (account.role === "school_admin") return learner.school === account.school_name;
  if (account.role === "teacher") return learner.teacher === account.teacher_name;
  return learner.id === account.learner_id;
};

const getLearnerBundle = (learnerId) => {
  const learnerRow = db.prepare("SELECT * FROM learners WHERE id = ?").get(learnerId);
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
  return {
    ...learner,
    skillWeaknesses,
    learningEvents,
    adaptiveDecisions,
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

const runAdaptiveRulesForLearner = (learnerId) => {
  const rows = db
    .prepare(
      `SELECT skill_area, subskill, COUNT(*) AS misses
       FROM learning_events
       WHERE learner_id = ? AND correct = 0
       GROUP BY skill_area, subskill
       HAVING misses >= 3`
    )
    .all(learnerId);

  const insertDecision = db.prepare(`
    INSERT OR IGNORE INTO adaptive_decisions (
      id, learner_id, type, status, reason, skill_area, subskill,
      targeted_exercise_ids, created_at
    ) VALUES (
      @id, @learnerId, 'remediation', 'active', @reason, @skillArea, @subskill,
      @targetedExerciseIds, @createdAt
    )
  `);

  rows.forEach((row) => {
    const targeted = db
      .prepare("SELECT id FROM exercises WHERE skill_area = ? ORDER BY estimated_minutes LIMIT 4")
      .all(row.skill_area)
      .map((exercise) => exercise.id);

    insertDecision.run({
      id: `${learnerId}-rule-${row.skill_area}-${row.subskill}`.replace(/\s+/g, "-"),
      learnerId,
      reason: `${row.misses} repeated misses in ${row.subskill}`,
      skillArea: row.skill_area,
      subskill: row.subskill,
      targetedExerciseIds: JSON.stringify(targeted),
      createdAt: new Date().toISOString(),
    });
  });
};

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const account = db.prepare("SELECT * FROM accounts WHERE email = ?").get(email);
  if (!account || !bcrypt.compareSync(password || "", account.password_hash)) {
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * DAY_MS).toISOString();
  db.prepare("INSERT INTO sessions (token, account_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    account.id,
    expiresAt
  );

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * DAY_MS,
  });
  res.json({ account: publicAccount(account), sessionToken: token });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(req.cookies[SESSION_COOKIE]);
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ account: publicAccount(req.account) });
});

app.get("/api/learners", requireAuth, (req, res) => {
  res.json({ learners: getLearnerRowsForAccount(req.account).map(serializeLearner) });
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
  res.json({ resources: db.prepare("SELECT * FROM resources ORDER BY title").all().map(serializeResource) });
});

app.post("/api/resources", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const resource = req.body;
  db.prepare(
    `INSERT INTO resources (id, title, type, cefr_level, skill_area, source_url, description)
     VALUES (@id, @title, @type, @cefrLevel, @skillArea, @sourceUrl, @description)`
  ).run(resource);
  res.status(201).json({ resource });
});

app.put("/api/resources/:resourceId", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const resource = { ...req.body, id: req.params.resourceId };
  db.prepare(
    `UPDATE resources SET title=@title, type=@type, cefr_level=@cefrLevel,
     skill_area=@skillArea, source_url=@sourceUrl, description=@description WHERE id=@id`
  ).run(resource);
  res.json({ resource });
});

app.get("/api/exercises", requireAuth, (req, res) => {
  res.json({ exercises: db.prepare("SELECT * FROM exercises ORDER BY id").all().map(serializeExercise) });
});

app.post("/api/exercises", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const exercise = req.body;
  db.prepare(
    `INSERT INTO exercises (id, title, title_key, sequence, cefr_level, difficulty, skill_area, subskill, resource_id, estimated_minutes)
     VALUES (@id, @title, @titleKey, @sequence, @cefrLevel, @difficulty, @skillArea, @subskill, @resourceId, @estimatedMinutes)`
  ).run(exercise);
  res.status(201).json({ exercise });
});

app.put("/api/exercises/:exerciseId", requireAuth, requireRoles("platform_admin"), (req, res) => {
  const exercise = { ...req.body, id: req.params.exerciseId };
  db.prepare(
    `UPDATE exercises
     SET title=@title, title_key=@titleKey, sequence=@sequence, cefr_level=@cefrLevel,
       difficulty=@difficulty, skill_area=@skillArea, subskill=@subskill,
       resource_id=@resourceId, estimated_minutes=@estimatedMinutes
     WHERE id=@id`
  ).run(exercise);
  res.json({ exercise });
});

app.post("/api/learning-events", requireAuth, (req, res) => {
  const event = {
    id: req.body.id || `event-${crypto.randomUUID()}`,
    learnerId: req.body.learnerId || req.account.learner_id,
    type: req.body.type,
    exerciseId: req.body.exerciseId,
    skillArea: req.body.skillArea,
    subskill: req.body.subskill,
    correct: req.body.correct ? 1 : 0,
    responseMs: req.body.responseMs,
    hintsUsed: req.body.hintsUsed || 0,
    retries: req.body.retries || 0,
    errorType: req.body.errorType || null,
    occurredAt: req.body.occurredAt || new Date().toISOString(),
  };
  const learner = getLearnerBundle(event.learnerId);
  if (!canAccessLearner(req.account, learner)) {
    res.status(403).json({ error: "forbidden" });
    return;
  }

  db.prepare(
    `INSERT INTO learning_events (id, learner_id, type, exercise_id, skill_area, subskill, correct, response_ms, hints_used, retries, error_type, occurred_at)
     VALUES (@id, @learnerId, @type, @exerciseId, @skillArea, @subskill, @correct, @responseMs, @hintsUsed, @retries, @errorType, @occurredAt)`
  ).run(event);
  runAdaptiveRulesForLearner(event.learnerId);
  res.status(201).json({ event: { ...event, correct: Boolean(event.correct) } });
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

    db.prepare(
      `UPDATE adaptive_decisions
       SET status = @status, teacher_note = @teacherNote, reviewed_by = @reviewedBy, reviewed_at = @reviewedAt
       WHERE id = @id`
    ).run({
      id: req.params.decisionId,
      status: req.body.status,
      teacherNote: req.body.teacherNote || null,
      reviewedBy: req.account.id,
      reviewedAt: new Date().toISOString(),
    });
    res.json({ decision: serializeDecision(db.prepare("SELECT * FROM adaptive_decisions WHERE id = ?").get(req.params.decisionId)) });
  }
);

app.get("/api/reports/platform", requireAuth, (req, res) => {
  res.json({ report: getPlatformReport(req.account) });
});

app.listen(PORT, () => {
  console.log(`Lingoix API running on http://localhost:${PORT}`);
});
