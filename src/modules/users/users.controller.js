export function getProfile(req, res) {
  res.json({
    profile: req.user
      ? {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          targetLevel: "B1"
        }
      : null
  });
}
