import { clearAuthCookie, loginUser, registerUser, setAuthCookie } from "./auth.service.js";

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body ?? {});

    setAuthCookie(res, user);

    return res.status(201).json({
      user
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await loginUser(req.body ?? {});

    setAuthCookie(res, user);

    return res.json({
      user
    });
  } catch (error) {
    return next(error);
  }
}

export function logout(_req, res) {
  clearAuthCookie(res);
  res.status(204).send();
}

export function me(req, res) {
  res.json({
    user: req.user ?? null
  });
}
