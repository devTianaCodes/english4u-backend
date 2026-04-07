import { buildQuiz, resolvePersistedQuizId, scoreQuizSubmission } from "../../utils/demo-data.js";
import { getProgressSnapshot, isSeedPersistenceError, saveQuizAttempt } from "../progress/progress.repository.js";

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

export async function submitQuiz(req, res, next) {
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  const result = scoreQuizSubmission(req.params.quizId, answers);
  const quiz = buildQuiz(req.params.quizId);

  try {
    const persistedQuizId = resolvePersistedQuizId(req.params.quizId);
    let streak = null;
    let snapshot = null;

    if (persistedQuizId) {
      try {
        streak = await saveQuizAttempt(req.user.id, persistedQuizId, result.score, answers);
        snapshot = await getProgressSnapshot(req.user.id);
      } catch (error) {
        if (!isSeedPersistenceError(error)) {
          throw error;
        }
      }
    }

    return res.json({
      quizId: req.params.quizId,
      lessonId: quiz.lessonId,
      courseId: quiz.courseId,
      courseTitle: quiz.courseTitle,
      nextLesson: quiz.nextLesson,
      ...result,
      streak: streak?.currentStreak ?? null,
      quizAverage: snapshot?.quizAverage ?? result.score,
      submittedAt: new Date().toISOString()
    });
  } catch (error) {
    return next(error);
  }
}
