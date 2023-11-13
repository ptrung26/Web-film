import mongoose from "mongoose";
import modelOptions from "./modelOption.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    color: {
      type: String,
    },
  },
  modelOptions
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
