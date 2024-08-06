import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getAllNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/", protectRoute, getAllNotification);
router.delete("/", protectRoute, deleteNotification);

export default router;
