import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  getLikedPost,
  likeUnlikePost,
  getFollowingPost,
  getUserPost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentPost);
router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPost);
router.get("/likedPost/:id", protectRoute, getLikedPost);
router.get("/user/:username", protectRoute, getUserPost);

export default router;
