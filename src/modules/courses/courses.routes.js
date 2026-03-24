import { Router } from "express";
import { getCourse, getUnit, listCourses, listLevels } from "./courses.controller.js";

const router = Router();

router.get("/levels/all", listLevels);
router.get("/units/:unitId", getUnit);
router.get("/", listCourses);
router.get("/:courseId", getCourse);

export default router;
