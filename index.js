require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://bloghora.netlify.app",
    credentials: true,
  })
);

const authRoutes = require("./routes/authRoute");
const blogRoutes = require("./routes/blogRoutes");
const userRoute = require("./routes/userRoute");
const commentRoute = require("./routes/commentRoutes");

app.use("/api", authRoutes);
app.use("/blog", blogRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRoute);

app.use("/api/comments", commentRoute);

app.get("/", (req, res) => {
  res.send("hello from homepage");
});

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

connectDB();

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server live at http://localhost:${port}`));
