import { buildLearnerPath, buildQuiz, resolveQuizSlugFromPersistedId } from "../../utils/demo-data.js";
import { getGrammarTopicForLesson } from "../../utils/grammar-library.js";
import { getLatestPlacementAttempt } from "../onboarding/onboarding.repository.js";
import { getCompletedLessonSlugs, getRecentQuizAttempts } from "../progress/progress.repository.js";

function parseAnswers(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function createReviewItem(quiz, question, category, note, itemKey) {
  const correctOption = question.options.find((option) => option.isCorrect);
  const grammarTopic = quiz.lessonId ? getGrammarTopicForLesson(quiz.lessonId) : null;

  return {
    id: itemKey,
    category,
    note,
    prompt: question.prompt,
    quizId: quiz.id,
    lessonId: quiz.lessonId,
    lessonTitle: quiz.lessonTitle,
    grammarTopic,
    answerId: correctOption?.id ?? null,
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text
    }))
  };
}

function summarizeGrammarTopics(items) {
  const topicMap = new Map();

  for (const item of items) {
    if (item.grammarTopic && !topicMap.has(item.grammarTopic.id)) {
      topicMap.set(item.grammarTopic.id, item.grammarTopic);
    }
  }

  return Array.from(topicMap.values());
}

function buildItemsFromAttempts(attempts) {
  return attempts.flatMap((attempt) => {
    const quizSlug = resolveQuizSlugFromPersistedId(attempt.quiz_id);

    if (!quizSlug) {
      return [];
    }

    const quiz = buildQuiz(quizSlug);
    const selectedByQuestion = new Map(parseAnswers(attempt.answers_json).map((answer) => [answer.questionId, answer.optionId]));

    return quiz.questions.flatMap((question) => {
      const correctOption = question.options.find((option) => option.isCorrect);
      const selectedOptionId = selectedByQuestion.get(question.id);

      if (!correctOption || !selectedOptionId || selectedOptionId === correctOption.id) {
        return [];
      }

      return [
        createReviewItem(
          quiz,
          question,
          "Mistakes",
          `Retry from ${quiz.lessonTitle ?? quiz.title}`,
          `mistake-${attempt.id}-${question.id}`
        )
      ];
    });
  });
}

function buildStarterItems(levelCode, completedLessonSlugs) {
  const learnerPath = buildLearnerPath(levelCode, completedLessonSlugs);

  if (!learnerPath.nextLesson?.quizId) {
    return [];
  }

  const quiz = buildQuiz(learnerPath.nextLesson.quizId);

  return quiz.questions.slice(0, 3).map((question) =>
    createReviewItem(quiz, question, "Warm-up", `Practice before ${quiz.lessonTitle ?? "the next lesson"}`, `starter-${question.id}`)
  );
}

function summarizeCategories(items) {
  const counts = items.reduce((summary, item) => {
    summary[item.category] = (summary[item.category] ?? 0) + 1;
    return summary;
  }, {});

  return Object.entries(counts).map(([id, count]) => ({
    id: id.toLowerCase().replace(/\s+/g, "-"),
    title: id,
    count
  }));
}

export async function buildReviewPayload(userId) {
  const latestPlacement = await getLatestPlacementAttempt(userId);
  const completedLessonSlugs = await getCompletedLessonSlugs(userId);
  const recentAttempts = await getRecentQuizAttempts(userId, 5);
  const mistakeItems = buildItemsFromAttempts(recentAttempts);
  const items = mistakeItems.length > 0 ? mistakeItems.slice(0, 6) : buildStarterItems(latestPlacement?.recommendedLevel ?? "A2", completedLessonSlugs);

  return {
    dueCount: items.length,
    source: mistakeItems.length > 0 ? "recent-mistakes" : "starter-review",
    categories: summarizeCategories(items),
    grammarTopics: summarizeGrammarTopics(items),
    items: items.map(({ answerId, ...item }) => item),
    answerKey: new Map(items.map((item) => [item.id, item.answerId]))
  };
}

export async function scoreReviewSession(userId, answers) {
  const review = await buildReviewPayload(userId);
  const selectedByItem = new Map((Array.isArray(answers) ? answers : []).map((answer) => [answer.itemId, answer.optionId]));

  let correctAnswers = 0;

  for (const [itemId, answerId] of review.answerKey.entries()) {
    if (selectedByItem.get(itemId) === answerId) {
      correctAnswers += 1;
    }
  }

  const totalQuestions = review.answerKey.size;

  return {
    correctAnswers,
    totalQuestions,
    score: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
    reviewDueCount: review.dueCount,
    submittedAt: new Date().toISOString()
  };
}
