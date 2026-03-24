import { Router } from "express";
import { getQuiz, submitQuiz } from "./quizzes.controller.js";

const router = Router();

router.get("/:quizId", getQuiz);
router.post("/:quizId/submit", submitQuiz);

export default router;
