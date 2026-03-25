import { getLatestPlacementAttempt, savePlacementAttempt } from "./onboarding.repository.js";

export async function submitPlacementTest(req, res, next) {
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  const score = answers.length * 10;
  const recommendedLevel = score >= 30 ? "A2" : "A1";

  try {
    if (req.user?.id) {
      await savePlacementAttempt(req.user.id, score, recommendedLevel);
    }

    return res.json({
      score,
      recommendedLevel
    });
  } catch (error) {
    return next(error);
  }
}

export async function getRecommendation(req, res, next) {
  try {
    const latestAttempt = req.user?.id ? await getLatestPlacementAttempt(req.user.id) : null;
    const recommendedLevel = latestAttempt?.recommendedLevel ?? "A2";
    const score = latestAttempt?.score ?? null;

    return res.json({
      recommendedLevel,
      score,
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
