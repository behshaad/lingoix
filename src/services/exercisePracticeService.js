import { apiClient } from "./apiClient";

const errorTypesBySkill = {
  "vocabulary-recall": "vocabulary recall error",
  "grammar-accuracy": "grammar tense error",
  "listening-comprehension": "listening misrecognition",
  "writing-quality": "spelling error",
  "translation-direction": "translation direction error",
};

export const loadPracticeExercises = async (skillArea) => {
  const data = await apiClient.exercises();
  return data.exercises
    .filter((exercise) => !skillArea || exercise.skillArea === skillArea)
    .sort((a, b) => a.sequence - b.sequence || a.id.localeCompare(b.id));
};

export const exerciseTitle = (exercise, t) =>
  t(`exerciseTemplates.${exercise.titleKey}`, {
    number: exercise.sequence,
    defaultValue: exercise.title,
  });

export const exercisePrompt = (exercise, t) =>
  exercise.prompt || exerciseTitle(exercise, t);

export const exerciseExpectedAnswer = (exercise) =>
  exercise.expectedAnswer || "Complete the exercise and mark the result honestly.";

export const exerciseSupportText = (exercise) =>
  exercise.supportText || `${exercise.cefrLevel} · ${exercise.subskill}`;

export const errorTypeForExercise = (exercise) =>
  errorTypesBySkill[exercise.skillArea] || "vocabulary recall error";
