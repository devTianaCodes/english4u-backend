import { getGrammarTopicForLesson } from "./grammar-library.js";
import { getLessonBlueprint } from "./lesson-library.js";

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
            focus: "Speaking basics",
            ...getLessonBlueprint("a1-foundations-unit-1-lesson-1")
          },
          {
            id: "a1-foundations-unit-1-lesson-2",
            title: "Talking about age and work",
            duration: "14 min",
            focus: "Present simple",
            ...getLessonBlueprint("a1-foundations-unit-1-lesson-2")
          },
          {
            id: "a1-foundations-unit-1-lesson-3",
            title: "Introducing a classmate",
            duration: "10 min",
            focus: "Listening and recall",
            ...getLessonBlueprint("a1-foundations-unit-1-lesson-3")
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
            focus: "Vocabulary",
            ...getLessonBlueprint("a1-foundations-unit-2-lesson-1")
          },
          {
            id: "a1-foundations-unit-2-lesson-2",
            title: "Using every day and usually",
            duration: "13 min",
            focus: "Grammar patterns",
            ...getLessonBlueprint("a1-foundations-unit-2-lesson-2")
          },
          {
            id: "a1-foundations-unit-2-lesson-3",
            title: "Describe your weekday",
            duration: "15 min",
            focus: "Sentence building",
            ...getLessonBlueprint("a1-foundations-unit-2-lesson-3")
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
            focus: "Routine fluency",
            ...getLessonBlueprint("a2-confidence-unit-1-lesson-1")
          },
          {
            id: "a2-confidence-unit-1-lesson-2",
            title: "Time expressions for habits",
            duration: "12 min",
            focus: "Vocabulary",
            ...getLessonBlueprint("a2-confidence-unit-1-lesson-2")
          },
          {
            id: "a2-confidence-unit-1-lesson-3",
            title: "Work and study schedules",
            duration: "16 min",
            focus: "Reading and comprehension",
            ...getLessonBlueprint("a2-confidence-unit-1-lesson-3")
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
            focus: "Grammar and reading",
            ...getLessonBlueprint("a2-confidence-unit-2-lesson-1")
          },
          {
            id: "a2-confidence-unit-2-lesson-2",
            title: "After work and evening plans",
            duration: "13 min",
            focus: "Conversation prompts",
            ...getLessonBlueprint("a2-confidence-unit-2-lesson-2")
          },
          {
            id: "a2-confidence-unit-2-lesson-3",
            title: "Weekend routine comparison",
            duration: "16 min",
            focus: "Speaking confidence",
            ...getLessonBlueprint("a2-confidence-unit-2-lesson-3")
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

const legacyPersistedLessonSlug = "a2-confidence-unit-2-lesson-1";

function getAllLessonSlugs() {
  return courseLibrary.flatMap((course) => course.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id)));
}

export function getPersistedLessonSlugs() {
  const allLessonSlugs = getAllLessonSlugs();

  return [
    legacyPersistedLessonSlug,
    ...allLessonSlugs.filter((lessonSlug) => lessonSlug !== legacyPersistedLessonSlug)
  ];
}

export function getSeedCatalog() {
  return structuredClone(courseLibrary);
}

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

function findUnitRecordById(unitId) {
  for (const course of courseLibrary) {
    const unit = course.units.find((candidate) => candidate.id === unitId);

    if (unit) {
      return {
        course,
        unit
      };
    }
  }

  return null;
}

function findLessonRecordById(lessonId) {
  for (const course of courseLibrary) {
    for (const unit of course.units) {
      const lesson = unit.lessons.find((candidate) => candidate.id === lessonId);

      if (lesson) {
        return {
          course,
          unit,
          lesson
        };
      }
    }
  }

  return null;
}

