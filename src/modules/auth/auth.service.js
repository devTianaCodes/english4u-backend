import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { HttpError } from "../../utils/http-error.js";
import { createUser, findUserByEmail } from "./auth.repository.js";

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function validateRegistrationInput({ firstName, lastName, email, password }) {
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
    throw new HttpError(400, "First name, last name, email, and password are required");
  }

  if (password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters long");
  }
}

export async function registerUser(input) {
  const firstName = input.firstName?.trim();
  const lastName = input.lastName?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  validateRegistrationInput({ firstName, lastName, email, password });

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await createUser({
    firstName,
    lastName,
    email,
    passwordHash,
    roleName: env.adminEmails.includes(email) ? "admin" : "student"
  });

  return normalizeUser(user);
}

export async function loginUser(input) {
  const email = input.email?.trim().toLowerCase();
  const password = input.password ?? "";

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  return normalizeUser(user);
}

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}

export function setAuthCookie(res, user) {
  const token = signAuthToken(user);
  const sameSite = env.nodeEnv === "production" ? "none" : "lax";

  res.cookie(env.authCookieName, token, {
    httpOnly: true,
    sameSite,
    secure: env.nodeEnv === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearAuthCookie(res) {
  const sameSite = env.nodeEnv === "production" ? "none" : "lax";

  res.clearCookie(env.authCookieName, {
    httpOnly: true,
    sameSite,
    secure: env.nodeEnv === "production"
  });
}
