import { Router } from "express";
import { getMyStudyPlan, updateMyStudyPlan } from "./study-plan.controller.js";

const router = Router();

router.get("/me", getMyStudyPlan);
router.put("/me", updateMyStudyPlan);

export default router;
