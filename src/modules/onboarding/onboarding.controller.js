import { getCourseCatalog } from "../../utils/demo-data.js";
import { getLatestPlacementAttempt, getPlacementAttempts, savePlacementAttempt } from "./onboarding.repository.js";

const scoreMap = {
  grammar: {
    high: 3,
    medium: 2,
    low: 1
  },
  vocabulary: {
    high: 3,
    medium: 2,
    low: 1
  },
  reading: {
    high: 3,
    medium: 2,
    low: 1
  },
  goal: {
    "4_plus": 2,
    "2_3": 1,
    "1": 0
  }
};

function buildPlacementAnalysis(answers) {
  const [grammar, vocabulary, reading, goal] = Array.isArray(answers) ? answers : [];
  const weightedScore =
    (scoreMap.grammar[grammar] ?? 1) * 3 +
    (scoreMap.vocabulary[vocabulary] ?? 1) * 3 +
    (scoreMap.reading[reading] ?? 1) * 3 +
    (scoreMap.goal[goal] ?? 0);
  const score = Math.round((weightedScore / 29) * 100);
  const recommendedLevel = weightedScore >= 20 ? "A2" : "A1";
  const recommendedCourse = getCourseCatalog().find((course) => course.level === recommendedLevel) ?? getCourseCatalog()[0];
  const focusAreas = [];

  if (grammar === "low") {
    focusAreas.push("Rebuild simple present patterns and sentence order.");
  }

  if (vocabulary === "low") {
    focusAreas.push("Expand high-frequency everyday vocabulary before moving faster.");
  }

  if (reading === "low") {
    focusAreas.push("Use short guided reading blocks with comprehension support.");
  }

  if (focusAreas.length === 0) {
    focusAreas.push("Keep building routine fluency with short quizzes and lesson replay.");
  }

  return {
    score,
    recommendedLevel,
    recommendedCourse: recommendedCourse
      ? {
          id: recommendedCourse.id,
          title: recommendedCourse.title,
          summary: recommendedCourse.summary
        }
      : null,
    confidenceLabel: weightedScore >= 24 ? "Strong match" : weightedScore >= 18 ? "Good starting point" : "Foundation-first path",
    focusAreas
  };
}

export async function submitPlacementTest(req, res, next) {
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  const analysis = buildPlacementAnalysis(answers);

  try {
    if (req.user?.id) {
      await savePlacementAttempt(req.user.id, analysis.score, analysis.recommendedLevel);
    }

    return res.json(analysis);
  } catch (error) {
    return next(error);
  }
}

export async function getRecommendation(req, res, next) {
  try {
    const latestAttempt = req.user?.id ? await getLatestPlacementAttempt(req.user.id) : null;
    const recommendedLevel = latestAttempt?.recommendedLevel ?? "A2";
    const score = latestAttempt?.score ?? null;
    const recommendedCourse = getCourseCatalog().find((course) => course.level === recommendedLevel) ?? getCourseCatalog()[0];

    return res.json({
      recommendedLevel,
      score,
      recommendedCourse: recommendedCourse
        ? {
            id: recommendedCourse.id,
            title: recommendedCourse.title,
            summary: recommendedCourse.summary
          }
        : null,
      hasCompletedPlacement: Boolean(latestAttempt),
      summary:
        recommendedLevel === "A1"
          ? "Start with foundation vocabulary, short grammar loops, and simple speaking prompts."
          : "The learner should begin with everyday communication topics and routine-based grammar."
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPlacementHistory(req, res, next) {
  try {
    const attempts = req.user?.id ? await getPlacementAttempts(req.user.id, 6) : [];
    const latestAttempt = attempts[0] ?? null;
    const previousAttempt = attempts[1] ?? null;

    return res.json({
      attempts,
      latestAttempt,
      trend:
        latestAttempt && previousAttempt
          ? latestAttempt.score - previousAttempt.score
          : null
    });
  } catch (error) {
    return next(error);
  }
}
