import { pool } from "../../db/pool.js";

const fallbackPlans = new Map();

const defaultStudyPlan = {
  sessionsPerWeek: 4,
  minutesPerSession: 20,
  focus: "Speaking confidence"
};

function isMissingTableError(error) {
  return error?.code === "ER_NO_SUCH_TABLE";
}

function normalizeStudyPlan(input = {}) {
  return {
    sessionsPerWeek: Math.min(Math.max(Number(input.sessionsPerWeek) || defaultStudyPlan.sessionsPerWeek, 1), 7),
    minutesPerSession: Math.min(Math.max(Number(input.minutesPerSession) || defaultStudyPlan.minutesPerSession, 10), 90),
    focus: String(input.focus || defaultStudyPlan.focus).trim() || defaultStudyPlan.focus
  };
}

function readFallbackPlan(userId) {
  return fallbackPlans.get(userId) ?? defaultStudyPlan;
}

export async function getStudyPlan(userId) {
  try {
    const [[row]] = await pool.execute(
      `
        SELECT sessions_per_week, minutes_per_session, focus, updated_at
        FROM study_plans
        WHERE user_id = ?
        LIMIT 1
      `,
      [userId]
    );

    if (!row) {
      return {
        ...defaultStudyPlan,
        updatedAt: null
      };
    }

    return {
      sessionsPerWeek: row.sessions_per_week,
      minutesPerSession: row.minutes_per_session,
      focus: row.focus,
      updatedAt: row.updated_at ?? null
    };
  } catch (error) {
    if (isMissingTableError(error)) {
      return {
        ...readFallbackPlan(userId),
        updatedAt: null
      };
    }

    throw error;
  }
}

export async function saveStudyPlan(userId, payload) {
  const plan = normalizeStudyPlan(payload);

  try {
    await pool.execute(
      `
        INSERT INTO study_plans (user_id, sessions_per_week, minutes_per_session, focus)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          sessions_per_week = VALUES(sessions_per_week),
          minutes_per_session = VALUES(minutes_per_session),
          focus = VALUES(focus)
      `,
      [userId, plan.sessionsPerWeek, plan.minutesPerSession, plan.focus]
    );

    return getStudyPlan(userId);
  } catch (error) {
    if (isMissingTableError(error)) {
      fallbackPlans.set(userId, plan);

      return {
        ...plan,
        updatedAt: null
      };
    }

    throw error;
  }
}
