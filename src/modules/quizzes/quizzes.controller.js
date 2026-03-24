import { buildQuiz, scoreQuizSubmission } from "../../utils/demo-data.js";

export function getQuiz(req, res) {
  const quiz = buildQuiz(req.params.quizId);

  res.json({
    ...quiz,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      type: question.type,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text
      }))
    }))
  });
}

export function submitQuiz(req, res) {
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  const result = scoreQuizSubmission(req.params.quizId, answers);

  res.json({
    quizId: req.params.quizId,
    ...result,
    submittedAt: new Date().toISOString()
  });
}
