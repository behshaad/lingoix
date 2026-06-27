from __future__ import annotations

import time
import warnings
from typing import Dict, Iterable, List, Tuple

import numpy as np
import pandas as pd
from sklearn.base import clone
from sklearn.cluster import AgglomerativeClustering, DBSCAN, KMeans
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.exceptions import UndefinedMetricWarning
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    davies_bouldin_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
    silhouette_score,
)
from sklearn.model_selection import GridSearchCV, StratifiedKFold, cross_val_score, train_test_split
from sklearn.multiclass import OneVsRestClassifier
from sklearn.multioutput import MultiOutputRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler, label_binarize
from sklearn.svm import SVC

warnings.filterwarnings("ignore", category=UndefinedMetricWarning)
warnings.filterwarnings("ignore", category=FutureWarning, message=".*probability.*")


NUMERIC_FEATURES = [
    "age",
    "motivation_score",
    "study_frequency",
    "interaction_count",
    "session_count",
    "mean_response_time",
    "median_response_time",
    "error_rate",
    "error_frequency",
    "retry_frequency",
    "hint_usage_rate",
    "error_repetition_score",
    "improvement_trend",
    "learning_speed",
    "retention_score",
    "mastery_score",
    "progression_score",
    "consistency_score",
    "improvement_velocity",
    "learning_efficiency_index",
    "vocabulary_error_rate",
    "grammar_error_rate",
    "reading_error_rate",
    "listening_error_rate",
    "vocabulary_mean_response_time",
    "grammar_mean_response_time",
    "reading_mean_response_time",
    "listening_mean_response_time",
]
CATEGORICAL_FEATURES = ["learning_level"]
TARGET_COLUMNS = ["future_mastery_score", "future_performance_score", "next_session_success_probability"]


def _optional_import(module_name: str):
    try:
        return __import__(module_name)
    except Exception:
        return None


def _preprocessor(scale_numeric: bool = False) -> ColumnTransformer:
    numeric_steps = [("imputer", SimpleImputer(strategy="median"))]
    if scale_numeric:
        numeric_steps.append(("scaler", StandardScaler()))
    numeric = Pipeline(numeric_steps)
    categorical = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    return ColumnTransformer(
        [
            ("num", numeric, NUMERIC_FEATURES),
            ("cat", categorical, CATEGORICAL_FEATURES),
        ]
    )


def _pipeline(estimator, scale_numeric: bool = False) -> Pipeline:
    return Pipeline([("preprocess", _preprocessor(scale_numeric)), ("model", estimator)])


def _available_classifiers(seed: int, n_classes: int) -> Dict[str, object | None]:
    xgb = _optional_import("xgboost")
    lgb = _optional_import("lightgbm")
    catboost = _optional_import("catboost")

    models: Dict[str, object | None] = {
        "Random Forest": RandomForestClassifier(n_estimators=250, random_state=seed, class_weight="balanced"),
        "Logistic Regression": LogisticRegression(max_iter=2000, class_weight="balanced"),
        "SVM": SVC(kernel="rbf", probability=True, class_weight="balanced", random_state=seed),
        "XGBoost": None,
        "LightGBM": None,
        "CatBoost": None,
    }
    if xgb is not None:
        models["XGBoost"] = xgb.XGBClassifier(
            n_estimators=160,
            max_depth=3,
            learning_rate=0.05,
            subsample=0.9,
            colsample_bytree=0.9,
            eval_metric="mlogloss",
            objective="multi:softprob",
            num_class=n_classes,
            random_state=seed,
        )
    if lgb is not None:
        models["LightGBM"] = lgb.LGBMClassifier(n_estimators=160, learning_rate=0.05, random_state=seed, verbose=-1)
    if catboost is not None:
        models["CatBoost"] = catboost.CatBoostClassifier(
            iterations=160,
            learning_rate=0.05,
            depth=4,
            verbose=False,
            random_seed=seed,
            allow_writing_files=False,
        )
    return models


def _available_regressors(seed: int) -> Dict[str, object | None]:
    xgb = _optional_import("xgboost")
    lgb = _optional_import("lightgbm")

    models: Dict[str, object | None] = {
        "Random Forest Regressor": RandomForestRegressor(n_estimators=250, random_state=seed),
        "Linear Regression": LinearRegression(),
        "XGBoost Regressor": None,
        "LightGBM Regressor": None,
    }
    if xgb is not None:
        models["XGBoost Regressor"] = MultiOutputRegressor(
            xgb.XGBRegressor(n_estimators=150, max_depth=3, learning_rate=0.05, random_state=seed)
        )
    if lgb is not None:
        models["LightGBM Regressor"] = MultiOutputRegressor(
            lgb.LGBMRegressor(n_estimators=150, learning_rate=0.05, random_state=seed, verbose=-1)
        )
    return models


