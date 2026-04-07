import { Router } from "express";
import { getPlacementHistory, getRecommendation, submitPlacementTest } from "./onboarding.controller.js";

const router = Router();

router.post("/placement-test", submitPlacementTest);
router.get("/history", getPlacementHistory);
router.get("/recommendation", getRecommendation);

export default router;
