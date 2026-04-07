import { buildReviewPayload, scoreReviewSession } from "./review.service.js";

export async function getReview(req, res, next) {
  try {
    const mode = typeof req.query?.mode === "string" ? req.query.mode : "all";
    const { answerKey, ...review } = await buildReviewPayload(req.user.id, mode);
    return res.json(review);
  } catch (error) {
    return next(error);
  }
}

export async function submitReviewSession(req, res, next) {
  try {
    const mode = typeof req.body?.mode === "string" ? req.body.mode : "all";
    const result = await scoreReviewSession(req.user.id, req.body?.answers, mode);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
