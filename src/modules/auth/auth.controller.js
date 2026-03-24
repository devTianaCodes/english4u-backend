export function register(_req, res) {
  res.status(201).json({
    message: "Registration scaffold ready",
    nextPhase: "Persist users and hash passwords in MySQL"
  });
}

export function login(_req, res) {
  res.json({
    message: "Login scaffold ready",
    nextPhase: "Issue JWT or session cookie after credential validation"
  });
}

export function logout(_req, res) {
  res.status(204).send();
}

export function me(req, res) {
  res.json({
    user: req.user ?? null
  });
}
