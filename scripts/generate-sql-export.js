import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildQuiz, getPersistedLessonSlugs, getSeedCatalog } from "../src/utils/demo-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(backendRoot, "..");
const schemaPath = path.join(backendRoot, "db", "schema.sql");
const repoExportPath = path.join(backendRoot, "db", "english4u_database_export.sql");
const rootExportPath = path.join(projectRoot, "english4u_database_export.sql");

const seededUsers = {
  adminPasswordHash: "$2a$10$8mbz7.k1hh3KZAWh/9GasOyWXyu07QBSNRYkkrzT8KvijRQJTXGT.",
  studentPasswordHash: "$2a$10$usb4lUcLx5tKk8hLctA0UuNyWYrH5t5qDDSTUzBin1mi711zMZKAK"
};

function sqlString(value) {
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}

function jsonLiteral(value) {
  return sqlString(JSON.stringify(value));
}

function buildSeedMaps() {
  const catalog = getSeedCatalog();
  const levels = catalog.map((course, index) => ({
    id: index + 1,
    courseId: index + 1,
    slug: course.id,
    code: course.level,
    title: course.title,
    position: 1
  }));

  const unitMap = new Map();
  const units = [];
  let nextUnitId = 1;

  for (const course of catalog) {
    const level = levels.find((item) => item.slug === course.id);

    course.units.forEach((unit, index) => {
      units.push({
        id: nextUnitId,
        levelId: level.id,
        slug: unit.id,
        title: unit.title,
        summary: unit.summary,
        position: index + 1
      });
      unitMap.set(unit.id, nextUnitId);
      nextUnitId += 1;
    });
  }

  const lessonLookup = new Map();

  for (const course of catalog) {
    for (const unit of course.units) {
      unit.lessons.forEach((lesson, index) => {
        lessonLookup.set(lesson.id, {
          ...lesson,
          courseId: course.id,
          unitId: unit.id,
          position: index + 1
        });
      });
    }
  }

  return {
    catalog,
    levels,
    lessonLookup,
    units,
    unitMap
  };
}

