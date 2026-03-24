export function attachDemoUser(req, _res, next) {
  const role = req.header("x-demo-role");

  if (role === "admin") {
    req.user = { id: 1, email: "admin@english4u.local", role: "admin" };
  } else if (role === "student") {
    req.user = { id: 2, email: "student@english4u.local", role: "student" };
  }

  next();
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
