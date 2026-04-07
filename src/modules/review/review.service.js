import { buildLearnerPath, buildLesson, buildQuiz, resolveQuizSlugFromPersistedId } from "../../utils/demo-data.js";
import { getGrammarTopicById, getGrammarTopicForLesson } from "../../utils/grammar-library.js";
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

function createStandaloneReviewItem({ id, category, note, prompt, options, lessonId, lessonTitle }) {
  return {
    id,
    category,
    note,
    prompt,
    quizId: null,
    lessonId,
    lessonTitle,
    grammarTopic: lessonId ? getGrammarTopicForLesson(lessonId) : null,
    answerId: options.find((option) => option.isCorrect)?.id ?? null,
    options: options.map((option) => ({
      id: option.id,
      text: option.text
    }))
  };
}

function parseVocabularyTerms(lesson) {
  const vocabularyBlocks = (lesson.blocks ?? []).filter((block) => block.type === "vocabulary");

  return vocabularyBlocks.flatMap((block) =>
    block.content
      .split(",")
      .map((term) => term.trim())
      .filter(Boolean)
      .slice(0, 5)
  );
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

function buildGrammarItems(levelCode, completedLessonSlugs) {
  const learnerPath = buildLearnerPath(levelCode, completedLessonSlugs);
  const relatedLessonIds = new Set();

  if (learnerPath.nextLesson?.id) {
    const nextGrammarTopic = getGrammarTopicForLesson(learnerPath.nextLesson.id);
    const topic = nextGrammarTopic ? getGrammarTopicById(nextGrammarTopic.id) : null;

    for (const lessonId of topic?.relatedLessonIds ?? []) {
      relatedLessonIds.add(lessonId);
    }
  }

  if (relatedLessonIds.size === 0 && learnerPath.nextLesson?.id) {
    relatedLessonIds.add(learnerPath.nextLesson.id);
  }

  return Array.from(relatedLessonIds)
    .slice(0, 3)
    .flatMap((lessonId) => {
      const quiz = buildQuiz(`${lessonId}-quiz`);
      const grammarTopic = getGrammarTopicForLesson(lessonId);

      return quiz.questions.slice(0, 1).map((question) => {
        const item = createReviewItem(
          quiz,
          question,
          "Grammar",
          `Grammar focus: ${grammarTopic?.title ?? quiz.lessonTitle ?? quiz.title}`,
          `grammar-${lessonId}-${question.id}`
        );

        return {
          ...item,
          grammarTopic: grammarTopic ?? item.grammarTopic
        };
      });
    });
}

function buildVocabularyItems(levelCode, completedLessonSlugs) {
  const learnerPath = buildLearnerPath(levelCode, completedLessonSlugs);
  const sourceLessonIds = [
    learnerPath.nextLesson?.id,
    ...completedLessonSlugs.slice(-2).reverse()
  ].filter(Boolean);

  if (sourceLessonIds.length === 0) {
    return [];
  }

  const lessons = sourceLessonIds.map((lessonId) => buildLesson(lessonId));
  const globalTermPool = lessons.flatMap((lesson) => parseVocabularyTerms(lesson));

  return lessons.flatMap((lesson) => {
    const terms = parseVocabularyTerms(lesson);

    return terms.slice(0, 2).map((term, index) => {
      const distractors = globalTermPool.filter((candidate) => candidate !== term).slice(index, index + 2);
      const fallbackDistractors = ["usually", "schedule", "weekend"].filter((candidate) => candidate !== term);
      const optionTerms = [term, ...distractors, ...fallbackDistractors].slice(0, 3);

      return createStandaloneReviewItem({
        id: `vocabulary-${lesson.id}-${index + 1}`,
        category: "Words",
        note: `Recall key vocabulary from ${lesson.title}`,
        prompt: `Which word belongs to the vocabulary set for "${lesson.title}"?`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        options: optionTerms.map((optionTerm, optionIndex) => ({
          id: `vocabulary-${lesson.id}-${index + 1}-option-${optionIndex + 1}`,
          text: optionTerm,
          isCorrect: optionTerm === term
        }))
      });
    });
  });
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

function pickItemsForMode(mode, mistakeItems, starterItems, grammarItems, vocabularyItems) {
  if (mode === "mistakes") {
    return {
      source: "recent-mistakes",
      items: mistakeItems.slice(0, 6)
    };
  }

  if (mode === "warm-up") {
    return {
      source: "starter-review",
      items: starterItems.slice(0, 6)
    };
  }

  if (mode === "grammar") {
    return {
      source: "grammar-review",
      items: grammarItems.slice(0, 6)
    };
  }

  if (mode === "vocabulary") {
    return {
      source: "vocabulary-review",
      items: vocabularyItems.slice(0, 6)
    };
  }

  if (mistakeItems.length > 0) {
    return {
      source: "recent-mistakes",
      items: mistakeItems.slice(0, 6)
    };
  }

  return {
    source: vocabularyItems.length > 0 ? "vocabulary-review" : grammarItems.length > 0 ? "grammar-review" : "starter-review",
    items: vocabularyItems.length > 0 ? vocabularyItems.slice(0, 6) : grammarItems.length > 0 ? grammarItems.slice(0, 6) : starterItems.slice(0, 6)
  };
}

function buildModesSummary(mistakeItems, starterItems, grammarItems, vocabularyItems, activeMode) {
  return [
    {
      id: "mistakes",
      title: "Mistakes",
      count: mistakeItems.length,
      description: "Retry recent wrong quiz answers.",
      isActive: activeMode === "mistakes"
    },
    {
      id: "warm-up",
      title: "Warm-up",
      count: starterItems.length,
      description: "Short practice before the next lesson.",
      isActive: activeMode === "warm-up"
    },
    {
      id: "grammar",
      title: "Grammar",
      count: grammarItems.length,
      description: "Focused prompts tied to current grammar topics.",
      isActive: activeMode === "grammar"
    },
    {
      id: "vocabulary",
      title: "Words",
      count: vocabularyItems.length,
      description: "Recall key words from current and recent lessons.",
      isActive: activeMode === "vocabulary"
    }
  ];
}

export async function buildReviewPayload(userId, mode = "all") {
  const latestPlacement = await getLatestPlacementAttempt(userId);
  const completedLessonSlugs = await getCompletedLessonSlugs(userId);
  const recentAttempts = await getRecentQuizAttempts(userId, 5);
  const mistakeItems = buildItemsFromAttempts(recentAttempts);
  const starterItems = buildStarterItems(latestPlacement?.recommendedLevel ?? "A2", completedLessonSlugs);
  const grammarItems = buildGrammarItems(latestPlacement?.recommendedLevel ?? "A2", completedLessonSlugs);
  const vocabularyItems = buildVocabularyItems(latestPlacement?.recommendedLevel ?? "A2", completedLessonSlugs);
  const resolvedMode = ["mistakes", "warm-up", "grammar", "vocabulary"].includes(mode) ? mode : "all";
  const { source, items } = pickItemsForMode(resolvedMode, mistakeItems, starterItems, grammarItems, vocabularyItems);
  const activeMode = resolvedMode === "all"
    ? source === "recent-mistakes"
      ? "mistakes"
      : source === "vocabulary-review"
        ? "vocabulary"
        : source === "grammar-review"
          ? "grammar"
          : "warm-up"
    : resolvedMode;

  return {
    dueCount: items.length,
    source,
    activeMode,
    modes: buildModesSummary(mistakeItems, starterItems, grammarItems, vocabularyItems, activeMode),
    categories: summarizeCategories(items),
    grammarTopics: summarizeGrammarTopics(items),
    items: items.map(({ answerId, ...item }) => item),
    answerKey: new Map(items.map((item) => [item.id, item.answerId]))
  };
}

export async function scoreReviewSession(userId, answers, mode = "all") {
  const review = await buildReviewPayload(userId, mode);
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
    activeMode: review.activeMode,
    reviewDueCount: review.dueCount,
    submittedAt: new Date().toISOString()
  };
}