function mapLessonForAdmin(course, unit, lesson) {
  return {
    id: lesson.id,
    title: lesson.title,
    courseId: course.id,
    courseTitle: course.title,
    unitId: unit.id,
    unitTitle: unit.title,
    summary: lesson.summary,
    duration: lesson.duration,
    focus: lesson.focus,
    blocks: (lesson.blocks ?? createDefaultLessonBlocks(lesson.id)).map((block) => ({
      type: block.type,
      title: block.title,
      content: block.content,
      accent: block.accent
    }))
  };
}

function createDefaultLessonBlocks(lessonId) {
  return [
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
  ];
}

function normalizeLessonBlocks(lessonId, rawBlocks) {
  const sourceBlocks = Array.isArray(rawBlocks) && rawBlocks.length > 0 ? rawBlocks : createDefaultLessonBlocks(lessonId);

  return sourceBlocks.map((block, index) => {
    const type = block.type?.trim();
    const title = block.title?.trim();
    const content = block.content?.trim();
    const accent = block.accent?.trim();

    if (!type || !title || !content || !accent) {
      throw new Error(`Lesson block ${index + 1} must include type, title, content, and accent`);
    }

    return {
      id: `${lessonId}-block-${index + 1}`,
      type,
      title,
      content,
      accent
    };
  });
}

function createDefaultQuizTemplate(lesson) {
  return {
    title: `${lesson.title} checkpoint`,
    description: "Answer a short set of questions to confirm you understood the routine vocabulary and grammar.",
    questions: [
      {
        prompt: "Choose the correct sentence.",
        options: [
          { text: "She go to work every day.", isCorrect: false },
          { text: "She goes to work every day.", isCorrect: true },
          { text: "She going to work every day.", isCorrect: false }
        ]
      },
      {
        prompt: "Which expression best completes this sentence: I study English ___ the evening.",
        options: [
          { text: "at", isCorrect: false },
          { text: "in", isCorrect: true },
          { text: "on", isCorrect: false }
        ]
      },
      {
        prompt: "Pick the phrase that describes a habit.",
        options: [
          { text: "I am cooking right now.", isCorrect: false },
          { text: "I usually walk after dinner.", isCorrect: true },
          { text: "I am walking to the station now.", isCorrect: false }
        ]
      }
    ]
  };
}

function buildQuizQuestions(quizId, questions) {
  return questions.map((question, questionIndex) => ({
    id: `${quizId}-q${questionIndex + 1}`,
    prompt: question.prompt,
    type: "single_choice",
    options: question.options.map((option, optionIndex) => ({
      id: `${quizId}-q${questionIndex + 1}-o${optionIndex + 1}`,
      text: option.text,
      isCorrect: Boolean(option.isCorrect)
    }))
  }));
}

function buildQuizFromLessonRecord(lessonRecord) {
  const quizId = `${lessonRecord.lesson.id}-quiz`;
  const quizTemplate = lessonRecord.lesson.quiz ?? createDefaultQuizTemplate(lessonRecord.lesson);
  const sequence = findLessonSequence(lessonRecord.lesson.id);

  return {
    id: quizId,
    title: quizTemplate.title,
    lessonId: lessonRecord.lesson.id,
    lessonTitle: lessonRecord.lesson.title,
    courseId: lessonRecord.course.id,
    courseTitle: lessonRecord.course.title,
    unitId: lessonRecord.unit.id,
    unitTitle: lessonRecord.unit.title,
    description: quizTemplate.description,
    hasCustomContent: Boolean(lessonRecord.lesson.quiz),
    nextLesson: sequence?.nextLesson
      ? {
          id: sequence.nextLesson.id,
          title: sequence.nextLesson.title
        }
      : null,
    questions: buildQuizQuestions(quizId, quizTemplate.questions)
  };
}

