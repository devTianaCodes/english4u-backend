import { Router } from "express";
import { getDashboard } from "./dashboard.controller.js";

const router = Router();

router.get("/me", getDashboard);

export default router;
