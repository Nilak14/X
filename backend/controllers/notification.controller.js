import Notification from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const getAllNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.find({ to: userId })
      .sort({ updatedAt: -1 })
      .populate({ path: "from", select: "username profileImg" });
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notification);
  } catch (error) {
    console.log(`Error in get getAllNotification ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notification Deleted Successfully" });
  } catch (error) {
    console.log(`Error in get deleteNotification ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
