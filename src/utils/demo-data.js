const courseLibrary = [
  {
    id: "a1-foundations",
    title: "A1 Foundations",
    level: "A1",
    published: true,
    summary: "Start with personal details, daily objects, and short high-frequency sentence patterns.",
    intensity: "Gentle start",
    estimatedWeeks: 4,
    units: [
      {
        id: "a1-foundations-unit-1",
        title: "Introductions and basics",
        summary: "Introduce yourself, exchange simple details, and understand core classroom language.",
        lessonCount: 3,
        checkpointLabel: "Mini speaking review",
        lessons: [
          {
            id: "a1-foundations-unit-1-lesson-1",
            title: "Saying your name and country",
            duration: "12 min",
            focus: "Speaking basics"
          },
          {
            id: "a1-foundations-unit-1-lesson-2",
            title: "Talking about age and work",
            duration: "14 min",
            focus: "Present simple"
          },
          {
            id: "a1-foundations-unit-1-lesson-3",
            title: "Introducing a classmate",
            duration: "10 min",
            focus: "Listening and recall"
          }
        ]
      },
      {
        id: "a1-foundations-unit-2",
        title: "Daily routines",
        summary: "Describe your day with simple verbs, times, and common routine phrases.",
        lessonCount: 3,
        checkpointLabel: "Routine vocabulary quiz",
        lessons: [
          {
            id: "a1-foundations-unit-2-lesson-1",
            title: "Morning routine essentials",
            duration: "11 min",
            focus: "Vocabulary"
          },
          {
            id: "a1-foundations-unit-2-lesson-2",
            title: "Using every day and usually",
            duration: "13 min",
            focus: "Grammar patterns"
          },
          {
            id: "a1-foundations-unit-2-lesson-3",
            title: "Describe your weekday",
            duration: "15 min",
            focus: "Sentence building"
          }
        ]
      }
    ]
  },
  {
    id: "a2-confidence",
    title: "A2 Confidence",
    level: "A2",
    published: true,
    summary: "Build practical fluency for routines, work, travel, and everyday social conversations.",
    intensity: "Most popular path",
    estimatedWeeks: 6,
    units: [
      {
        id: "a2-confidence-unit-1",
        title: "Everyday habits",
        summary: "Talk about frequent actions, weekly plans, and activities with more confidence.",
        lessonCount: 3,
        checkpointLabel: "Habit accuracy quiz",
        lessons: [
          {
            id: "a2-confidence-unit-1-lesson-1",
            title: "Describing your weekly routine",
            duration: "14 min",
            focus: "Routine fluency"
          },
          {
            id: "a2-confidence-unit-1-lesson-2",
            title: "Time expressions for habits",
            duration: "12 min",
            focus: "Vocabulary"
          },
          {
            id: "a2-confidence-unit-1-lesson-3",
            title: "Work and study schedules",
            duration: "16 min",
            focus: "Reading and comprehension"
          }
        ]
      },
      {
        id: "a2-confidence-unit-2",
        title: "Talking about routines",
        summary: "Use present simple patterns, sequencing, and time phrases to sound more natural.",
        lessonCount: 3,
        checkpointLabel: "Daily routines checkpoint",
        lessons: [
          {
            id: "a2-confidence-unit-2-lesson-1",
            title: "Talking about daily routines",
            duration: "15 min",
            focus: "Grammar and reading"
          },
          {
            id: "a2-confidence-unit-2-lesson-2",
            title: "After work and evening plans",
            duration: "13 min",
            focus: "Conversation prompts"
          },
          {
            id: "a2-confidence-unit-2-lesson-3",
            title: "Weekend routine comparison",
            duration: "16 min",
            focus: "Speaking confidence"
          }
        ]
      }
    ]
  }
];

const adminUsers = [
  {
    id: "admin-1",
    name: "Admin English4U",
    role: "admin",
    currentCourse: "Platform operations",
    streak: 0
  },
  {
    id: "student-1",
    name: "Alex Morgan",
    role: "student",
    currentCourse: "A2 Confidence",
    streak: 12
  }
];

