const Blog = require("../models/blogModel");

const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const blog = new Blog({
      title,
      content,
      image,
      author: req.user.id,
    });
    await blog.save();
    res.status(201).json({ blog });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getBlogById = async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id).populate(
      "author",
      "firstName lastName"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check authorization
    if (blog.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this blog" });
    }

    // Proceed to update
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const toggleLove = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const alreadyLiked = blog.lovedBy.some(
      (id) => id.toString() === userId.toString()
    );

    const updateOperation = alreadyLiked
      ? {
          $pull: { lovedBy: userId },
          $inc: { "reactions.love": -1 },
        }
      : {
          $addToSet: { lovedBy: userId },
          $inc: { "reactions.love": 1 },
        };

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateOperation, {
      new: true,
    });

    res.status(200).json({
      message: alreadyLiked ? "unliked the blog" : "liked the blog",
      totalLovers: Math.max(0, updatedBlog.reactions.love),
      lovedByUser: !alreadyLiked,
    });
  } catch (error) {
    console.error("Toggle love error", error);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleFavourite = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const index = blog.favouritedBy.indexOf(userId);

    if (index === -1) {
      blog.favouritedBy.push(userId);
    } else {
      blog.favouritedBy.splice(index, 1);
    }

    await blog.save();
    res.status(200).json({
      success: true,
      favouritedBy: blog.favouritedBy,
      isFavourited: index === -1,
    });
  } catch (err) {
    console.error("Toggle favourite error:", err);
    res.status(500).json({ error: "Failed to toggle favourite" });
  }
};

const getFavouriteBlogs = async (req, res) => {
  const userId = req.user.id;

  try {
    const blogs = await Blog.find({ favouritedBy: userId }).populate(
      "author",
      "firstName lastName"
    );
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Get favourites error", error);
    res.status(500).json({ error: "failed to get favourite" });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
  toggleLove,
  toggleFavourite,
  getFavouriteBlogs,
};
