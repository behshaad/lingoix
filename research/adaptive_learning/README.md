# Adaptive Language Learning Research Prototype

This standalone Python research module implements a synthetic-data research simulation for the thesis:

> Design and Implementation of an Adaptive Language Learning System Based on Learner Performance Analysis and Error Pattern Detection Using Machine Learning

The prototype generates 100 synthetic learners, simulates 200-500 learning interactions per learner, engineers learner-level features, trains classification/regression/clustering models, evaluates adaptive decisions against a traditional baseline, and writes a thesis-style Markdown report.

## Setup

```bash
cd research/adaptive_learning
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Optional gradient-boosting libraries can be installed with:

```bash
pip install -r requirements-optional.txt
```

On macOS, XGBoost and LightGBM may also require OpenMP (`libomp`). If it is missing, the pipeline marks those models as unavailable and still completes.

## Single Command

From the repository root:

```bash
python research/adaptive_learning/run_pipeline.py --seed 42
```

If optional libraries such as XGBoost, LightGBM, or CatBoost are unavailable, the pipeline records them as unavailable and continues.

## Outputs

The pipeline overwrites reproducible outputs under `research/adaptive_learning/outputs/`:

- `data/learners.csv`
- `data/interactions.csv`
- `data/learner_features.csv`
- `tables/*.csv`
- `figures/*.png`
- `final_report.md`

## Academic Framing

This is a synthetic-data research simulation. It evaluates whether the ML pipeline can recover injected learner weaknesses and simulated adaptive effects under explicit assumptions. It is not a validated learner study and does not prove real-world educational effectiveness.
