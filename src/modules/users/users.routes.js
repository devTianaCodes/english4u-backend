import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getProfile } from "./users.controller.js";

const router = Router();

router.get("/me", requireAuth, getProfile);

export default router;
