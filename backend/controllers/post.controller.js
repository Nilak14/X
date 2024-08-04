import Notification from "../models/notification.model.js";
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
    const { id: postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Cannot find the post" });
    }
    const userId = res.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      //unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unlike successfully" });
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log(`Error in like Unlike post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
