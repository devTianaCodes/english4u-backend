export function submitQuiz(req, res) {
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

  res.json({
    quizId: req.params.quizId,
    score: answers.length * 20,
    submittedAt: new Date().toISOString()
  });
}