function mapQuizForAdmin(course, unit, lesson) {
  const quiz = buildQuizFromLessonRecord({
    course,
    unit,
    lesson
  });

  return {
    id: quiz.id,
    title: quiz.title,
    lessonId: quiz.lessonId,
    lessonTitle: quiz.lessonTitle,
    courseId: quiz.courseId,
    courseTitle: quiz.courseTitle,
    unitId: quiz.unitId,
    unitTitle: quiz.unitTitle,
    description: quiz.description,
    questionCount: quiz.questions.length,
    hasCustomContent: quiz.hasCustomContent,
    questions: quiz.questions.map((question) => ({
      prompt: question.prompt,
      options: question.options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect
      }))
    }))
  };
}

function findLessonRecordByQuizId(quizId) {
  if (!quizId.endsWith("-quiz")) {
    return null;
  }

  return findLessonRecordById(quizId.slice(0, -5));
}

function normalizeQuizPayload(lesson, payload) {
  const title = payload.title?.trim() || `${lesson.title} checkpoint`;
  const description =
    payload.description?.trim() ||
    "Answer a short set of questions to confirm you understood the routine vocabulary and grammar.";
  const rawQuestions = Array.isArray(payload.questions) ? payload.questions : [];

  if (rawQuestions.length !== 3) {
    throw new Error("Quiz content must include exactly three questions");
  }

  const questions = rawQuestions.map((question, questionIndex) => {
    const prompt = question.prompt?.trim();
    const rawOptions = Array.isArray(question.options) ? question.options : [];

    if (!prompt) {
      throw new Error(`Question ${questionIndex + 1} prompt is required`);
    }

    if (rawOptions.length !== 3) {
      throw new Error(`Question ${questionIndex + 1} must have exactly three options`);
    }

    const options = rawOptions.map((option, optionIndex) => {
      const text = option.text?.trim();

      if (!text) {
        throw new Error(`Question ${questionIndex + 1} option ${optionIndex + 1} is required`);
      }

      return {
        text,
        isCorrect: Boolean(option.isCorrect)
      };
    });

    if (options.filter((option) => option.isCorrect).length !== 1) {
      throw new Error(`Question ${questionIndex + 1} must have exactly one correct answer`);
    }

    return {
      prompt,
      options
    };
  });

  return {
    title,
    description,
    questions
  };
}

function syncUnitLessonCount(unit) {
  unit.lessonCount = unit.lessons.length;
}

function getCourseByLevel(levelCode) {
  return courseLibrary.find((course) => course.level === levelCode) ?? courseLibrary[0];
}

function getFlattenedLessonsForCourse(courseId) {
  const course = findCourseById(courseId);

  if (!course) {
    return [];
  }

  return course.units.flatMap((unit, unitIndex) =>
    unit.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      courseId: course.id,
      courseTitle: course.title,
      unitId: unit.id,
      unitTitle: unit.title,
      unitIndex,
      lessonIndex
    }))
  );
}

function findLessonSequence(lessonId) {
  const lessonRecord = findLessonRecordById(lessonId);

  if (!lessonRecord) {
    return null;
  }

  const orderedLessons = getFlattenedLessonsForCourse(lessonRecord.course.id);
  const lessonIndex = orderedLessons.findIndex((candidate) => candidate.id === lessonId);

  if (lessonIndex === -1) {
    return null;
  }

  return {
    lessonRecord,
    orderedLessons,
    currentLesson: orderedLessons[lessonIndex],
    previousLesson: orderedLessons[lessonIndex - 1] ?? null,
    nextLesson: orderedLessons[lessonIndex + 1] ?? null,
    lessonIndex
  };
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
        courseId: course.id,
        courseTitle: course.title,
        summary: unit.summary,
        lessonCount: unit.lessons.length,
        checkpointLabel: unit.checkpointLabel
      }))
    );
  }

  if (collection === "lessons") {
    return courseLibrary.flatMap((course) =>
      course.units.flatMap((unit) =>
        unit.lessons.map((lesson) => mapLessonForAdmin(course, unit, lesson))
      )
    );
  }

  if (collection === "quizzes") {
    return courseLibrary.flatMap((course) =>
      course.units.flatMap((unit) =>
        unit.lessons.map((lesson) => mapQuizForAdmin(course, unit, lesson))
      )
    );
  }

  if (collection === "users") {
    return adminUsers;
  }

  return [];
}

