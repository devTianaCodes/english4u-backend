import { getLatestPlacementAttempt, getPlacementAttempts } from "../onboarding/onboarding.repository.js";

export async function getProfile(req, res, next) {
  try {
    const latestAttempt = req.user ? await getLatestPlacementAttempt(req.user.id) : null;
    const attempts = req.user ? await getPlacementAttempts(req.user.id, 3) : [];

    return res.json({
      profile: req.user
        ? {
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            role: req.user.role,
            targetLevel: latestAttempt?.recommendedLevel ?? "B1",
            placementScore: latestAttempt?.score ?? null,
            placementTakenAt: latestAttempt?.createdAt ?? null,
            placementHistory: attempts
          }
        : null
    });
  } catch (error) {
    return next(error);
  }
}
