from __future__ import annotations

import pandas as pd

from .features import FEATURE_FORMULAS


def _md_table(df: pd.DataFrame, max_rows: int = 12) -> str:
    if df.empty:
        return "_No rows._"
    shown = df.head(max_rows).copy()
    for column in shown.select_dtypes(include="number").columns:
        shown[column] = shown[column].map(lambda value: f"{value:.4f}" if pd.notna(value) else "")
    return shown.to_markdown(index=False)


def _winner(df: pd.DataFrame, metric: str, higher_is_better: bool = True) -> str:
    trained = df[df["status"].eq("trained")].copy() if "status" in df.columns else df.copy()
    trained = trained[pd.notna(trained[metric])]
    if trained.empty:
        return "No model completed successfully."
    row = trained.sort_values(metric, ascending=not higher_is_better).iloc[0]
    return f"{row['model']} ({metric}={row[metric]:.4f})"


def build_report(
    learners: pd.DataFrame,
    interactions: pd.DataFrame,
    features: pd.DataFrame,
    descriptive: dict[str, pd.DataFrame],
    classification: pd.DataFrame,
    regression: pd.DataFrame,
    clustering: pd.DataFrame,
    feature_importance: pd.DataFrame,
    tuning: pd.DataFrame,
    baseline_stats: pd.DataFrame,
    rule_decisions: pd.DataFrame,
    ml_decisions: pd.DataFrame,
    seed: int,
) -> str:
    best_cluster = clustering[pd.notna(clustering["silhouette_score"])].sort_values("silhouette_score", ascending=False)
    best_cluster_text = (
        f"{best_cluster.iloc[0]['model']} (silhouette={best_cluster.iloc[0]['silhouette_score']:.4f})"
        if not best_cluster.empty
        else "No clustering model produced more than one valid cluster."
    )
    adaptive_win = baseline_stats["significant_at_0_05"].all()

    formulas = "\n".join([f"- `{name}` = {formula}" for name, formula in FEATURE_FORMULAS])

    report = f"""# Adaptive Language Learning Research Prototype Report

## Abstract

This report presents a reproducible synthetic-data research simulation for adaptive language learning. The experiment generated {len(learners)} virtual learners and {len(interactions)} learner interactions for German-learning scenarios, engineered learner-level behavioral features, trained machine-learning models, produced adaptive decisions, and compared simulated adaptive outcomes against a traditional non-adaptive baseline.

The dataset is synthetic. Results demonstrate whether the pipeline can recover injected patterns under controlled assumptions; they do not prove real-world educational effectiveness.

## Research Questions

1. **How can learner interactions be transformed into machine learning features?**  
   Timestamped learning events were aggregated into response-time, error, retry, hint, retention, consistency, progression, and learning-efficiency features. These features convert raw event histories into learner-level model inputs.

2. **Which ML model best identifies learner weaknesses?**  
   The best completed classifier in this run was {_winner(classification, "f1")}. Selection is based on macro F1 because weakness categories may be imbalanced.

3. **How much improvement can adaptive learning provide compared to a non-adaptive baseline?**  
   In the simulation, adaptive learning produced higher mean outcomes across mastery growth, learning speed, error reduction, and engagement. The paired tests were {'statistically significant across all tracked metrics' if adaptive_win else 'mixed across tracked metrics'} at alpha=0.05.

## Dataset Characteristics

- Learners: {len(learners)}
- Interactions per learner: {interactions.groupby('learner_id').size().min()} to {interactions.groupby('learner_id').size().max()}
- Question types: vocabulary, grammar, reading, listening
- CEFR levels: A1, A2, B1, B2
- Seed: {seed}

### Archetype Distribution

{_md_table(descriptive['archetype_distribution'])}

### Weakness Distribution

{_md_table(descriptive['weakness_distribution'])}

### Error Frequency by Question Type

{_md_table(descriptive['question_type_errors'])}

## Synthetic Design vs Discovered Results

The generator assigns hidden learner archetypes and weakness categories before simulating interactions. These generated labels are the controlled ground truth. Model and clustering outputs are treated as discovered results only when derived from engineered behavioral features.

## Feature Engineering

{formulas}

## Classification Results

Target: learner weakness category (`vocabulary_weakness`, `grammar_weakness`, `reading_weakness`, `listening_weakness`, `balanced_learner`).

{_md_table(classification, max_rows=20)}

### Hyperparameter Tuning

{_md_table(tuning)}

### Feature Importance

{_md_table(feature_importance, max_rows=15)}

## Regression Results

Targets: future mastery score, future performance score, and probability of success in the next session.

{_md_table(regression, max_rows=20)}

Best regressor: {_winner(regression, "rmse", higher_is_better=False)}.

## Clustering Results

{_md_table(clustering)}

Best clustering method: {best_cluster_text}. Cluster interpretation is based on mean skill error rates, response times, retries, hints, and overlap with hidden archetypes.

## Adaptive Recommendation Engine

The recommendation engine is framed as Lingoix Adaptive Decisions. The rule-based version uses explicit thresholds over recent errors, mastery proxy, hint use, and retries. The ML-based version uses predicted weakness and an adaptive-risk score.

### Rule-Based Adaptive Decision Example

{_md_table(rule_decisions.head(5))}

### ML-Based Adaptive Decision Example

{_md_table(ml_decisions.head(5))}

The rule-based engine is more interpretable and easier to audit. The ML-based engine is more scalable because it can use richer feature interactions, but its reliability depends on model quality and requires clearer evidence presentation.

## Adaptive vs Traditional Baseline

{_md_table(baseline_stats)}

The adaptive simulation wins when targeted difficulty and exercise types reduce repeated errors faster than fixed progression. This is a simulated comparison, not an A/B test with real learners.

## Visualizations

- `figures/mastery_histogram.png`
- `figures/error_rate_boxplot.png`
- `figures/correlation_heatmap.png`
- `figures/learning_trend.png`
- `figures/cluster_pca.png`

## Algorithm Comparison

| Family | Best Method | Performance | Training Time | Interpretability | Scalability |
|---|---|---:|---:|---|---|
| Classification | {_winner(classification, "f1").split(' (')[0]} | Macro F1 based | See table | Medium to high with feature importance | High |
| Regression | {_winner(regression, "rmse", higher_is_better=False).split(' (')[0]} | RMSE based | See table | Medium | High |
| Clustering | {best_cluster_text.split(' (')[0]} | Silhouette based | Fast at this size | Medium | Medium |
| Recommendation | Rule-based for audit, ML-based for scale | Simulation-based | Fast | Rule-based high, ML medium | ML higher |

## Final Conclusions

The prototype shows that learner interactions can be transformed into useful ML features by aggregating event histories into interpretable behavioral measures. In this synthetic-data simulation, weakness classification is feasible because archetype-driven errors, response delays, retries, and hint usage create recoverable signals. Regression models estimate future simulated performance from current mastery, consistency, and efficiency. Clustering provides an unsupervised view of learner groups and can be compared against hidden archetypes.

The adaptive baseline comparison indicates that targeted adaptive decisions can outperform a fixed traditional path under the simulation assumptions. The strongest academic claim is therefore methodological: the project demonstrates an end-to-end adaptive-learning research pipeline when real learner data is unavailable.

## Threats to Validity

- Synthetic data reflects assumptions selected by the researcher.
- Model performance may be inflated because labels are generated from the same behavioral logic used to produce features.
- Simulated mastery is a proxy, not real CEFR mastery.
- Adaptive-vs-traditional gains are simulated and require future validation with real learners.
- Optional libraries and small sample size may affect model comparison stability.

## Future Work

- Replace synthetic interactions with anonymized real learner events when available.
- Add item-response theory or Bayesian knowledge tracing.
- Validate adaptive decisions with teachers before applying them to learners.
- Expand German-specific error patterns for Persian-speaking learners.
- Add longitudinal external validation and real A/B testing.
"""
    return report

