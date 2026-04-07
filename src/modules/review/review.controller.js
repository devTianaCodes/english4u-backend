import { buildReviewPayload, scoreReviewSession } from "./review.service.js";

export async function getReview(req, res, next) {
  try {
    const { answerKey, ...review } = await buildReviewPayload(req.user.id);
    return res.json(review);
  } catch (error) {
    return next(error);
  }
}

export async function submitReviewSession(req, res, next) {
  try {
    const result = await scoreReviewSession(req.user.id, req.body?.answers);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
