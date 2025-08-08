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
  getFavouriteBlogs,
} = require("../controller/blogController");

router.post("/create", authenticateUser, upload.single("image"), createBlog);

router.get("/favourites", authenticateUser, getFavouriteBlogs);
router.post("/favourite/:id", authenticateUser, toggleFavourite);

router.get("/all", getAllBlogs);

router.post("/react/:id", authenticateUser, toggleLove);

router.put("/update/:id", authenticateUser, updateBlog);
router.delete("/:id", authenticateUser, deleteBlog);

router.get("/:id", getBlogById);

module.exports = router;
