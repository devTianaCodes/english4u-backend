export function submitPlacementTest(req, res) {
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  const score = answers.length * 10;
  const recommendedLevel = score >= 30 ? "A2" : "A1";

  res.json({
    score,
    recommendedLevel
  });
}

export function getRecommendation(_req, res) {
  res.json({
    recommendedLevel: "A2",
    summary: "The learner should begin with everyday communication topics and routine-based grammar."
  });
}
