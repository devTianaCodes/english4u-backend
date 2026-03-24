import { dashboardSnapshot } from "../../utils/demo-data.js";

export function getMyProgress(_req, res) {
  res.json({
    streak: dashboardSnapshot.streak,
    completedLessons: dashboardSnapshot.completedLessons,
    quizAverage: dashboardSnapshot.quizAverage
  });
}

export function completeLesson(req, res) {
  res.status(201).json({
    lessonId: req.params.lessonId,
    status: "completed"
  });
}
