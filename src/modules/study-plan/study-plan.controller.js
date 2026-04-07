import { getStudyPlan, saveStudyPlan } from "./study-plan.repository.js";
import { getWeeklyActivitySummary } from "../progress/progress.repository.js";

function buildPaceLabel(plan, weeklyActivity) {
  if (weeklyActivity.completedSessions >= plan.sessionsPerWeek) {
    return "On pace";
  }

  if (weeklyActivity.completedSessions >= Math.max(plan.sessionsPerWeek - 1, 1)) {
    return "Nearly on pace";
  }

  return "Needs attention";
}

export async function getMyStudyPlan(req, res, next) {
  try {
    const studyPlan = await getStudyPlan(req.user.id);
    const weeklyActivity = await getWeeklyActivitySummary(req.user.id);

    return res.json({
      studyPlan,
      weeklyActivity: {
        ...weeklyActivity,
        plannedSessions: studyPlan.sessionsPerWeek,
        plannedMinutes: studyPlan.sessionsPerWeek * studyPlan.minutesPerSession,
        completedMinutes: weeklyActivity.completedSessions * studyPlan.minutesPerSession,
        remainingSessions: Math.max(studyPlan.sessionsPerWeek - weeklyActivity.completedSessions, 0),
        paceLabel: buildPaceLabel(studyPlan, weeklyActivity)
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateMyStudyPlan(req, res, next) {
  try {
    const studyPlan = await saveStudyPlan(req.user.id, req.body);
    const weeklyActivity = await getWeeklyActivitySummary(req.user.id);

    return res.json({
      studyPlan,
      weeklyActivity: {
        ...weeklyActivity,
        plannedSessions: studyPlan.sessionsPerWeek,
        plannedMinutes: studyPlan.sessionsPerWeek * studyPlan.minutesPerSession,
        completedMinutes: weeklyActivity.completedSessions * studyPlan.minutesPerSession,
        remainingSessions: Math.max(studyPlan.sessionsPerWeek - weeklyActivity.completedSessions, 0),
        paceLabel: buildPaceLabel(studyPlan, weeklyActivity)
      }
    });
  } catch (error) {
    return next(error);
  }
}
