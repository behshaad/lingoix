PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('learner', 'teacher', 'school_admin', 'platform_admin')),
  display_name TEXT NOT NULL,
  learner_id TEXT,
  teacher_name TEXT,
  school_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cefr_level TEXT NOT NULL,
  native_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  goal TEXT NOT NULL,
  class_id TEXT NOT NULL,
  class_name TEXT NOT NULL,
  teacher TEXT NOT NULL,
  school TEXT NOT NULL,
  current_lesson TEXT NOT NULL,
  learning_path TEXT NOT NULL,
  performance TEXT NOT NULL,
  progress_percent INTEGER NOT NULL,
  completed_exercises INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  average_response_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  cefr_level TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  source_url TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  attachments TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_key TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  cefr_level TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  subskill TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  interaction_type TEXT NOT NULL DEFAULT 'flashcard',
  prompt TEXT NOT NULL DEFAULT '',
  expected_answer TEXT NOT NULL DEFAULT '',
  choices TEXT NOT NULL DEFAULT '[]',
  scoring_rule TEXT NOT NULL DEFAULT '{}',
  support_text TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE TABLE IF NOT EXISTS skill_weaknesses (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  subskill TEXT NOT NULL,
  severity TEXT NOT NULL,
  evidence_count INTEGER NOT NULL,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_events (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  type TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  subskill TEXT NOT NULL,
  correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
  response_ms INTEGER NOT NULL,
  hints_used INTEGER NOT NULL,
  retries INTEGER NOT NULL,
  error_type TEXT,
  response_value TEXT,
  score REAL,
  occurred_at TEXT NOT NULL,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE IF NOT EXISTS adaptive_decisions (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  subskill TEXT NOT NULL,
  targeted_exercise_ids TEXT NOT NULL,
  evidence_snapshot TEXT NOT NULL DEFAULT '{}',
  override_targeted_exercise_ids TEXT NOT NULL DEFAULT '[]',
  priority TEXT NOT NULL DEFAULT 'medium',
  teacher_note TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  applied_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
);
