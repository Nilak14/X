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

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "You cant delete this post" });
    }
    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(`Error in create post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (text.trim() === "") {
      return res.status(400).json({ error: "Comment cant be empty" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const userId = req.user._id;
    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    console.log(`Error in create post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(`Error in like Unlike post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
