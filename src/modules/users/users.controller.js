export function getProfile(req, res) {
  res.json({
    profile: req.user
      ? {
          id: req.user.id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          role: req.user.role,
          targetLevel: "B1"
        }
      : null
  });
}
