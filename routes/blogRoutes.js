const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authenticateUser");
const upload = require("../middlewares/uploadImage");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
  toggleFavourite,
  toggleLove,
} = require("../controller/blogController");

router.post("/create", authenticateUser, upload.single("image"), createBlog);
router.delete("/:id", authenticateUser, deleteBlog);
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/update/:id", authenticateUser, updateBlog);


module.exports = router;