function mapCourseForCatalog(course) {
  return {
    id: course.id,
    title: course.title,
    level: course.level,
    published: course.published,
    summary: course.summary,
    intensity: course.intensity,
    estimatedWeeks: course.estimatedWeeks,
    unitCount: course.units.length,
    lessonCount: course.units.reduce((total, unit) => total + unit.lessons.length, 0)
  };
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findCourseById(courseId) {
  return courseLibrary.find((course) => course.id === courseId);
}

export function getCourseCatalog() {
  return courseLibrary.map(mapCourseForCatalog);
}

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

export function getAdminCollectionItems(collection) {
  if (collection === "courses") {
    return getCourseCatalog();
  }

  if (collection === "levels") {
    return courseLibrary.map((course) => ({
      id: `${course.id}-${course.level}`,
      code: course.level,
      title: course.title,
      courseTitle: course.title,
      unitCount: course.units.length
    }));
  }

  if (collection === "units") {
    return courseLibrary.flatMap((course) =>
      course.units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        courseTitle: course.title,
        lessonCount: unit.lessons.length,
        checkpointLabel: unit.checkpointLabel
      }))
    );
  }

  if (collection === "lessons") {
    return courseLibrary.flatMap((course) =>
      course.units.flatMap((unit) =>
        unit.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          courseTitle: course.title,
          unitTitle: unit.title,
          duration: lesson.duration,
          focus: lesson.focus
        }))
      )
    );
  }

  if (collection === "quizzes") {
    return courseLibrary.flatMap((course) =>
      course.units.flatMap((unit) =>
        unit.lessons.map((lesson) => ({
          id: `${lesson.id}-quiz`,
          title: `${lesson.title} quiz`,
          courseTitle: course.title,
          unitTitle: unit.title
        }))
      )
    );
  }

  if (collection === "users") {
    return adminUsers;
  }

  return [];
}

export function createAdminCollectionEntry(collection, payload) {
  if (collection !== "courses") {
    throw new Error("Creation is currently enabled for courses only");
  }

  const title = payload.title?.trim();
  const level = payload.level?.trim() || "A1";
  const summary = payload.summary?.trim() || "New course summary pending.";

  if (!title) {
    throw new Error("Course title is required");
  }

  const id = slugify(payload.slug?.trim() || title);

  if (!id) {
    throw new Error("Course slug is invalid");
  }

  if (findCourseById(id)) {
    throw new Error("A course with this slug already exists");
  }

  const newCourse = {
    id,
    title,
    level,
    published: Boolean(payload.published),
    summary,
    intensity: payload.intensity?.trim() || "New course",
    estimatedWeeks: Number(payload.estimatedWeeks) || 4,
    units: []
  };

  courseLibrary.unshift(newCourse);

  return mapCourseForCatalog(newCourse);
}

export function updateAdminCollectionEntry(collection, id, payload) {
  if (collection !== "courses") {
    throw new Error("Editing is currently enabled for courses only");
  }

  const course = findCourseById(id);

  if (!course) {
    throw new Error("Course not found");
  }

  if (payload.title !== undefined) {
    const nextTitle = payload.title.trim();

    if (!nextTitle) {
      throw new Error("Course title is required");
    }

    course.title = nextTitle;
  }

  if (payload.level !== undefined) {
    course.level = payload.level.trim() || course.level;
  }

  if (payload.summary !== undefined) {
    course.summary = payload.summary.trim() || course.summary;
  }

  if (payload.intensity !== undefined) {
    course.intensity = payload.intensity.trim() || course.intensity;
  }

  if (payload.estimatedWeeks !== undefined) {
    course.estimatedWeeks = Number(payload.estimatedWeeks) || course.estimatedWeeks;
  }

  if (payload.published !== undefined) {
    course.published = Boolean(payload.published);
  }

  return mapCourseForCatalog(course);
}

export function deleteAdminCollectionEntry(collection, id) {
  if (collection !== "courses") {
    throw new Error("Deletion is currently enabled for courses only");
  }

  const index = courseLibrary.findIndex((course) => course.id === id);

  if (index === -1) {
    throw new Error("Course not found");
  }

  courseLibrary.splice(index, 1);
}

export function buildCourseDetail(courseId) {
  const course = courseLibrary.find((item) => item.id === courseId);

  if (!course) {
    return null;
  }

  return {
    ...course,
    unitCount: course.units.length,
    lessonCount: course.units.reduce((total, unit) => total + unit.lessons.length, 0),
    units: course.units.map((unit, index) => ({
      ...unit,
      positionLabel: `Unit ${String(index + 1).padStart(2, "0")}`
    }))
  };
}

export function buildUnitDetail(unitId) {
  for (const course of courseLibrary) {
    const unit = course.units.find((candidate) => candidate.id === unitId);

    if (unit) {
      return {
        ...unit,
        courseId: course.id,
        courseTitle: course.title
      };
    }
  }

  return null;
}

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