export function createAdminCollectionEntry(collection, payload) {
  if (collection === "courses") {
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

  if (collection === "units") {
    const course = findCourseById(payload.courseId);
    const title = payload.title?.trim();

    if (!course) {
      throw new Error("A parent course is required");
    }

    if (!title) {
      throw new Error("Unit title is required");
    }

    const id = slugify(`${course.id}-${title}`);

    if (findUnitRecordById(id)) {
      throw new Error("A unit with this slug already exists");
    }

    const newUnit = {
      id,
      title,
      summary: payload.summary?.trim() || "New unit summary pending.",
      lessonCount: 0,
      checkpointLabel: payload.checkpointLabel?.trim() || "Checkpoint to be defined",
      lessons: []
    };

    course.units.push(newUnit);

    return {
      id: newUnit.id,
      title: newUnit.title,
      courseId: course.id,
      courseTitle: course.title,
      summary: newUnit.summary,
      lessonCount: 0,
      checkpointLabel: newUnit.checkpointLabel
    };
  }

  if (collection === "lessons") {
    const unitRecord = findUnitRecordById(payload.unitId);
    const title = payload.title?.trim();

    if (!unitRecord) {
      throw new Error("A parent unit is required");
    }

    if (!title) {
      throw new Error("Lesson title is required");
    }

    const id = slugify(`${unitRecord.unit.id}-${title}`);

    if (findLessonRecordById(id)) {
      throw new Error("A lesson with this slug already exists");
    }

    const newLesson = {
      id,
      title,
      summary: payload.summary?.trim() || "New lesson summary pending.",
      duration: payload.duration?.trim() || "12 min",
      focus: payload.focus?.trim() || "Core practice",
      blocks: normalizeLessonBlocks(id, payload.blocks)
    };

    unitRecord.unit.lessons.push(newLesson);
    syncUnitLessonCount(unitRecord.unit);

    return mapLessonForAdmin(unitRecord.course, unitRecord.unit, newLesson);
  }

  if (collection === "quizzes") {
    const lessonRecord = findLessonRecordById(payload.lessonId);

    if (!lessonRecord) {
      throw new Error("A parent lesson is required");
    }

    lessonRecord.lesson.quiz = normalizeQuizPayload(lessonRecord.lesson, payload);

    return mapQuizForAdmin(lessonRecord.course, lessonRecord.unit, lessonRecord.lesson);
  }

  throw new Error("Creation is currently enabled for courses, units, lessons, and quizzes only");
}

export function updateAdminCollectionEntry(collection, id, payload) {
  if (collection === "courses") {
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

  if (collection === "units") {
    const unitRecord = findUnitRecordById(id);
    const nextCourse = findCourseById(payload.courseId);

    if (!unitRecord) {
      throw new Error("Unit not found");
    }

    if (!nextCourse) {
      throw new Error("A parent course is required");
    }

    if (payload.title !== undefined) {
      const nextTitle = payload.title.trim();

      if (!nextTitle) {
        throw new Error("Unit title is required");
      }

      unitRecord.unit.title = nextTitle;
    }

    if (payload.summary !== undefined) {
      unitRecord.unit.summary = payload.summary.trim() || unitRecord.unit.summary;
    }

    if (payload.checkpointLabel !== undefined) {
      unitRecord.unit.checkpointLabel = payload.checkpointLabel.trim() || unitRecord.unit.checkpointLabel;
    }

    if (unitRecord.course.id !== nextCourse.id) {
      unitRecord.course.units = unitRecord.course.units.filter((candidate) => candidate.id !== id);
      nextCourse.units.push(unitRecord.unit);
      unitRecord.course = nextCourse;
    }

    return {
      id: unitRecord.unit.id,
      title: unitRecord.unit.title,
      courseId: unitRecord.course.id,
      courseTitle: unitRecord.course.title,
      summary: unitRecord.unit.summary,
      lessonCount: unitRecord.unit.lessons.length,
      checkpointLabel: unitRecord.unit.checkpointLabel
    };
  }

  if (collection === "lessons") {
    const lessonRecord = findLessonRecordById(id);
    const nextUnitRecord = findUnitRecordById(payload.unitId);

    if (!lessonRecord) {
      throw new Error("Lesson not found");
    }

    if (!nextUnitRecord) {
      throw new Error("A parent unit is required");
    }

    if (payload.title !== undefined) {
      const nextTitle = payload.title.trim();

      if (!nextTitle) {
        throw new Error("Lesson title is required");
      }

      lessonRecord.lesson.title = nextTitle;
    }

    if (payload.summary !== undefined) {
      lessonRecord.lesson.summary = payload.summary.trim() || lessonRecord.lesson.summary;
    }

    if (payload.duration !== undefined) {
      lessonRecord.lesson.duration = payload.duration.trim() || lessonRecord.lesson.duration;
    }

    if (payload.focus !== undefined) {
      lessonRecord.lesson.focus = payload.focus.trim() || lessonRecord.lesson.focus;
    }

    if (payload.blocks !== undefined) {
      lessonRecord.lesson.blocks = normalizeLessonBlocks(id, payload.blocks);
    }

    if (lessonRecord.unit.id !== nextUnitRecord.unit.id) {
      lessonRecord.unit.lessons = lessonRecord.unit.lessons.filter((candidate) => candidate.id !== id);
      syncUnitLessonCount(lessonRecord.unit);
      nextUnitRecord.unit.lessons.push(lessonRecord.lesson);
      syncUnitLessonCount(nextUnitRecord.unit);
      lessonRecord.course = nextUnitRecord.course;
      lessonRecord.unit = nextUnitRecord.unit;
    }

    return mapLessonForAdmin(lessonRecord.course, lessonRecord.unit, lessonRecord.lesson);
  }

  if (collection === "quizzes") {
    const lessonRecord = findLessonRecordByQuizId(id);

    if (!lessonRecord) {
      throw new Error("Quiz not found");
    }

    lessonRecord.lesson.quiz = normalizeQuizPayload(lessonRecord.lesson, {
      ...payload,
      lessonId: lessonRecord.lesson.id
    });

    return mapQuizForAdmin(lessonRecord.course, lessonRecord.unit, lessonRecord.lesson);
  }

  throw new Error("Editing is currently enabled for courses, units, lessons, and quizzes only");
}

export function deleteAdminCollectionEntry(collection, id) {
  if (collection === "courses") {
    const index = courseLibrary.findIndex((course) => course.id === id);

    if (index === -1) {
      throw new Error("Course not found");
    }

    courseLibrary.splice(index, 1);
    return;
  }

  if (collection === "units") {
    const unitRecord = findUnitRecordById(id);

    if (!unitRecord) {
      throw new Error("Unit not found");
    }

    unitRecord.course.units = unitRecord.course.units.filter((candidate) => candidate.id !== id);
    return;
  }

  if (collection === "lessons") {
    const lessonRecord = findLessonRecordById(id);

    if (!lessonRecord) {
      throw new Error("Lesson not found");
    }

    lessonRecord.unit.lessons = lessonRecord.unit.lessons.filter((candidate) => candidate.id !== id);
    syncUnitLessonCount(lessonRecord.unit);
    return;
  }

  if (collection === "quizzes") {
    const lessonRecord = findLessonRecordByQuizId(id);

    if (!lessonRecord) {
      throw new Error("Quiz not found");
    }

    delete lessonRecord.lesson.quiz;

    return mapQuizForAdmin(lessonRecord.course, lessonRecord.unit, lessonRecord.lesson);
  }

  throw new Error("Deletion is currently enabled for courses, units, lessons, and quizzes only");
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
      positionLabel: `Unit ${String(index + 1).padStart(2, "0")}`,
      lessons: unit.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        positionLabel: `Lesson ${String(lessonIndex + 1).padStart(2, "0")}`
      }))
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
  const sequence = findLessonSequence(lessonId);
  const lessonRecord = sequence?.lessonRecord ?? null;
  const course = lessonRecord?.course ?? null;
  const unit = lessonRecord?.unit ?? null;
  const lessonPosition = sequence ? sequence.lessonIndex + 1 : null;
  const totalLessons = sequence?.orderedLessons.length ?? null;

  return {
    id: lessonId,
    title: lessonRecord?.lesson.title ?? "Talking about daily routines",
    courseId: course?.id ?? null,
    courseTitle: course?.title ?? "A2 Confidence",
    unitId: unit?.id ?? null,
    unitTitle: unit?.title ?? "Talking about routines",
    positionLabel: lessonPosition ? `Lesson ${String(lessonPosition).padStart(2, "0")}` : null,
    totalLessons,
    summary:
      lessonRecord?.lesson.summary ??
      "Learn how to describe habits, routines, and time-based actions using clear everyday English.",
    grammarTopic: getGrammarTopicForLesson(lessonId),
    quizId: `${lessonId}-quiz`,
    previousLesson: sequence?.previousLesson
      ? {
          id: sequence.previousLesson.id,
          title: sequence.previousLesson.title
        }
      : null,
    nextLesson: sequence?.nextLesson
      ? {
          id: sequence.nextLesson.id,
          title: sequence.nextLesson.title
        }
      : null,
    blocks: lessonRecord?.lesson.blocks ?? createDefaultLessonBlocks(lessonId)
  };
}

