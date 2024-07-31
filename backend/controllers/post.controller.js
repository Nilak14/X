import Post from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    let { text, image } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!text && !image) {
      return res.status(400).json({ error: "Post is not valid" });
    }
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    if (image) {
      const uploaderResponse = await cloudinary.uploader.upload(img);
      image = uploaderResponse.secure_url;
    }
    const userPost = new Post({
      user: userId,
      text,
      image,
    });
    if (!userPost) {
      return req.status(500).json({ error: "Failed to crete post" });
    }
    await userPost.save();
    return res.status(200).json(userPost);
  } catch (error) {
    console.log(`Error in create post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
