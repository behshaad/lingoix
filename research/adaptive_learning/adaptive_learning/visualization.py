from __future__ import annotations

import pandas as pd
import seaborn as sns
import matplotlib

matplotlib.use("Agg")
from matplotlib import pyplot as plt
from sklearn.decomposition import PCA
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

from .config import FIGURE_DIR
from .models import NUMERIC_FEATURES


def _save(fig, name: str) -> None:
    FIGURE_DIR.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(FIGURE_DIR / name, dpi=180)
    plt.close(fig)


def create_visualizations(learners: pd.DataFrame, interactions: pd.DataFrame, features: pd.DataFrame, clusters: pd.DataFrame) -> None:
    sns.set_theme(style="whitegrid")

    fig, ax = plt.subplots(figsize=(9, 5))
    sns.histplot(features["mastery_score"], kde=True, ax=ax, color="#2f7d6d")
    ax.set_title("Distribution of Simulated Mastery Proxy")
    _save(fig, "mastery_histogram.png")

    fig, ax = plt.subplots(figsize=(10, 5))
    sns.boxplot(data=features, x="weakness_category", y="error_rate", ax=ax, color="#d9a441")
    ax.tick_params(axis="x", rotation=25)
    ax.set_title("Error Rate by Weakness Category")
    _save(fig, "error_rate_boxplot.png")

    numeric = features[NUMERIC_FEATURES].corr(numeric_only=True)
    fig, ax = plt.subplots(figsize=(12, 10))
    sns.heatmap(numeric, cmap="vlag", center=0, ax=ax)
    ax.set_title("Feature Correlation Heatmap")
    _save(fig, "correlation_heatmap.png")

    session_trend = interactions.groupby(["session_number", "question_type"], as_index=False)["correct_or_incorrect"].mean()
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.lineplot(data=session_trend, x="session_number", y="correct_or_incorrect", hue="question_type", ax=ax)
    ax.set_title("Learning Trend by Question Type")
    ax.set_ylabel("Mean Accuracy")
    _save(fig, "learning_trend.png")

    x = StandardScaler().fit_transform(SimpleImputer(strategy="median").fit_transform(features[NUMERIC_FEATURES]))
    points = PCA(n_components=2, random_state=42).fit_transform(x)
    plot_df = pd.DataFrame({"pc1": points[:, 0], "pc2": points[:, 1], "cluster": clusters["kmeans"], "archetype": learners["learner_archetype"]})
    fig, ax = plt.subplots(figsize=(9, 6))
    sns.scatterplot(data=plot_df, x="pc1", y="pc2", hue="cluster", style="archetype", ax=ax, s=70)
    ax.set_title("K-Means Clusters Projected with PCA")
    _save(fig, "cluster_pca.png")
