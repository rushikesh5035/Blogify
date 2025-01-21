require("dotenv").config();

const path = require("path");
const express = require("express");
const cookiePaser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8000;

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const Blog = require("./models/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const { default: mongoose } = require("mongoose");

// view - EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error", err));

console.log("MONGO_URL:", process.env.MONGO_URL);

// Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, (req, res) => {
  console.log("server Started at PORT", PORT);
});
