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
      .populate("author", "firstName lastName")
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
      return res.status(403).json({ message: "Not authorized to update this blog" });
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


module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
};
