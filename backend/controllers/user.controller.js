import { User } from "../models/user.model.js";

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
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log(`Error on followUnfollow: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
