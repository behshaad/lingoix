# Adaptive Language Learning Research Prototype Report

## Abstract

This report presents a reproducible synthetic-data research simulation for adaptive language learning. The experiment generated 100 virtual learners and 34837 learner interactions for German-learning scenarios, engineered learner-level behavioral features, trained machine-learning models, produced adaptive decisions, and compared simulated adaptive outcomes against a traditional non-adaptive baseline.

The dataset is synthetic. Results demonstrate whether the pipeline can recover injected patterns under controlled assumptions; they do not prove real-world educational effectiveness.

## Research Questions

1. **How can learner interactions be transformed into machine learning features?**  
   Timestamped learning events were aggregated into response-time, error, retry, hint, retention, consistency, progression, and learning-efficiency features. These features convert raw event histories into learner-level model inputs.

2. **Which ML model best identifies learner weaknesses?**  
   The best completed classifier in this run was CatBoost (f1=0.9227). Selection is based on macro F1 because weakness categories may be imbalanced.

3. **How much improvement can adaptive learning provide compared to a non-adaptive baseline?**  
   In the simulation, adaptive learning produced higher mean outcomes across mastery growth, learning speed, error reduction, and engagement. The paired tests were statistically significant across all tracked metrics at alpha=0.05.

## Dataset Characteristics

- Learners: 100
- Interactions per learner: 202 to 486
- Question types: vocabulary, grammar, reading, listening
- CEFR levels: A1, A2, B1, B2
- Seed: 42

### Archetype Distribution

| learner_archetype   |   count |
|:--------------------|--------:|
| vocabulary_weak     |      20 |
| grammar_weak        |      16 |
| plateau_learner     |      14 |
| balanced_learner    |      14 |
| listening_weak      |      11 |
| reading_weak        |      10 |
| fast_improver       |       8 |
| slow_learner        |       7 |

### Weakness Distribution

| weakness_category   |   count |
|:--------------------|--------:|
| vocabulary_weakness |      29 |
| balanced_learner    |      20 |
| grammar_weakness    |      18 |
| listening_weakness  |      18 |
| reading_weakness    |      15 |

### Error Frequency by Question Type

| question_type   |   error_rate |
|:----------------|-------------:|
| grammar         |       0.5699 |
| listening       |       0.5486 |
| reading         |       0.5586 |
| vocabulary      |       0.5996 |

## Synthetic Design vs Discovered Results

The generator assigns hidden learner archetypes and weakness categories before simulating interactions. These generated labels are the controlled ground truth. Model and clustering outputs are treated as discovered results only when derived from engineered behavioral features.

## Feature Engineering

- `mean_response_time` = sum(response_time_i) / n
- `median_response_time` = median(response_time_i)
- `error_frequency` = sum(1 - correct_i)
- `retry_frequency` = count(attempt_count_i > 1) / n
- `hint_usage_rate` = sum(hint_requested_i) / n
- `progression_score` = 100 * (0.65 * improvement_trend + 0.35 * mean_recent_difficulty / 4)
- `consistency_score` = max(0, 1 - std(session_accuracy))
- `error_repetition_score` = repeated_mistakes / max(total_errors, 1)
- `improvement_velocity` = slope of session_accuracy over chronological sessions
- `learning_efficiency_index` = 100 * accuracy / ((mean_response_time / 60) * (1 + retry_frequency + hint_usage_rate))
- `retention_score` = accuracy on the latest attempt for each repeated question_id
- `mastery_score` = 100 * (0.45 * recent_accuracy + 0.25 * retention + 0.20 * consistency + 0.10 * response_efficiency)

## Classification Results

Target: learner weakness category (`vocabulary_weakness`, `grammar_weakness`, `reading_weakness`, `listening_weakness`, `balanced_learner`).

