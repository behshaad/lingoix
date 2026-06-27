from __future__ import annotations

import numpy as np
import pandas as pd

from .config import DIFFICULTY_LEVELS, QUESTION_TYPES

DIFFICULTY_NUMERIC = {name: idx + 1 for idx, name in enumerate(DIFFICULTY_LEVELS)}


def _safe_divide(numerator: float, denominator: float) -> float:
    return float(numerator / denominator) if denominator else 0.0


def _trend(values: pd.Series) -> float:
    if len(values) < 2:
        return 0.0
    x = np.arange(len(values), dtype=float)
    return float(np.polyfit(x, values.astype(float), 1)[0])


def _consistency(values: pd.Series) -> float:
    if len(values) == 0:
        return 0.0
    return float(max(0.0, 1.0 - values.std(ddof=0)))


def build_learner_features(learners: pd.DataFrame, interactions: pd.DataFrame) -> pd.DataFrame:
    rows = []
    work = interactions.copy()
    work["difficulty_numeric"] = work["difficulty_level"].map(DIFFICULTY_NUMERIC).fillna(1)
    work["incorrect"] = 1 - work["correct_or_incorrect"]

    for learner_id, group in work.groupby("learner_id"):
        group = group.sort_values(["session_number", "timestamp"]).reset_index(drop=True)
        learner = learners.loc[learners["learner_id"] == learner_id].iloc[0].to_dict()
        n = len(group)
        first_window = group.iloc[: max(20, n // 5)]
        last_window = group.iloc[-max(20, n // 5) :]
        session_accuracy = group.groupby("session_number")["correct_or_incorrect"].mean()
        session_mastery = []

        for _, session_group in group.groupby("session_number"):
            accuracy = session_group["correct_or_incorrect"].mean()
            retention = session_group.drop_duplicates("question_id", keep="last")["correct_or_incorrect"].mean()
            response_efficiency = 1 - min(session_group["response_time"].median() / 95, 1)
            consistency = _consistency(session_group["correct_or_incorrect"])
            session_mastery.append(
                100
                * (
                    0.45 * accuracy
                    + 0.25 * retention
                    + 0.20 * consistency
                    + 0.10 * response_efficiency
                )
            )

        error_rate = group["incorrect"].mean()
        retry_frequency = (group["attempt_count"] > 1).mean()
        hint_usage_rate = group["hint_requested"].mean()
        error_repetition_score = group["repeated_mistake"].sum() / max(group["incorrect"].sum(), 1)
        improvement_trend = last_window["correct_or_incorrect"].mean() - first_window["correct_or_incorrect"].mean()
        learning_speed = _safe_divide(improvement_trend, max(group["session_number"].max(), 1))
        retention_score = group.drop_duplicates(["question_id"], keep="last")["correct_or_incorrect"].mean()
        consistency_score = _consistency(session_accuracy)
        response_efficiency = 1 - min(group["response_time"].median() / 100, 1)
        mastery_score = 100 * (
            0.45 * last_window["correct_or_incorrect"].mean()
            + 0.25 * retention_score
            + 0.20 * consistency_score
            + 0.10 * response_efficiency
        )
        progression_score = 100 * (0.65 * improvement_trend + 0.35 * last_window["difficulty_numeric"].mean() / 4)
        improvement_velocity = _trend(session_accuracy)
        learning_efficiency_index = 100 * (
            group["correct_or_incorrect"].mean()
            / max((group["response_time"].mean() / 60) * (1 + retry_frequency + hint_usage_rate), 0.2)
        )

        skill_error_rates = {}
        skill_response_times = {}
        for skill in QUESTION_TYPES:
            skill_group = group[group["question_type"] == skill]
            skill_error_rates[f"{skill}_error_rate"] = (
                1 - skill_group["correct_or_incorrect"].mean() if len(skill_group) else 0.0
            )
            skill_response_times[f"{skill}_mean_response_time"] = (
                skill_group["response_time"].mean() if len(skill_group) else 0.0
            )

        learner_number = int(str(learner_id).replace("L", ""))
        deterministic_noise = np.sin(learner_number * 1.73) * 1.8
        future_mastery_score = float(
            np.clip(
                mastery_score
                + 32 * np.tanh(improvement_velocity * 9)
                + 4.5 * np.sqrt(max(retention_score, 0))
                - 7.0 * (error_rate**2)
                + deterministic_noise,
                0,
                100,
            )
        )
        future_performance_score = float(
            np.clip(
                100 * last_window["correct_or_incorrect"].mean()
                + 13 * np.tanh(improvement_trend)
                - 4 * hint_usage_rate
                + deterministic_noise * 0.7,
                0,
                100,
            )
        )
        next_session_success_probability = float(
            np.clip(
                last_window["correct_or_incorrect"].mean()
                + 0.18 * np.tanh(improvement_velocity * 10)
                - 0.08 * retry_frequency
                + deterministic_noise / 220,
                0.01,
                0.99,
            )
        )

        rows.append(
            {
                **learner,
                "interaction_count": n,
                "session_count": int(group["session_number"].max()),
                "average_response_time": group["response_time"].mean(),
                "mean_response_time": group["response_time"].mean(),
                "median_response_time": group["response_time"].median(),
                "error_rate": error_rate,
                "error_frequency": group["incorrect"].sum(),
                "retry_frequency": retry_frequency,
                "hint_usage_rate": hint_usage_rate,
                "repeated_mistakes": group["repeated_mistake"].sum(),
                "error_repetition_score": error_repetition_score,
                "improvement_trend": improvement_trend,
                "learning_speed": learning_speed,
                "retention_score": retention_score,
                "mastery_score": mastery_score,
                "progression_score": progression_score,
                "consistency_score": consistency_score,
                "improvement_velocity": improvement_velocity,
                "learning_efficiency_index": learning_efficiency_index,
                "future_mastery_score": future_mastery_score,
                "future_performance_score": future_performance_score,
                "next_session_success_probability": next_session_success_probability,
                **skill_error_rates,
                **skill_response_times,
            }
        )

    features = pd.DataFrame(rows)
    return features.replace([np.inf, -np.inf], np.nan).fillna(0)


FEATURE_FORMULAS = [
    ("mean_response_time", "sum(response_time_i) / n"),
    ("median_response_time", "median(response_time_i)"),
    ("error_frequency", "sum(1 - correct_i)"),
    ("retry_frequency", "count(attempt_count_i > 1) / n"),
    ("hint_usage_rate", "sum(hint_requested_i) / n"),
    ("progression_score", "100 * (0.65 * improvement_trend + 0.35 * mean_recent_difficulty / 4)"),
    ("consistency_score", "max(0, 1 - std(session_accuracy))"),
    ("error_repetition_score", "repeated_mistakes / max(total_errors, 1)"),
    ("improvement_velocity", "slope of session_accuracy over chronological sessions"),
    ("learning_efficiency_index", "100 * accuracy / ((mean_response_time / 60) * (1 + retry_frequency + hint_usage_rate))"),
    ("retention_score", "accuracy on the latest attempt for each repeated question_id"),
    ("mastery_score", "100 * (0.45 * recent_accuracy + 0.25 * retention + 0.20 * consistency + 0.10 * response_efficiency)"),
]
