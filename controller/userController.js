const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const mongoose = require("mongoose");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "firstName lastName email image createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .select("title content image createdAt updatedAt published");

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      blogs,
      isOwnProfile: true,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAnyUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blogs = await Blog.find({ author: new mongoose.Types.ObjectId(id) })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ user, blogs });
  } catch (err) {
    console.error("Error in getAnyUserProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName: firstName || req.user.firstName,
        lastName: lastName || req.user.lastName,
        bio: bio !== undefined ? bio : req.user.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message, 
    });
  }
};

module.exports = {
  getUserProfile,
  getAnyUserProfile,
  updateProfile,
};
