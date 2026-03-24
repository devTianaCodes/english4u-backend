import { dashboardSnapshot } from "../../utils/demo-data.js";

export function getMyProgress(req, res) {
  res.json({
    userId: req.user?.id ?? null,
    streak: dashboardSnapshot.streak,
    completedLessons: dashboardSnapshot.completedLessons,
    quizAverage: dashboardSnapshot.quizAverage
  });
}

export function completeLesson(req, res) {
  res.status(201).json({
    userId: req.user?.id ?? null,
    lessonId: req.params.lessonId,
    status: "completed"
  });
}
