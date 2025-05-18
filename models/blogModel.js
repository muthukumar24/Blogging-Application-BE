import mongoose, { mongo } from "mongoose";

const blogScehma = mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
  },
  { timestamps: true }
);

const blogModel = mongoose.models.blog || mongoose.model('blog', blogScehma);

export default blogModel;