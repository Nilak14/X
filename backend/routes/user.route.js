import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getSuggestedUser,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUser);
router.post("/follow/:xId", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);

export default router;
