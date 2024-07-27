import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/profile/:username", protectRoute, getUserProfile);
// router.get("/suggested", protectRoute, getUserProfile);
router.post("/follow/:xId", protectRoute, followUnfollowUser);
// router.post("/update/:id", protectRoute, updateUserProfile);

export default router;
