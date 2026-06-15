import {
  classCatalog,
  exerciseBank,
  germanVerbBank,
  learners,
  resources,
  skillAreas,
} from "../data/learningData";

const byId = (items, id) => items.find((item) => item.id === id);

export const getLearners = () => learners;

export const getLearnerById = (learnerId) => byId(learners, learnerId) || learners[0];

export const getResources = () => resources;

export const getExerciseBank = () => exerciseBank;

export const getGermanVerbBank = () => germanVerbBank;

export const getClassCatalog = () => classCatalog;

export const getSkillAreas = () => skillAreas;

export const getExercisesByIds = (exerciseIds) =>
  exerciseIds.map((exerciseId) => byId(exerciseBank, exerciseId)).filter(Boolean);

export const getLearnerDetailReport = (learnerId) => {
  const learner = getLearnerById(learnerId);
  const events = learner.learningEvents;
  const decisions = learner.adaptiveDecisions.map((decision) => ({
    ...decision,
    targetedExercises: getExercisesByIds(decision.targetedExerciseIds),
  }));
  const latestEvents = [...events]
    .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt))
    .slice(0, 8);

  return {
    learner,
    latestEvents,
    decisions,
    weaknessCount: learner.skillWeaknesses.length,
    eventCount: events.length,
    correctEvents: events.filter((event) => event.correct).length,
    incorrectEvents: events.filter((event) => !event.correct).length,
  };
};

export const getClassReport = (classId) => {
  const classInfo = byId(classCatalog, classId) || classCatalog[0];
  const students = learners.filter((learner) => learner.classId === classInfo.id);
  const average = (selector) =>
    Math.round(students.reduce((sum, learner) => sum + selector(learner), 0) / students.length);

  return {
    classInfo,
    students,
    studentCount: students.length,
    averageProgress: average((learner) => learner.progressPercent),
    averageAccuracy: average((learner) => learner.accuracy),
    averageResponseMs: average((learner) => learner.averageResponseMs),
  };
};

export const getPlatformReport = () => {
  const allEvents = learners.flatMap((learner) => learner.learningEvents);
  const allWeaknesses = learners.flatMap((learner) => learner.skillWeaknesses);
  const allDecisions = learners.flatMap((learner) => learner.adaptiveDecisions);
  const errorCounts = allEvents.reduce((counts, event) => {
    if (!event.errorType) return counts;
    counts[event.errorType] = (counts[event.errorType] || 0) + 1;
    return counts;
  }, {});
  const weaknessCounts = allWeaknesses.reduce((counts, weakness) => {
    counts[weakness.skillArea] = (counts[weakness.skillArea] || 0) + 1;
    return counts;
  }, {});
  const resourceUsage = resources.map((resource) => {
    const linkedExercises = exerciseBank.filter((exercise) => exercise.resourceId === resource.id);
    return {
      ...resource,
      exerciseCount: linkedExercises.length,
      eventCount: allEvents.filter((event) =>
        linkedExercises.some((exercise) => exercise.id === event.exerciseId)
      ).length,
    };
  });

  return {
    learnerCount: learners.length,
    classCount: classCatalog.length,
    resourceCount: resources.length,
    exerciseCount: exerciseBank.length,
    eventCount: allEvents.length,
    adaptiveDecisionCount: allDecisions.length,
    averageAccuracy: Math.round(
      learners.reduce((sum, learner) => sum + learner.accuracy, 0) / learners.length
    ),
    averageProgress: Math.round(
      learners.reduce((sum, learner) => sum + learner.progressPercent, 0) / learners.length
    ),
    commonErrorPatterns: Object.entries(errorCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    weaknessDistribution: Object.entries(weaknessCounts)
      .map(([skillArea, count]) => ({
        skillArea,
        label: skillAreas.find((skill) => skill.id === skillArea)?.label || skillArea,
        count,
      }))
      .sort((a, b) => b.count - a.count),
    resourceUsage,
  };
};
