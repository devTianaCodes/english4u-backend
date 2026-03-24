import { Router } from "express";
import { getRecommendation, submitPlacementTest } from "./onboarding.controller.js";

const router = Router();

router.post("/placement-test", submitPlacementTest);
router.get("/recommendation", getRecommendation);

export default router;
