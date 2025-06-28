import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name must be required"],
    },
    email: {
      type: String,
      required: [true, "email must be required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password must be required"],
    },
    contact: {
      type: Number,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: [
        "Corporate Law",
        "Criminal Defense",
        "Family Law",
        "Personal Injury",
        "Estate Planning",
        "Real Estate Law",
        "Others",
      ],
      default: "Others",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
