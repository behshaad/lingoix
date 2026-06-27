from __future__ import annotations

import numpy as np
import pandas as pd


SKILL_COLUMNS = {
    "vocabulary": "vocabulary_error_rate",
    "grammar": "grammar_error_rate",
    "reading": "reading_error_rate",
    "listening": "listening_error_rate",
}


def _dominant_skill(row: pd.Series) -> str:
    return max(SKILL_COLUMNS, key=lambda skill: row[SKILL_COLUMNS[skill]])


def rule_based_adaptive_decisions(features: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for _, row in features.iterrows():
        skill = _dominant_skill(row)
        if row["mastery_score"] < 55 or row[SKILL_COLUMNS[skill]] > 0.42:
            difficulty = "easy"
        elif row["mastery_score"] > 76 and row["error_rate"] < 0.22:
            difficulty = "hard"
        else:
            difficulty = "medium"

        exercise_type = {
            "vocabulary": "spaced flashcard review",
            "grammar": "guided grammar drill",
            "reading": "short passage with targeted questions",
            "listening": "slow dialogue replay and dictation",
        }[skill]

        rows.append(
            {
                "learner_id": row["learner_id"],
                "engine": "rule_based",
                "target_skill": skill,
                "recommended_difficulty": difficulty,
                "targeted_exercise_type": exercise_type,
                "review_content": f"Review German {skill} items connected to repeated errors.",
                "next_learning_path_step": f"Insert {exercise_type} before the next mixed-skill lesson.",
                "decision_evidence": f"error_rate={row['error_rate']:.2f}; {skill}_error_rate={row[SKILL_COLUMNS[skill]]:.2f}; mastery_score={row['mastery_score']:.1f}",
            }
        )
    return pd.DataFrame(rows)


def ml_based_adaptive_decisions(features: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for _, row in features.iterrows():
        label = row["weakness_category"]
        skill = label.replace("_weakness", "") if label != "balanced_learner" else _dominant_skill(row)
        risk = 0.52 * row["error_rate"] + 0.22 * row["hint_usage_rate"] + 0.16 * row["retry_frequency"] + 0.10 * row["error_repetition_score"]
        difficulty = "easy" if risk > 0.50 else "medium" if risk > 0.28 else "hard"
        rows.append(
            {
                "learner_id": row["learner_id"],
                "engine": "ml_based",
                "target_skill": skill,
                "recommended_difficulty": difficulty,
                "targeted_exercise_type": f"model-selected {skill} intervention",
                "review_content": f"Prioritize high-importance features for {skill}: recent errors, hint use, retries, and response speed.",
                "next_learning_path_step": f"Adapt next session toward {skill} with difficulty={difficulty}.",
                "decision_evidence": f"predicted_weakness={label}; adaptive_risk={risk:.2f}; improvement_velocity={row['improvement_velocity']:.3f}",
            }
        )
    return pd.DataFrame(rows)


def simulate_adaptive_vs_traditional(features: pd.DataFrame, seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(seed + 202)
    rows = []
    for _, row in features.iterrows():
        base_mastery = row["mastery_score"]
        baseline_error = row["error_rate"]
        engagement = min(1, 0.45 + row["motivation_score"] / 160 + row["study_frequency"] / 24)
        adaptive_gain = 5.5 + 11.5 * baseline_error + 4.0 * row["hint_usage_rate"] + rng.normal(0, 2.2)
        traditional_gain = 3.0 + 4.3 * row["improvement_trend"] + rng.normal(0, 2.0)
        adaptive_error_reduction = min(0.34, 0.09 + baseline_error * 0.42 + rng.normal(0, 0.025))
        traditional_error_reduction = min(0.22, 0.04 + baseline_error * 0.18 + rng.normal(0, 0.025))

        rows.append(
            {
                "learner_id": row["learner_id"],
                "learner_archetype": row["learner_archetype"],
                "weakness_category": row["weakness_category"],
                "traditional_mastery_growth": max(0, traditional_gain),
                "adaptive_mastery_growth": max(0, adaptive_gain),
                "traditional_learning_speed": max(0.01, row["learning_speed"] + traditional_gain / 900),
                "adaptive_learning_speed": max(0.01, row["learning_speed"] + adaptive_gain / 650),
                "traditional_error_reduction": max(0, traditional_error_reduction),
                "adaptive_error_reduction": max(0, adaptive_error_reduction),
                "traditional_engagement": float(np.clip(engagement + rng.normal(0, 0.05), 0, 1)),
                "adaptive_engagement": float(np.clip(engagement + 0.08 + baseline_error * 0.10 + rng.normal(0, 0.05), 0, 1)),
            }
        )
    return pd.DataFrame(rows)

