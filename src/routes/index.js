import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import coursesRoutes from "../modules/courses/courses.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import grammarRoutes from "../modules/grammar/grammar.routes.js";
import lessonsRoutes from "../modules/lessons/lessons.routes.js";
import onboardingRoutes from "../modules/onboarding/onboarding.routes.js";
import progressRoutes from "../modules/progress/progress.routes.js";
import quizzesRoutes from "../modules/quizzes/quizzes.routes.js";
import reviewRoutes from "../modules/review/review.routes.js";
import studyPlanRoutes from "../modules/study-plan/study-plan.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/onboarding", requireAuth, onboardingRoutes);
router.use("/courses", coursesRoutes);
router.use("/grammar-topics", grammarRoutes);
router.use("/lessons", lessonsRoutes);
router.use("/quizzes", requireAuth, quizzesRoutes);
router.use("/progress", requireAuth, progressRoutes);
router.use("/review", requireAuth, reviewRoutes);
router.use("/study-plan", requireAuth, studyPlanRoutes);
router.use("/dashboard", requireAuth, dashboardRoutes);
router.use("/users", usersRoutes);
router.use("/admin", adminRoutes);

export default router;
