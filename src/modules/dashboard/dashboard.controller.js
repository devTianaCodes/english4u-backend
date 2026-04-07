import { buildLearnerPath, dashboardSnapshot } from "../../utils/demo-data.js";
import { getLatestPlacementAttempt } from "../onboarding/onboarding.repository.js";
import { getCompletedLessonSlugs, getProgressSnapshot, getWeeklyActivitySummary } from "../progress/progress.repository.js";
import { buildReviewPayload } from "../review/review.service.js";
import { getStudyPlan } from "../study-plan/study-plan.repository.js";

function getReviewPathForFocus(focus) {
  if (focus === "Grammar accuracy") {
    return "/review/grammar";
  }

  if (focus === "Vocabulary growth") {
    return "/review/vocabulary";
  }

  if (focus === "Reading fluency") {
    return "/review/warm-up";
  }

  return "/review";
}

function buildCoachRecommendation({ currentLevel, nextLesson, reviewDueCount, studyPlan, weeklyActivity }) {
  const focus = studyPlan.focus;
  const reviewPath = getReviewPathForFocus(focus);
  const plannedSessions = studyPlan.sessionsPerWeek;
  const completedSessions = weeklyActivity.completedSessions;
  const isOnPace = completedSessions >= plannedSessions;

  if (!isOnPace) {
    return {
      title: "Protect your weekly rhythm",
      message: `You planned ${plannedSessions} sessions and completed ${completedSessions}. Short sessions now will keep the path realistic.`,
      ctaLabel: "Open study plan",
      ctaPath: "/study-plan"
    };
  }

  if (reviewDueCount > 0) {
    return {
      title: "Convert progress into retention",
      message: `${reviewDueCount} review prompt${reviewDueCount === 1 ? "" : "s"} are ready. Use the ${focus.toLowerCase()} lane before your next checkpoint.`,
      ctaLabel: "Open focus review",
      ctaPath: reviewPath
    };
  }

  if (nextLesson) {
    return {
      title: "Stay inside the path",
      message: `Your next best move is ${nextLesson.title} in ${currentLevel}. Finish that lesson before opening another course.`,
      ctaLabel: "Continue lesson",
      ctaPath: `/lessons/${nextLesson.id}`
    };
  }

  return {
    title: "Keep the momentum alive",
    message: `Your ${focus.toLowerCase()} plan is stable. Browse the course path and choose the next short session.`,
    ctaLabel: "Browse courses",
    ctaPath: "/courses"
  };
}

export async function getDashboard(req, res, next) {
  try {
    const snapshot = await getProgressSnapshot(req.user.id);
    const latestPlacement = await getLatestPlacementAttempt(req.user.id);
    const currentLevel = latestPlacement?.recommendedLevel ?? dashboardSnapshot.currentLevel;
    const completedLessonSlugs = await getCompletedLessonSlugs(req.user.id);
    const learnerPath = buildLearnerPath(currentLevel, completedLessonSlugs);
    const review = await buildReviewPayload(req.user.id);
    const studyPlan = await getStudyPlan(req.user.id);
    const weeklyActivity = await getWeeklyActivitySummary(req.user.id);
    const coachRecommendation = buildCoachRecommendation({
      currentLevel,
      nextLesson: learnerPath.nextLesson,
      reviewDueCount: review.dueCount,
      studyPlan,
      weeklyActivity
    });

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
      quizAverage: snapshot.quizAverage,
      reviewDueCount: review.dueCount,
      studyPlan,
      coachRecommendation,
      weeklyActivity: {
        ...weeklyActivity,
        plannedSessions: studyPlan.sessionsPerWeek,
        plannedMinutes: studyPlan.sessionsPerWeek * studyPlan.minutesPerSession,
        completedMinutes: weeklyActivity.completedSessions * studyPlan.minutesPerSession
      }
    });
  } catch (error) {
    return next(error);
  }
}
