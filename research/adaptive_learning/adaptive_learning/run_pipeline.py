from __future__ import annotations

import argparse
import json

from .analysis import descriptive_tables, statistical_tests
from .config import DATA_DIR, FIGURE_DIR, REPORT_PATH, TABLE_DIR
from .data_generation import generate_synthetic_dataset
from .features import build_learner_features
from .models import run_clustering, train_classification_models, train_regression_models
from .recommendations import ml_based_adaptive_decisions, rule_based_adaptive_decisions, simulate_adaptive_vs_traditional
from .reporting import build_report
from .visualization import create_visualizations


def _write_csv(frame, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    frame.to_csv(path, index=False)


def run(seed: int = 42) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    TABLE_DIR.mkdir(parents=True, exist_ok=True)
    FIGURE_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)

    learners, interactions = generate_synthetic_dataset(seed=seed)
    features = build_learner_features(learners, interactions)

    classification, feature_importance, tuning = train_classification_models(features, seed)
    regression = train_regression_models(features, seed)
    clustering, cluster_assignments = run_clustering(features, seed)
    rule_decisions = rule_based_adaptive_decisions(features)
    ml_decisions = ml_based_adaptive_decisions(features)
    baseline = simulate_adaptive_vs_traditional(features, seed)
    baseline_stats = statistical_tests(baseline)
    descriptive = descriptive_tables(learners, interactions, features)

    create_visualizations(learners, interactions, features, cluster_assignments)

    _write_csv(learners, DATA_DIR / "learners.csv")
    _write_csv(interactions, DATA_DIR / "interactions.csv")
    _write_csv(features, DATA_DIR / "learner_features.csv")
    _write_csv(classification, TABLE_DIR / "classification_results.csv")
    _write_csv(regression, TABLE_DIR / "regression_results.csv")
    _write_csv(clustering, TABLE_DIR / "clustering_results.csv")
    _write_csv(feature_importance, TABLE_DIR / "feature_importance.csv")
    _write_csv(tuning, TABLE_DIR / "hyperparameter_tuning.csv")
    _write_csv(rule_decisions, TABLE_DIR / "rule_based_adaptive_decisions.csv")
    _write_csv(ml_decisions, TABLE_DIR / "ml_based_adaptive_decisions.csv")
    _write_csv(baseline, TABLE_DIR / "adaptive_vs_traditional_outcomes.csv")
    _write_csv(baseline_stats, TABLE_DIR / "statistical_tests.csv")
    _write_csv(cluster_assignments, TABLE_DIR / "cluster_assignments.csv")
    for name, table in descriptive.items():
        _write_csv(table, TABLE_DIR / f"{name}.csv")

    report = build_report(
        learners=learners,
        interactions=interactions,
        features=features,
        descriptive=descriptive,
        classification=classification,
        regression=regression,
        clustering=clustering,
        feature_importance=feature_importance,
        tuning=tuning,
        baseline_stats=baseline_stats,
        rule_decisions=rule_decisions,
        ml_decisions=ml_decisions,
        seed=seed,
    )
    REPORT_PATH.write_text(report, encoding="utf-8")

    manifest = {
        "seed": seed,
        "learners": len(learners),
        "interactions": len(interactions),
        "report": str(REPORT_PATH),
        "data_dir": str(DATA_DIR),
        "table_dir": str(TABLE_DIR),
        "figure_dir": str(FIGURE_DIR),
    }
    (REPORT_PATH.parent / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps(manifest, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the adaptive language-learning synthetic research pipeline.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducible synthetic data and models.")
    args = parser.parse_args()
    run(seed=args.seed)


if __name__ == "__main__":
    main()

