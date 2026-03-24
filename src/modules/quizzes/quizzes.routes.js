import { Router } from "express";
import { submitQuiz } from "./quizzes.controller.js";

const router = Router();

router.post("/:quizId/submit", submitQuiz);

export default router;