export function buildQuiz(quizId) {
  const lessonRecord = findLessonRecordByQuizId(quizId);

  if (!lessonRecord) {
    return {
      id: quizId,
      title: "Daily routines checkpoint",
      lessonId: null,
      courseId: null,
      courseTitle: null,
      unitId: null,
      unitTitle: null,
      description: "Answer a short set of questions to confirm you understood the routine vocabulary and grammar.",
      nextLesson: null,
      questions: buildQuizQuestions(quizId, createDefaultQuizTemplate({ title: "Daily routines" }).questions)
    };
  }

  return buildQuizFromLessonRecord(lessonRecord);
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

export function resolvePersistedLessonId(lessonSlug) {
  const index = getPersistedLessonSlugs().indexOf(lessonSlug);
  return index === -1 ? null : index + 1;
}

export function resolvePersistedQuizId(quizSlug) {
  if (!quizSlug.endsWith("-quiz")) {
    return null;
  }

  return resolvePersistedLessonId(quizSlug.slice(0, -5));
}

export function resolveQuizSlugFromPersistedId(quizId) {
  const lessonSlug = resolveLessonSlugFromPersistedId(quizId);
  return lessonSlug ? `${lessonSlug}-quiz` : null;
}

export function resolveLessonSlugFromPersistedId(lessonId) {
  return getPersistedLessonSlugs()[lessonId - 1] ?? null;
}

export function buildLearnerPath(levelCode, completedLessonSlugs = []) {
  const course = getCourseByLevel(levelCode);
  const orderedLessons = getFlattenedLessonsForCourse(course.id);
  const completedSet = new Set(completedLessonSlugs);
  const nextLesson = orderedLessons.find((lesson) => !completedSet.has(lesson.id)) ?? orderedLessons[0] ?? null;

  return {
    courseId: course.id,
    courseTitle: course.title,
    level: course.level,
    nextLesson: nextLesson
      ? {
          id: nextLesson.id,
          title: nextLesson.title,
          unitTitle: nextLesson.unitTitle,
          duration: nextLesson.duration,
          quizId: `${nextLesson.id}-quiz`
        }
      : null,
    completedLessonSlugs
  };
}
