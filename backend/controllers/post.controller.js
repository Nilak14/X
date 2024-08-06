import { json } from "express";
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
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      //unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPost: postId } });
      res.status(200).json({ message: "Post unlike successfully" });
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPost: postId } });
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

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -email",
      })
      .populate({
        path: "comments.user",
        select: "-password -email",
      });
    console.log(posts);

    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(`Error in get all post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getLikedPost = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userLikedPost = await Post.find({ _id: { $in: user.likedPost } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (userLikedPost.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(userLikedPost);
  } catch (error) {
    console.log(`Error in get Liked Post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getFollowingPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404), json({ error: "User not found" });
    }
    const followingPost = await Post.find({
      user: { $in: user.following },
    })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password -email" })
      .populate({ path: "comments.user", select: "-password -email" });

    if (followingPost.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(followingPost);
  } catch (error) {
    console.log(`Error in get following Post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
export const getUserPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userPost = await Post.find({ user: { $in: user._id } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password -email" })
      .populate({ path: "comments.user", select: "-password -email" });
    if (userPost.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(userPost);
  } catch (error) {
    console.log(`Error in get getUser Post ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
