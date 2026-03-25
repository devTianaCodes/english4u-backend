import { buildLearnerPath, dashboardSnapshot } from "../../utils/demo-data.js";
import { getLatestPlacementAttempt } from "../onboarding/onboarding.repository.js";
import { getCompletedLessonSlugs, getProgressSnapshot } from "../progress/progress.repository.js";

export async function getDashboard(req, res, next) {
  try {
    const snapshot = await getProgressSnapshot(req.user.id);
    const latestPlacement = await getLatestPlacementAttempt(req.user.id);
    const currentLevel = latestPlacement?.recommendedLevel ?? dashboardSnapshot.currentLevel;
    const completedLessonSlugs = await getCompletedLessonSlugs(req.user.id);
    const learnerPath = buildLearnerPath(currentLevel, completedLessonSlugs);

    return res.json({
      ...dashboardSnapshot,
      learner: {
        id: req.user.id,
        name: `${req.user.firstName} ${req.user.lastName}`.trim(),
        role: req.user.role
      },
      streak: snapshot.streak,
      currentLevel,
      currentCourse: learnerPath.courseTitle,
      nextLesson: learnerPath.nextLesson,
      completedLessonSlugs: learnerPath.completedLessonSlugs,
      completedLessons: snapshot.completedLessons,
      quizAverage: snapshot.quizAverage
    });
  } catch (error) {
    return next(error);
  }
}
