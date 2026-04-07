import { pool } from "../../db/pool.js";
import { resolveLessonSlugFromPersistedId } from "../../utils/demo-data.js";

function normalizeLimit(limit, fallback = 5) {
  return Math.min(Math.max(Number(limit) || fallback, 1), 20);
}

function toIsoDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function isPreviousDay(previous, current) {
  const previousDate = new Date(previous);
  const currentDate = new Date(current);
  const diff = currentDate.getTime() - previousDate.getTime();

  return diff > 0 && diff <= 24 * 60 * 60 * 1000 && toIsoDate(previousDate) !== toIsoDate(currentDate);
}

export function isSeedPersistenceError(error) {
  return error?.code === "ER_NO_REFERENCED_ROW_2" || error?.code === "ER_NO_SUCH_TABLE";
}

async function upsertUserStreakWithConnection(connection, userId) {
  const now = new Date();
  const [rows] = await connection.execute(
    `
      SELECT current_streak, longest_streak, last_activity_at
      FROM user_streaks
      WHERE user_id = ?
      LIMIT 1
    `,
    [userId]
  );

  if (rows.length === 0) {
    await connection.execute(
      `
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_at)
        VALUES (?, 1, 1, ?)
      `,
      [userId, now]
    );

    return {
      currentStreak: 1,
      longestStreak: 1
    };
  }

  const currentRow = rows[0];
  let nextCurrentStreak = currentRow.current_streak;

  if (!currentRow.last_activity_at) {
    nextCurrentStreak = 1;
  } else if (toIsoDate(currentRow.last_activity_at) === toIsoDate(now)) {
    nextCurrentStreak = currentRow.current_streak;
  } else if (isPreviousDay(currentRow.last_activity_at, now)) {
    nextCurrentStreak = currentRow.current_streak + 1;
  } else {
    nextCurrentStreak = 1;
  }

  const nextLongestStreak = Math.max(currentRow.longest_streak, nextCurrentStreak);

  await connection.execute(
    `
      UPDATE user_streaks
      SET current_streak = ?, longest_streak = ?, last_activity_at = ?
      WHERE user_id = ?
    `,
    [nextCurrentStreak, nextLongestStreak, now, userId]
  );

  return {
    currentStreak: nextCurrentStreak,
    longestStreak: nextLongestStreak
  };
}

export async function getProgressSnapshot(userId) {
  const [[completedRow]] = await pool.execute(
    `
      SELECT COUNT(*) AS completed_lessons
      FROM lesson_progress
      WHERE user_id = ? AND status = 'completed'
    `,
    [userId]
  );
  const [[quizRow]] = await pool.execute(
    `
      SELECT COALESCE(ROUND(AVG(score)), 0) AS quiz_average, COUNT(*) AS quiz_attempts
      FROM quiz_attempts
      WHERE user_id = ?
    `,
    [userId]
  );
  const [[streakRow]] = await pool.execute(
    `
      SELECT current_streak, longest_streak, last_activity_at
      FROM user_streaks
      WHERE user_id = ?
      LIMIT 1
    `,
    [userId]
  );

  return {
    completedLessons: completedRow?.completed_lessons ?? 0,
    quizAverage: quizRow?.quiz_average ?? 0,
    quizAttempts: quizRow?.quiz_attempts ?? 0,
    streak: streakRow?.current_streak ?? 0,
    longestStreak: streakRow?.longest_streak ?? 0,
    lastActivityAt: streakRow?.last_activity_at ?? null
  };
}

export async function getCompletedLessonSlugs(userId) {
  const [rows] = await pool.execute(
    `
      SELECT lesson_id
      FROM lesson_progress
      WHERE user_id = ? AND status = 'completed'
      ORDER BY completed_at ASC, id ASC
    `,
    [userId]
  );

  return rows
    .map((row) => resolveLessonSlugFromPersistedId(row.lesson_id))
    .filter(Boolean);
}

export async function markLessonCompleted(userId, lessonId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `
        INSERT INTO lesson_progress (user_id, lesson_id, completed_at, status)
        VALUES (?, ?, NOW(), 'completed')
        ON DUPLICATE KEY UPDATE
          completed_at = VALUES(completed_at),
          status = 'completed'
      `,
      [userId, lessonId]
    );

    const streak = await upsertUserStreakWithConnection(connection, userId);
    await connection.commit();

    return streak;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function saveQuizAttempt(userId, quizId, score, answers) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `
        INSERT INTO quiz_attempts (user_id, quiz_id, score, answers_json)
        VALUES (?, ?, ?, ?)
      `,
      [userId, quizId, score, JSON.stringify(answers)]
    );

    const streak = await upsertUserStreakWithConnection(connection, userId);
    await connection.commit();

    return streak;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getRecentQuizAttempts(userId, limit = 5) {
  const safeLimit = normalizeLimit(limit);
  const [rows] = await pool.execute(
    `
      SELECT id, quiz_id, score, answers_json, submitted_at
      FROM quiz_attempts
      WHERE user_id = ?
      ORDER BY submitted_at DESC, id DESC
      LIMIT ${safeLimit}
    `,
    [userId]
  );

  return rows;
}

export async function getWeeklyActivitySummary(userId) {
  const [rows] = await pool.execute(
    `
      SELECT activity_date, COUNT(*) AS activity_count
      FROM (
        SELECT DATE(completed_at) AS activity_date
        FROM lesson_progress
        WHERE user_id = ? AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)

        UNION ALL

        SELECT DATE(submitted_at) AS activity_date
        FROM quiz_attempts
        WHERE user_id = ? AND submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      ) AS weekly_activity
      GROUP BY activity_date
      ORDER BY activity_date ASC
    `,
    [userId, userId]
  );

  const countsByDate = new Map(
    rows.map((row) => [toIsoDate(row.activity_date), Number(row.activity_count) || 0])
  );
  const days = [];
  const today = new Date();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - offset);

    const dateKey = toIsoDate(date);
    const activityCount = countsByDate.get(dateKey) ?? 0;

    days.push({
      dateKey,
      label: date.toLocaleDateString("en-US", { weekday: "narrow" }),
      activityCount,
      intensity: Math.min(activityCount * 35, 100)
    });
  }

  const totalActivities = days.reduce((sum, day) => sum + day.activityCount, 0);
  const activeDays = days.filter((day) => day.activityCount > 0).length;

  return {
    days,
    totalActivities,
    activeDays,
    completedSessions: activeDays
  };
}
