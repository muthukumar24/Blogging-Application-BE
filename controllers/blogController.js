import { v2 as cloudinary } from "cloudinary";
import blogModel from "../models/blogModel.js";

// Get All Blogs
export const allBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find({});
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Current User's Blogs
export const userBlog = async (req, res) => {
  try {
    const userId = req.userId;

    const blogs = await blogModel.find({ createdBy: userId });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Category
export const getCategory = async (req, res) => {
  try {
    const category = await blogModel.distinct("category");

    res.status(200).json({
      success: true,
      category
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get All Authors
export const getAuthors = async (req, res) => {
  try {
    const authors = await blogModel.distinct("author");

    res.status(200).json({
      success: true,
      authors
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}



// Filter Blog by Category and Author and Both
export const filterByCategoryAndAuthor = async (req, res) => {
  try {
    const { category, author } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (author) filter.author = author;

    const blogs = await blogModel.find(filter);

    if (blogs.length === 0) {
      return res.status(200).json({
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To View a Blog
export const viewBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const resultBlog = await blogModel.findById(blogId);

    if (!resultBlog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found" 
      });
    }

    res.status(200).json({
      success: true,
      resultBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To add a blog
export const addBlog = async (req, res) => {
  try {
    const { title, category, author, content } = req.body;
    const image = req.file; // multer parses single image as req.file

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    const imageUrl = result.secure_url;

    const newBlog = new blogModel({
      title,
      category,
      author,
      content,
      image: imageUrl,
      createdBy: req.userId,
    });

    await newBlog.save();

    res.status(200).json({
      success: true,
      message: "Blog Added Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To Update a blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, author, content } = req.body;
    const image = req.file;

    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });
    const imageUrl = result.secure_url;

    const updateBlogData = {
      title,
      category,
      author,
      content,
    };

    if (imageUrl.length > 0) {
      updateBlogData.image = imageUrl;
    }

    const updatedBlogData = await blogModel.findByIdAndUpdate(
      id,
      updateBlogData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      blog: updatedBlogData,
      message: "Blog Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a Blog
export const deleteBlog = async (req, res) => {
  try {
    await blogModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};