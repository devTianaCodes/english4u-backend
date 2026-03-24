export const courseCatalog = [
  {
    id: "a1-foundations",
    title: "A1 Foundations",
    level: "A1",
    published: true
  },
  {
    id: "a2-confidence",
    title: "A2 Confidence",
    level: "A2",
    published: true
  }
];

export const dashboardSnapshot = {
  learner: {
    id: 2,
    name: "Alex Morgan",
    role: "student"
  },
  streak: 12,
  currentLevel: "A2",
  currentCourse: "A2 Confidence",
  completedLessons: 14,
  quizAverage: 86
};

export function buildLesson(lessonId) {
  return {
    id: lessonId,
    title: "Talking about daily routines",
    summary: "Learn how to describe habits, routines, and time-based actions using clear everyday English.",
    quizId: `${lessonId}-quiz`,
    blocks: [
      {
        id: `${lessonId}-block-reading`,
        type: "reading",
        title: "Morning routine",
        content:
          "Emma wakes up at 6:30, makes coffee, and checks her calendar before she leaves for work. She usually starts work at 8:00.",
        accent: "Read the example aloud and notice how the routine follows a predictable sequence."
      },
      {
        id: `${lessonId}-block-grammar`,
        type: "grammar",
        title: "Simple present for habits",
        content:
          "Use the simple present to talk about repeated actions: I wake up early. She works from home. Add -s or -es for he, she, and it.",
        accent: "Focus on the third-person singular form: goes, works, studies."
      },
      {
        id: `${lessonId}-block-vocabulary`,
        type: "vocabulary",
        title: "Time expressions",
        content: "Common expressions: every day, in the morning, after lunch, before class, at night.",
        accent: "These phrases help learners place actions in time and build more natural sentences."
      },
      {
        id: `${lessonId}-block-practice`,
        type: "practice",
        title: "Quick production prompt",
        content: "Write three sentences about your weekday routine using the simple present.",
        accent: "Example: I drink tea before I start work."
      }
    ]
  };
}

export function buildQuiz(quizId) {
  return {
    id: quizId,
    title: "Daily routines checkpoint",
    description: "Answer a short set of questions to confirm you understood the routine vocabulary and grammar.",
    questions: [
      {
        id: `${quizId}-q1`,
        prompt: "Choose the correct sentence.",
        type: "single_choice",
        options: [
          { id: `${quizId}-q1-o1`, text: "She go to work every day.", isCorrect: false },
          { id: `${quizId}-q1-o2`, text: "She goes to work every day.", isCorrect: true },
          { id: `${quizId}-q1-o3`, text: "She going to work every day.", isCorrect: false }
        ]
      },
      {
        id: `${quizId}-q2`,
        prompt: "Which expression best completes this sentence: I study English ___ the evening.",
        type: "single_choice",
        options: [
          { id: `${quizId}-q2-o1`, text: "at", isCorrect: false },
          { id: `${quizId}-q2-o2`, text: "in", isCorrect: true },
          { id: `${quizId}-q2-o3`, text: "on", isCorrect: false }
        ]
      },
      {
        id: `${quizId}-q3`,
        prompt: "Pick the phrase that describes a habit.",
        type: "single_choice",
        options: [
          { id: `${quizId}-q3-o1`, text: "I am cooking right now.", isCorrect: false },
          { id: `${quizId}-q3-o2`, text: "I usually walk after dinner.", isCorrect: true },
          { id: `${quizId}-q3-o3`, text: "I am walking to the station now.", isCorrect: false }
        ]
      }
    ]
  };
}

export function scoreQuizSubmission(quizId, answers) {
  const quiz = buildQuiz(quizId);
  const submittedAnswers = Array.isArray(answers) ? answers : [];
  const selectedByQuestion = new Map(submittedAnswers.map((answer) => [answer.questionId, answer.optionId]));

  let correctAnswers = 0;

  for (const question of quiz.questions) {
    const correctOption = question.options.find((option) => option.isCorrect);

    if (correctOption && selectedByQuestion.get(question.id) === correctOption.id) {
      correctAnswers += 1;
    }
  }

  const totalQuestions = quiz.questions.length;

  return {
    correctAnswers,
    totalQuestions,
    score: Math.round((correctAnswers / totalQuestions) * 100)
  };
}
