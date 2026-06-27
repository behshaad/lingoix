from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd

from .config import ARCHETYPES, CEFR_LEVELS, DIFFICULTY_LEVELS, ERROR_TYPES, QUESTION_TYPES


@dataclass(frozen=True)
class ArchetypeParameters:
    weak_skill: str | None
    speed_multiplier: float
    hint_multiplier: float
    retry_multiplier: float
    improvement_slope: float
    plateau_after: float | None = None


ARCHETYPE_PARAMS: Dict[str, ArchetypeParameters] = {
    "vocabulary_weak": ArchetypeParameters("vocabulary", 1.05, 1.25, 1.20, 0.18),
    "grammar_weak": ArchetypeParameters("grammar", 1.08, 1.25, 1.25, 0.16),
    "reading_weak": ArchetypeParameters("reading", 1.12, 1.15, 1.15, 0.15),
    "listening_weak": ArchetypeParameters("listening", 1.15, 1.30, 1.18, 0.14),
    "slow_learner": ArchetypeParameters(None, 1.55, 1.25, 1.40, 0.08),
    "fast_improver": ArchetypeParameters(None, 0.88, 0.85, 0.80, 0.38),
    "plateau_learner": ArchetypeParameters(None, 1.06, 1.05, 1.08, 0.30, plateau_after=0.45),
    "balanced_learner": ArchetypeParameters(None, 0.98, 0.90, 0.85, 0.20),
}

QUESTION_SUBSKILLS = {
    "vocabulary": ["daily verbs", "separable verbs", "articles", "false friends"],
    "grammar": ["verb position", "cases", "modal verbs", "present perfect"],
    "reading": ["short passage", "instructions", "dialogue", "detail retrieval"],
    "listening": ["numbers", "slow dialogue", "chapter audio", "dictation"],
}


def _clip(value: float, low: float, high: float) -> float:
    return float(max(low, min(high, value)))


def _weighted_choice(rng: np.random.Generator, values: List[str], weights: List[float]) -> str:
    return str(rng.choice(values, p=np.array(weights) / np.sum(weights)))


def _weakness_label(archetype: str, rng: np.random.Generator) -> str:
    mapping = {
        "vocabulary_weak": "vocabulary_weakness",
        "grammar_weak": "grammar_weakness",
        "reading_weak": "reading_weakness",
        "listening_weak": "listening_weakness",
        "balanced_learner": "balanced_learner",
    }
    if archetype in mapping:
        return mapping[archetype]
    return _weighted_choice(
        rng,
        ["vocabulary_weakness", "grammar_weakness", "reading_weakness", "listening_weakness", "balanced_learner"],
        [0.18, 0.20, 0.16, 0.16, 0.30],
    )