| model               | status        |   accuracy |   precision |   recall |     f1 |   roc_auc |   cross_val_accuracy |   training_time_seconds |
|:--------------------|:--------------|-----------:|------------:|---------:|-------:|----------:|---------------------:|------------------------:|
| Random Forest       | trained       |       0.92 |      0.9267 |   0.9214 | 0.9156 |    0.9738 |                 0.78 |                  0.1297 |
| Logistic Regression | trained       |       0.92 |      0.9333 |   0.9    | 0.897  |    0.9881 |                 0.81 |                  0.0082 |
| SVM                 | trained       |       0.84 |      0.885  |   0.8429 | 0.8316 |    0.9563 |                 0.76 |                  0.0056 |
| XGBoost             | not available |            |             |          |        |           |                      |                         |
| LightGBM            | not available |            |             |          |        |           |                      |                         |
| CatBoost            | trained       |       0.92 |      0.9429 |   0.9214 | 0.9227 |    0.9929 |                 0.78 |                  0.1289 |

### Hyperparameter Tuning

| model         | best_params                                         |   best_cv_f1_macro |
|:--------------|:----------------------------------------------------|-------------------:|
| Random Forest | {'model__max_depth': 6, 'model__n_estimators': 250} |             0.7905 |

### Feature Importance

| feature                       |   importance |
|:------------------------------|-------------:|
| grammar_error_rate            |       0.0987 |
| reading_error_rate            |       0.087  |
| vocabulary_error_rate         |       0.072  |
| median_response_time          |       0.0702 |
| mean_response_time            |       0.0545 |
| hint_usage_rate               |       0.0472 |
| listening_error_rate          |       0.0458 |
| vocabulary_mean_response_time |       0.038  |
| learning_efficiency_index     |       0.0344 |
| error_frequency               |       0.0342 |
| reading_mean_response_time    |       0.0331 |
| retry_frequency               |       0.0327 |
| grammar_mean_response_time    |       0.032  |
| listening_mean_response_time  |       0.031  |
| retention_score               |       0.0299 |

## Regression Results

Targets: future mastery score, future performance score, and probability of success in the next session.

| model                   | status        |   rmse |    mae |     r2 |   training_time_seconds |
|:------------------------|:--------------|-------:|-------:|-------:|------------------------:|
| Random Forest Regressor | trained       | 2.236  | 1.4838 | 0.9549 |                  0.1517 |
| Linear Regression       | trained       | 1.1464 | 0.7127 | 0.9893 |                  0.0041 |
| XGBoost Regressor       | not available |        |        |        |                         |
| LightGBM Regressor      | not available |        |        |        |                         |

Best regressor: Linear Regression (rmse=1.1464).

## Clustering Results

| model                   |   cluster_count |   silhouette_score |   davies_bouldin_index |
|:------------------------|----------------:|-------------------:|-----------------------:|
| K-Means                 |               5 |             0.1623 |                 1.6966 |
| Hierarchical Clustering |               5 |             0.1307 |                 1.8697 |
| DBSCAN                  |               1 |                    |                        |

Best clustering method: K-Means (silhouette=0.1623). Cluster interpretation is based on mean skill error rates, response times, retries, hints, and overlap with hidden archetypes.

## Adaptive Recommendation Engine

The recommendation engine is framed as Lingoix Adaptive Decisions. The rule-based version uses explicit thresholds over recent errors, mastery proxy, hint use, and retries. The ML-based version uses predicted weakness and an adaptive-risk score.

### Rule-Based Adaptive Decision Example

| learner_id   | engine     | target_skill   | recommended_difficulty   | targeted_exercise_type                | review_content                                               | next_learning_path_step                                                          | decision_evidence                                               |
|:-------------|:-----------|:---------------|:-------------------------|:--------------------------------------|:-------------------------------------------------------------|:---------------------------------------------------------------------------------|:----------------------------------------------------------------|
| L001         | rule_based | reading        | easy                     | short passage with targeted questions | Review German reading items connected to repeated errors.    | Insert short passage with targeted questions before the next mixed-skill lesson. | error_rate=0.59; reading_error_rate=0.67; mastery_score=51.5    |
| L002         | rule_based | grammar        | easy                     | guided grammar drill                  | Review German grammar items connected to repeated errors.    | Insert guided grammar drill before the next mixed-skill lesson.                  | error_rate=0.64; grammar_error_rate=0.82; mastery_score=48.0    |
| L003         | rule_based | vocabulary     | medium                   | spaced flashcard review               | Review German vocabulary items connected to repeated errors. | Insert spaced flashcard review before the next mixed-skill lesson.               | error_rate=0.35; vocabulary_error_rate=0.37; mastery_score=62.4 |
| L004         | rule_based | reading        | easy                     | short passage with targeted questions | Review German reading items connected to repeated errors.    | Insert short passage with targeted questions before the next mixed-skill lesson. | error_rate=0.81; reading_error_rate=0.96; mastery_score=34.7    |
| L005         | rule_based | vocabulary     | easy                     | spaced flashcard review               | Review German vocabulary items connected to repeated errors. | Insert spaced flashcard review before the next mixed-skill lesson.               | error_rate=0.45; vocabulary_error_rate=0.55; mastery_score=60.2 |

