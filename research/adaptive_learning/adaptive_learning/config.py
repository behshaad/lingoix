from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "outputs" / "data"
TABLE_DIR = PROJECT_ROOT / "outputs" / "tables"
FIGURE_DIR = PROJECT_ROOT / "outputs" / "figures"
REPORT_PATH = PROJECT_ROOT / "outputs" / "final_report.md"

CEFR_LEVELS = ["A1", "A2", "B1", "B2"]
QUESTION_TYPES = ["vocabulary", "grammar", "reading", "listening"]
DIFFICULTY_LEVELS = ["easy", "medium", "hard", "advanced"]

ARCHETYPES = [
    "vocabulary_weak",
    "grammar_weak",
    "reading_weak",
    "listening_weak",
    "slow_learner",
    "fast_improver",
    "plateau_learner",
    "balanced_learner",
]

SKILL_WEAKNESS_LABELS = [
    "vocabulary_weakness",
    "grammar_weakness",
    "reading_weakness",
    "listening_weakness",
    "balanced_learner",
]

ERROR_TYPES = {
    "vocabulary": [
        "vocabulary recall error",
        "article-gender association error",
        "false-friend translation error",
    ],
    "grammar": [
        "verb-position error",
        "case-marking error",
        "modal-verb conjugation error",
    ],
    "reading": [
        "main-idea misinterpretation",
        "instruction parsing error",
        "detail retrieval error",
    ],
    "listening": [
        "number misrecognition",
        "phoneme discrimination error",
        "dialogue detail omission",
    ],
}

