import { pool } from "../../db/pool.js";

function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role_name,
    passwordHash: row.password_hash,
    createdAt: row.created_at
  };
}

async function ensureRoleExistsWithConnection(connection, roleName) {
  const [existingRoles] = await connection.execute("SELECT id, name FROM roles WHERE name = ? LIMIT 1", [roleName]);

  if (existingRoles.length > 0) {
    return existingRoles[0];
  }

  const [insertResult] = await connection.execute("INSERT INTO roles (name) VALUES (?)", [roleName]);

  return {
    id: insertResult.insertId,
    name: roleName
  };
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `
      SELECT u.id, u.first_name, u.last_name, u.email, u.password_hash, u.created_at, r.name AS role_name
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.email = ?
      LIMIT 1
    `,
    [email]
  );

  return mapUserRow(rows[0]);
}

export async function findUserById(id) {
  const [rows] = await pool.execute(
    `
      SELECT u.id, u.first_name, u.last_name, u.email, u.password_hash, u.created_at, r.name AS role_name
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.id = ?
      LIMIT 1
    `,
    [id]
  );

  return mapUserRow(rows[0]);
}

export async function createUser({ firstName, lastName, email, passwordHash, roleName }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [insertResult] = await connection.execute(
      `
        INSERT INTO users (first_name, last_name, email, password_hash)
        VALUES (?, ?, ?, ?)
      `,
      [firstName, lastName, email, passwordHash]
    );

    const role = await ensureRoleExistsWithConnection(connection, roleName);

    await connection.execute(
      `
        INSERT INTO user_roles (user_id, role_id)
        VALUES (?, ?)
      `,
      [insertResult.insertId, role.id]
    );

    await connection.commit();

    return findUserById(insertResult.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
