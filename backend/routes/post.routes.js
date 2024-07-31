import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost } from "../controllers/post.controller.js";

const router = Router();

router.post("/create", protectRoute, createPost);
// router.post("/delete", protectRoute, deletePost);
// router.post("/like/:id", protectRoute, likeUnlikePost);
// router.post("/comment/:id", protectRoute, commentPost);

export default router;
