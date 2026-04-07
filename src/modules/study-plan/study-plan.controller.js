import { getStudyPlan, saveStudyPlan } from "./study-plan.repository.js";

export async function getMyStudyPlan(req, res, next) {
  try {
    const studyPlan = await getStudyPlan(req.user.id);
    return res.json({ studyPlan });
  } catch (error) {
    return next(error);
  }
}

export async function updateMyStudyPlan(req, res, next) {
  try {
    const studyPlan = await saveStudyPlan(req.user.id, req.body);
    return res.json({ studyPlan });
  } catch (error) {
    return next(error);
  }
}