def train_classification_models(features: pd.DataFrame, seed: int) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    x = features[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y_labels = features["weakness_category"]
    encoder = LabelEncoder()
    y = encoder.fit_transform(y_labels)
    class_names = list(encoder.classes_)
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25, stratify=y, random_state=seed)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=seed)
    records = []
    feature_importance = []

    for name, estimator in _available_classifiers(seed, len(class_names)).items():
        if estimator is None:
            records.append({"model": name, "status": "not available", "accuracy": np.nan, "precision": np.nan, "recall": np.nan, "f1": np.nan, "roc_auc": np.nan, "cross_val_accuracy": np.nan, "training_time_seconds": np.nan})
            continue
        scale = name in {"Logistic Regression", "SVM"}
        model = _pipeline(estimator, scale)
        start = time.perf_counter()
        try:
            model.fit(x_train, y_train)
            elapsed = time.perf_counter() - start
            predictions = model.predict(x_test)
            probabilities = model.predict_proba(x_test) if hasattr(model, "predict_proba") else None
            y_test_binary = label_binarize(y_test, classes=np.arange(len(class_names)))
            roc_auc = (
                roc_auc_score(y_test_binary, probabilities, average="macro", multi_class="ovr")
                if probabilities is not None and y_test_binary.shape[1] > 1
                else np.nan
            )
            cv_scores = cross_val_score(clone(model), x, y, cv=cv, scoring="accuracy")
            records.append(
                {
                    "model": name,
                    "status": "trained",
                    "accuracy": accuracy_score(y_test, predictions),
                    "precision": precision_score(y_test, predictions, average="macro", zero_division=0),
                    "recall": recall_score(y_test, predictions, average="macro", zero_division=0),
                    "f1": f1_score(y_test, predictions, average="macro", zero_division=0),
                    "roc_auc": roc_auc,
                    "cross_val_accuracy": float(np.mean(cv_scores)),
                    "training_time_seconds": elapsed,
                }
            )
            if name == "Random Forest":
                fitted_forest = model.named_steps["model"]
                for feature, importance in zip(NUMERIC_FEATURES, fitted_forest.feature_importances_[: len(NUMERIC_FEATURES)]):
                    feature_importance.append({"feature": feature, "importance": importance})
        except Exception as exc:
            records.append({"model": name, "status": f"failed: {exc.__class__.__name__}", "accuracy": np.nan, "precision": np.nan, "recall": np.nan, "f1": np.nan, "roc_auc": np.nan, "cross_val_accuracy": np.nan, "training_time_seconds": np.nan})

    tuning_grid = {"model__n_estimators": [120, 250], "model__max_depth": [None, 6, 10]}
    tuned_model = GridSearchCV(
        _pipeline(RandomForestClassifier(random_state=seed, class_weight="balanced")),
        tuning_grid,
        cv=cv,
        scoring="f1_macro",
        n_jobs=-1,
    )
    tuned_model.fit(x, y)
    tuning = pd.DataFrame(
        [
            {
                "model": "Random Forest",
                "best_params": str(tuned_model.best_params_),
                "best_cv_f1_macro": tuned_model.best_score_,
            }
        ]
    )

    return pd.DataFrame(records), pd.DataFrame(feature_importance).sort_values("importance", ascending=False), tuning


def train_regression_models(features: pd.DataFrame, seed: int) -> pd.DataFrame:
    x = features[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = features[TARGET_COLUMNS]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=seed)
    records = []

    for name, estimator in _available_regressors(seed).items():
        if estimator is None:
            records.append({"model": name, "status": "not available", "rmse": np.nan, "mae": np.nan, "r2": np.nan, "training_time_seconds": np.nan})
            continue
        model = _pipeline(estimator, name == "Linear Regression")
        start = time.perf_counter()
        try:
            model.fit(x_train, y_train)
            elapsed = time.perf_counter() - start
            predictions = model.predict(x_test)
            records.append(
                {
                    "model": name,
                    "status": "trained",
                    "rmse": float(np.sqrt(mean_squared_error(y_test, predictions))),
                    "mae": mean_absolute_error(y_test, predictions),
                    "r2": r2_score(y_test, predictions, multioutput="uniform_average"),
                    "training_time_seconds": elapsed,
                }
            )
        except Exception as exc:
            records.append({"model": name, "status": f"failed: {exc.__class__.__name__}", "rmse": np.nan, "mae": np.nan, "r2": np.nan, "training_time_seconds": np.nan})
    return pd.DataFrame(records)


def run_clustering(features: pd.DataFrame, seed: int) -> Tuple[pd.DataFrame, pd.DataFrame]:
    x = features[NUMERIC_FEATURES]
    x_scaled = StandardScaler().fit_transform(SimpleImputer(strategy="median").fit_transform(x))
    algorithms = {
        "K-Means": KMeans(n_clusters=5, random_state=seed, n_init=20),
        "Hierarchical Clustering": AgglomerativeClustering(n_clusters=5),
        "DBSCAN": DBSCAN(eps=4.7, min_samples=4),
    }
    records = []
    assignments = pd.DataFrame({"learner_id": features["learner_id"], "learner_archetype": features["learner_archetype"]})
    for name, model in algorithms.items():
        labels = model.fit_predict(x_scaled)
        assignments[name.lower().replace(" ", "_").replace("-", "")] = labels
        cluster_count = len(set(labels) - {-1})
        if cluster_count > 1:
            sil = silhouette_score(x_scaled, labels)
            dbi = davies_bouldin_score(x_scaled, labels)
        else:
            sil = np.nan
            dbi = np.nan
        records.append({"model": name, "cluster_count": cluster_count, "silhouette_score": sil, "davies_bouldin_index": dbi})
    return pd.DataFrame(records), assignments
