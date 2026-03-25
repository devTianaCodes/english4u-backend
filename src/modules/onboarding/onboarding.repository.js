import { pool } from "../../db/pool.js";

export async function savePlacementAttempt(userId, score, recommendedLevel) {
  await pool.execute(
    `
      INSERT INTO placement_attempts (user_id, score, recommended_level)
      VALUES (?, ?, ?)
    `,
    [userId, score, recommendedLevel]
  );
}

export async function getLatestPlacementAttempt(userId) {
  const [rows] = await pool.execute(
    `
      SELECT id, score, recommended_level, created_at
      FROM placement_attempts
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT 1
    `,
    [userId]
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    id: rows[0].id,
    score: rows[0].score,
    recommendedLevel: rows[0].recommended_level,
    createdAt: rows[0].created_at
  };
}
