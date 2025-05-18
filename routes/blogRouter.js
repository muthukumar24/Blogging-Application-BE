import express from "express";
import authUser from "../middleware/auth.js";
import {
  allBlogs,
  getAuthors,
  getCategory,
  filterByCategoryAndAuthor,
  userBlog,
  viewBlog,
  addBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";

const blogRouter = express.Router();

blogRouter.get("/all-blogs", authUser, allBlogs);
blogRouter.get("/authors", authUser, getAuthors);
blogRouter.get("/category", authUser, getCategory);
blogRouter.get("/filter-blogs", authUser, filterByCategoryAndAuthor);
blogRouter.get("/user-blog", authUser, userBlog);
blogRouter.get("/view-blog/:blogId", authUser, viewBlog);
blogRouter.post("/add", authUser, upload.single("image"), addBlog);
blogRouter.put("/update/:id", authUser, upload.single("image"), updateBlog);
blogRouter.delete("/delete/:id", authUser, deleteBlog);

export default blogRouter;
