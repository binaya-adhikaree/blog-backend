const express = require("express");
const router = express.Router();
const {
  getBlogComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} = require("../controller/commentController");

const authenticateUser = require("../middlewares/authenticateUser");

router.get("/:blogId", getBlogComments);

router.post("/:blogId", authenticateUser, addComment);

router.put("/update/:commentId", authenticateUser, updateComment);

router.delete("/:commentId", authenticateUser, deleteComment);

router.post("/like/:commentId", authenticateUser, toggleCommentLike);

module.exports = router;
