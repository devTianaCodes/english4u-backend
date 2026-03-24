import { env } from "../config/env.js";
import { findUserById } from "../modules/auth/auth.repository.js";
import { verifyAuthToken } from "../modules/auth/auth.service.js";

export async function attachCurrentUser(req, _res, next) {
  try {
    const authorizationHeader = req.header("authorization");
    const bearerToken = authorizationHeader?.startsWith("Bearer ")
      ? authorizationHeader.slice("Bearer ".length).trim()
      : null;
    const token = req.cookies?.[env.authCookieName] ?? bearerToken;

    if (!token) {
      return next();
    }

    const payload = verifyAuthToken(token);

    if (!payload?.sub) {
      return next();
    }

    const user = await findUserById(Number(payload.sub));

    if (user) {
      req.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  return next();
}

export function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
}