def generate_synthetic_dataset(
    n_learners: int = 100,
    min_interactions: int = 200,
    max_interactions: int = 500,
    seed: int = 42,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    rng = np.random.default_rng(seed)
    learners = []
    interactions = []
    start_time = datetime(2025, 1, 6, 9, 0)

    archetype_weights = np.array([0.14, 0.14, 0.11, 0.11, 0.12, 0.13, 0.12, 0.13])

    for idx in range(n_learners):
        learner_id = f"L{idx + 1:03d}"
        archetype = str(rng.choice(ARCHETYPES, p=archetype_weights))
        params = ARCHETYPE_PARAMS[archetype]
        weakness_label = _weakness_label(archetype, rng)
        age = int(_clip(rng.normal(25, 6.5), 16, 48))
        learning_level = _weighted_choice(rng, CEFR_LEVELS, [0.36, 0.34, 0.22, 0.08])
        motivation_score = round(_clip(rng.normal(72, 14), 25, 98), 2)
        study_frequency = int(_clip(round(rng.normal(4.2, 1.4)), 1, 7))
        n_events = int(rng.integers(min_interactions, max_interactions + 1))

        level_bonus = {"A1": -0.08, "A2": 0.00, "B1": 0.07, "B2": 0.13}[learning_level]
        motivation_bonus = (motivation_score - 70) / 250
        frequency_bonus = (study_frequency - 4) / 90
        base_ability = _clip(0.60 + level_bonus + motivation_bonus + frequency_bonus + rng.normal(0, 0.05), 0.35, 0.88)

        skill_bias = {skill: rng.normal(0, 0.04) for skill in QUESTION_TYPES}
        if params.weak_skill:
            skill_bias[params.weak_skill] -= 0.22
        if weakness_label != "balanced_learner":
            weak_skill = weakness_label.replace("_weakness", "")
            skill_bias[weak_skill] -= 0.12

        learners.append(
            {
                "learner_id": learner_id,
                "age": age,
                "learning_level": learning_level,
                "motivation_score": motivation_score,
                "study_frequency": study_frequency,
                "learner_archetype": archetype,
                "weakness_category": weakness_label,
                "planned_interaction_count": n_events,
            }
        )

        session = 1
        session_event_count = 0
        previous_question_by_skill: Dict[str, str] = {}

        for event_idx in range(n_events):
            progress = event_idx / max(n_events - 1, 1)
            if session_event_count >= rng.integers(8, 17):
                session += 1
                session_event_count = 0
            session_event_count += 1

            if params.weak_skill and rng.random() < 0.42:
                question_type = params.weak_skill
            else:
                question_type = str(rng.choice(QUESTION_TYPES))

            difficulty_idx = min(
                len(DIFFICULTY_LEVELS) - 1,
                max(0, int(progress * 4 + {"A1": 0, "A2": 0.35, "B1": 0.75, "B2": 1.1}[learning_level] + rng.normal(0, 0.65))),
            )
            difficulty_level = DIFFICULTY_LEVELS[difficulty_idx]
            difficulty_penalty = [0.00, 0.08, 0.17, 0.25][difficulty_idx]

            if params.plateau_after and progress > params.plateau_after:
                improvement = params.improvement_slope * params.plateau_after + (progress - params.plateau_after) * 0.025
            else:
                improvement = params.improvement_slope * progress

            ability = _clip(base_ability + skill_bias[question_type] + improvement, 0.05, 0.96)
            probability_correct = _clip(ability - difficulty_penalty + rng.normal(0, 0.035), 0.04, 0.98)
            correct = bool(rng.random() < probability_correct)

            repeated_mistake = False
            question_id = f"Q-{question_type[:3].upper()}-{difficulty_idx + 1}-{rng.integers(1, 81):03d}"
            if not correct and previous_question_by_skill.get(question_type) and rng.random() < 0.28:
                question_id = previous_question_by_skill[question_type]
                repeated_mistake = True
            if not correct:
                previous_question_by_skill[question_type] = question_id

            base_time = {"vocabulary": 19, "grammar": 31, "reading": 45, "listening": 39}[question_type]
            response_time = _clip(
                rng.lognormal(mean=np.log(base_time * params.speed_multiplier * (1 + difficulty_penalty)), sigma=0.28),
                5,
                180,
            )
            if correct and response_time > base_time * 1.8:
                error_pattern = "slow but correct response"
            elif correct:
                error_pattern = ""
            else:
                error_pattern = str(rng.choice(ERROR_TYPES[question_type]))

            retry_lambda = _clip((0.25 + difficulty_penalty * 2.2 + (0 if correct else 0.9)) * params.retry_multiplier, 0.05, 3.8)
            attempt_count = int(1 + min(5, rng.poisson(retry_lambda)))
            hint_probability = _clip((0.08 + difficulty_penalty * 0.85 + (0 if correct else 0.23)) * params.hint_multiplier, 0.02, 0.86)
            hint_requested = bool(rng.random() < hint_probability)

            day_offset = int(session * (7 / max(study_frequency, 1)) + rng.normal(0, 0.9))
            timestamp = start_time + timedelta(days=max(0, day_offset), minutes=int(rng.integers(0, 540)))

            interactions.append(
                {
                    "learner_id": learner_id,
                    "question_id": question_id,
                    "question_type": question_type,
                    "subskill": str(rng.choice(QUESTION_SUBSKILLS[question_type])),
                    "difficulty_level": difficulty_level,
                    "response_time": round(response_time, 3),
                    "attempt_count": attempt_count,
                    "correct_or_incorrect": int(correct),
                    "hint_requested": int(hint_requested),
                    "session_number": session,
                    "timestamp": timestamp.isoformat(),
                    "error_pattern": error_pattern,
                    "repeated_mistake": int(repeated_mistake),
                    "simulated_progress": round(progress, 4),
                }
            )

    return pd.DataFrame(learners), pd.DataFrame(interactions)

