import Notification from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(`Error on getUserProfile: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { xId } = req.params;
    const userToModify = await User.findById(xId);
    const currentUser = await User.findById(req.user._id);
    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    if (userToModify._id.toString() === currentUser._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cant follow/unfollow yourself" });
    }
    const isFollowing = currentUser.following.includes(xId);
    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(xId, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: xId },
      });
      res.status(200).json({ message: "User Unfollow Successfully" });
    } else {
      // follow
      await User.findByIdAndUpdate(xId, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: xId },
      });
      //todo send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user.id,
        to: xId,
      });
      if (newNotification) {
        await newNotification.save();
      }
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log(`Error on followUnfollow: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error on getSuggestedUser: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    const { profileImg, coverImg } = req.body;
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please Provide both current password and new Password",
      });
    }
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be 6 characters long" });
      }
      const isCurrentPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({ error: "Password don't match" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.coverImg = coverImg || user.coverImg;
    user.profileImg = profileImg || user.profileImg;
    user = await user.save();

    // password should be null
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log(`Error on updateUser: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
