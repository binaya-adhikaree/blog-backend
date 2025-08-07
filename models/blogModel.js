const mongoose = require("mongoose");
require("./userModel");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    reactions: {
      love: {
        type: Number,
        default: 0,
      },
    },
    favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
