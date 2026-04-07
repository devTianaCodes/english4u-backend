import { HttpError } from "../../utils/http-error.js";
import { dashboardSnapshot, resolvePersistedLessonId } from "../../utils/demo-data.js";
import { getProgressSnapshot, isSeedPersistenceError, markLessonCompleted } from "./progress.repository.js";

export async function getMyProgress(req, res, next) {
  try {
    const snapshot = await getProgressSnapshot(req.user.id);

    return res.json({
      userId: req.user.id,
      ...snapshot
    });
  } catch (error) {
    return next(error);
  }
}

export async function completeLesson(req, res, next) {
  try {
    const persistedLessonId = resolvePersistedLessonId(req.params.lessonId);

    if (!persistedLessonId) {
      return res.status(201).json({
        userId: req.user.id,
        lessonId: req.params.lessonId,
        status: "completed_demo",
        message: "This lesson uses demo completion only for now."
      });
    }

    let streak;
    let snapshot;

    try {
      streak = await markLessonCompleted(req.user.id, persistedLessonId);
      snapshot = await getProgressSnapshot(req.user.id);
    } catch (error) {
      if (isSeedPersistenceError(error)) {
        return res.status(201).json({
          userId: req.user.id,
          lessonId: req.params.lessonId,
          status: "completed_demo",
          message: "This lesson is not present in the imported SQL yet. Re-import the latest export to persist it in MySQL."
        });
      }

      throw error;
    }

    return res.status(201).json({
      userId: req.user.id,
      lessonId: req.params.lessonId,
      status: "completed",
      streak: streak.currentStreak,
      completedLessons: snapshot.completedLessons
    });
  } catch (error) {
    return next(new HttpError(500, error.message));
  }
}
