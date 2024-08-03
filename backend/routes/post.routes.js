import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost,
  createPost,
  deletePost,
  likeUnlikePost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentPost);

export default router;
