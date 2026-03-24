import { Router } from "express";
import { requireRole } from "../../middleware/auth.js";
import {
  createAdminCollectionItem,
  deleteAdminCollectionItem,
  listAdminCollection,
  updateAdminCollectionItem
} from "./admin.controller.js";

const router = Router();

router.use(requireRole("admin"));
router.get("/:collection", listAdminCollection);
router.post("/:collection", createAdminCollectionItem);
router.put("/:collection/:id", updateAdminCollectionItem);
router.delete("/:collection/:id", deleteAdminCollectionItem);

export default router;