### ML-Based Adaptive Decision Example

| learner_id   | engine   | target_skill   | recommended_difficulty   | targeted_exercise_type                 | review_content                                                                                            | next_learning_path_step                                      | decision_evidence                                                                       |
|:-------------|:---------|:---------------|:-------------------------|:---------------------------------------|:----------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------|:----------------------------------------------------------------------------------------|
| L001         | ml_based | reading        | easy                     | model-selected reading intervention    | Prioritize high-importance features for reading: recent errors, hint use, retries, and response speed.    | Adapt next session toward reading with difficulty=easy.      | predicted_weakness=reading_weakness; adaptive_risk=0.51; improvement_velocity=-0.003    |
| L002         | ml_based | grammar        | easy                     | model-selected grammar intervention    | Prioritize high-importance features for grammar: recent errors, hint use, retries, and response speed.    | Adapt next session toward grammar with difficulty=easy.      | predicted_weakness=grammar_weakness; adaptive_risk=0.57; improvement_velocity=-0.006    |
| L003         | ml_based | vocabulary     | medium                   | model-selected vocabulary intervention | Prioritize high-importance features for vocabulary: recent errors, hint use, retries, and response speed. | Adapt next session toward vocabulary with difficulty=medium. | predicted_weakness=balanced_learner; adaptive_risk=0.39; improvement_velocity=-0.008    |
| L004         | ml_based | reading        | easy                     | model-selected reading intervention    | Prioritize high-importance features for reading: recent errors, hint use, retries, and response speed.    | Adapt next session toward reading with difficulty=easy.      | predicted_weakness=reading_weakness; adaptive_risk=0.66; improvement_velocity=-0.005    |
| L005         | ml_based | vocabulary     | medium                   | model-selected vocabulary intervention | Prioritize high-importance features for vocabulary: recent errors, hint use, retries, and response speed. | Adapt next session toward vocabulary with difficulty=medium. | predicted_weakness=vocabulary_weakness; adaptive_risk=0.44; improvement_velocity=-0.006 |

The rule-based engine is more interpretable and easier to audit. The ML-based engine is more scalable because it can use richer feature interactions, but its reliability depends on model quality and requires clearer evidence presentation.

## Adaptive vs Traditional Baseline

| metric          |   adaptive_mean |   traditional_mean |   mean_difference |   t_statistic |   p_value |   cohens_d_paired | significant_at_0_05   |
|:----------------|----------------:|-------------------:|------------------:|--------------:|----------:|------------------:|:----------------------|
| mastery_growth  |         13.6713 |             3.0351 |           10.6362 |       30.8899 |         0 |            3.089  | True                  |
| learning_speed  |          0.0192 |             0.0101 |            0.0092 |       18.9619 |         0 |            1.8962 | True                  |
| error_reduction |          0.3079 |             0.1378 |            0.1701 |       47.1133 |         0 |            4.7113 | True                  |
| engagement      |          0.9985 |             0.9678 |            0.0306 |        6.639  |         0 |            0.6639 | True                  |

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
| Classification | CatBoost | Macro F1 based | See table | Medium to high with feature importance | High |
| Regression | Linear Regression | RMSE based | See table | Medium | High |
| Clustering | K-Means | Silhouette based | Fast at this size | Medium | Medium |
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