function buildExportSql(schemaSql) {
  const { catalog, levels, lessonLookup, units, unitMap } = buildSeedMaps();
  const persistedLessonSlugs = getPersistedLessonSlugs();

  const lessons = persistedLessonSlugs.map((lessonSlug, index) => {
    const lesson = lessonLookup.get(lessonSlug);

    return {
      id: index + 1,
      unitId: unitMap.get(lesson.unitId),
      slug: lessonSlug,
      title: lesson.title,
      lessonType: "mixed",
      contentJson: {
        summary: lesson.summary,
        duration: lesson.duration,
        focus: lesson.focus,
        blocks: lesson.blocks
      },
      status: "published",
      position: lesson.position
    };
  });

  const quizzes = lessons.map((lesson) => {
    const quiz = buildQuiz(`${lesson.slug}-quiz`);
    return {
      id: lesson.id,
      lessonId: lesson.id,
      title: quiz.title,
      questions: quiz.questions
    };
  });

  let nextQuestionId = 1;
  let nextOptionId = 1;

  const questionRows = [];
  const optionRows = [];

  quizzes.forEach((quiz) => {
    quiz.questions.forEach((question, questionIndex) => {
      const questionId = nextQuestionId++;

      questionRows.push({
        id: questionId,
        quizId: quiz.id,
        prompt: question.prompt,
        questionType: question.type,
        position: questionIndex + 1
      });

      question.options.forEach((option) => {
        optionRows.push({
          id: nextOptionId++,
          questionId,
          text: option.text,
          isCorrect: option.isCorrect ? 1 : 0
        });
      });
    });
  });

  const sampleQuiz = buildQuiz("a2-confidence-unit-2-lesson-1-quiz");
  const sampleAnswers = sampleQuiz.questions.map((question) => ({
    questionId: question.id,
    optionId: question.options.find((option) => option.isCorrect)?.id
  }));

  const lines = [
    "-- English4U database export",
    "-- Import this file in MySQL Workbench to create the schema and sample data.",
    "--",
    "-- Sample login accounts created by this file:",
    "--   admin@english4u.local   / Admin123!",
    "--   student@english4u.local / Student123!",
    "",
    "DROP DATABASE IF EXISTS english4u;",
    "CREATE DATABASE english4u CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
    "USE english4u;",
    "",
    "SET NAMES utf8mb4;",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "",
    schemaSql.trim(),
    "",
    "INSERT INTO roles (id, name) VALUES",
    "  (1, 'admin'),",
    "  (2, 'student');",
    "",
    "INSERT INTO users (id, first_name, last_name, email, password_hash, created_at) VALUES",
    `  (1, 'Admin', 'English4U', 'admin@english4u.local', ${sqlString(seededUsers.adminPasswordHash)}, '2026-03-24 10:00:00'),`,
    `  (2, 'Alex', 'Morgan', 'student@english4u.local', ${sqlString(seededUsers.studentPasswordHash)}, '2026-03-24 10:05:00');`,
    "",
    "INSERT INTO user_roles (user_id, role_id) VALUES",
    "  (1, 1),",
    "  (2, 2);",
    "",
    "INSERT INTO courses (id, slug, title, description, published) VALUES",
    catalog.map((course, index) => `  (${index + 1}, ${sqlString(course.id)}, ${sqlString(course.title)}, ${sqlString(course.summary)}, ${course.published ? 1 : 0})`).join(",\n") + ";",
    "",
    "INSERT INTO levels (id, course_id, code, title, position) VALUES",
    levels.map((level) => `  (${level.id}, ${level.courseId}, ${sqlString(level.code)}, ${sqlString(level.title)}, ${level.position})`).join(",\n") + ";",
    "",
    "INSERT INTO units (id, level_id, title, summary, position) VALUES",
    units.map((unit) => `  (${unit.id}, ${unit.levelId}, ${sqlString(unit.title)}, ${sqlString(unit.summary)}, ${unit.position})`).join(",\n") + ";",
    "",
    "INSERT INTO lessons (id, unit_id, title, lesson_type, content_json, status, position) VALUES",
    lessons
      .map(
        (lesson) =>
          `  (${lesson.id}, ${lesson.unitId}, ${sqlString(lesson.title)}, ${sqlString(lesson.lessonType)}, ${jsonLiteral(
            lesson.contentJson
          )}, ${sqlString(lesson.status)}, ${lesson.position})`
      )
      .join(",\n") + ";",
    "",
    "INSERT INTO quizzes (id, lesson_id, title) VALUES",
    quizzes.map((quiz) => `  (${quiz.id}, ${quiz.lessonId}, ${sqlString(quiz.title)})`).join(",\n") + ";",
    "",
    "INSERT INTO questions (id, quiz_id, prompt, question_type, position) VALUES",
    questionRows
      .map((question) => `  (${question.id}, ${question.quizId}, ${sqlString(question.prompt)}, ${sqlString(question.questionType)}, ${question.position})`)
      .join(",\n") + ";",
    "",
    "INSERT INTO question_options (id, question_id, option_text, is_correct) VALUES",
    optionRows
      .map((option) => `  (${option.id}, ${option.questionId}, ${sqlString(option.text)}, ${option.isCorrect})`)
      .join(",\n") + ";",
    "",
    "INSERT INTO placement_attempts (id, user_id, score, recommended_level, created_at) VALUES",
    "  (1, 2, 40, 'A2', '2026-03-24 10:15:00');",
    "",
    "INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at, status) VALUES",
    "  (1, 2, 1, '2026-03-24 10:30:00', 'completed');",
    "",
    "INSERT INTO quiz_attempts (id, user_id, quiz_id, score, answers_json, submitted_at) VALUES",
    `  (1, 2, 1, 100, ${jsonLiteral(sampleAnswers)}, '2026-03-24 10:35:00');`,
    "",
    "INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_at) VALUES",
    "  (2, 12, 18, '2026-03-24 10:35:00');",
    "",
    "INSERT INTO study_plans (user_id, sessions_per_week, minutes_per_session, focus, updated_at) VALUES",
    "  (2, 4, 20, 'Speaking confidence', '2026-03-24 10:40:00');",
    "",
    "SET FOREIGN_KEY_CHECKS = 1;",
    ""
  ];

  return lines.join("\n");
}

async function main() {
  const schemaSql = await readFile(schemaPath, "utf8");
  const exportSql = buildExportSql(schemaSql);

  await writeFile(repoExportPath, exportSql, "utf8");
  await writeFile(rootExportPath, exportSql, "utf8");

  process.stdout.write(`Generated SQL export at:\n- ${repoExportPath}\n- ${rootExportPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
