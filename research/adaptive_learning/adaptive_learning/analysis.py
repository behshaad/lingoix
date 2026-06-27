from __future__ import annotations

import numpy as np
import pandas as pd
from scipy import stats


def statistical_tests(baseline: pd.DataFrame) -> pd.DataFrame:
    pairs = [
        ("mastery_growth", "adaptive_mastery_growth", "traditional_mastery_growth"),
        ("learning_speed", "adaptive_learning_speed", "traditional_learning_speed"),
        ("error_reduction", "adaptive_error_reduction", "traditional_error_reduction"),
        ("engagement", "adaptive_engagement", "traditional_engagement"),
    ]
    rows = []
    for metric, adaptive, traditional in pairs:
        t_stat, p_value = stats.ttest_rel(baseline[adaptive], baseline[traditional])
        effect = (baseline[adaptive] - baseline[traditional]).mean() / max((baseline[adaptive] - baseline[traditional]).std(ddof=1), 1e-9)
        rows.append(
            {
                "metric": metric,
                "adaptive_mean": baseline[adaptive].mean(),
                "traditional_mean": baseline[traditional].mean(),
                "mean_difference": (baseline[adaptive] - baseline[traditional]).mean(),
                "t_statistic": t_stat,
                "p_value": p_value,
                "cohens_d_paired": effect,
                "significant_at_0_05": bool(p_value < 0.05),
            }
        )
    return pd.DataFrame(rows)


def descriptive_tables(learners: pd.DataFrame, interactions: pd.DataFrame, features: pd.DataFrame) -> dict[str, pd.DataFrame]:
    return {
        "archetype_distribution": learners["learner_archetype"].value_counts().rename_axis("learner_archetype").reset_index(name="count"),
        "weakness_distribution": learners["weakness_category"].value_counts().rename_axis("weakness_category").reset_index(name="count"),
        "question_type_errors": interactions.assign(error=1 - interactions["correct_or_incorrect"]).groupby("question_type", as_index=False)["error"].mean().rename(columns={"error": "error_rate"}),
        "level_summary": features.groupby("learning_level", as_index=False).agg(
            learner_count=("learner_id", "count"),
            mean_mastery=("mastery_score", "mean"),
            mean_error_rate=("error_rate", "mean"),
            mean_response_time=("mean_response_time", "mean"),
        ),
    }

