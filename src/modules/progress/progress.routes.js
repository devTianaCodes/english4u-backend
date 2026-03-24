import { Router } from "express";
import { completeLesson, getMyProgress } from "./progress.controller.js";

const router = Router();

router.get("/me", getMyProgress);
router.post("/lessons/:lessonId/complete", completeLesson);

export default router;
