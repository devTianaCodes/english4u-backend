import { Router } from "express";
import { getReview, submitReviewSession } from "./review.controller.js";

const router = Router();

router.get("/me", getReview);
router.post("/session", submitReviewSession);

export default router;
