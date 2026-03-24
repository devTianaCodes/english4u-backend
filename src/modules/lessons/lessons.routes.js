import { Router } from "express";
import { getLesson } from "./lessons.controller.js";

const router = Router();

router.get("/:lessonId", getLesson);

export default router;
