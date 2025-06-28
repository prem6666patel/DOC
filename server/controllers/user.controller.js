import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function registerUserController(req, res) {
  try {
    const { name, email, password, contact, type } = req.body;

    // Validate required fields
    if (!name || !email || !password || !contact) {
      return res.status(400).json({
        message: "Name, email, password, and contact are required fields",
        error: true,
        success: false,
      });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
        error: true,
        success: false,
      });
    }

    // Validate user type if provided
    const allowedTypes = [
      "Corporate Law",
      "Criminal Defense",
      "Family Law",
      "Personal Injury",
      "Estate Planning",
      "Real Estate Law",
      "Others",
    ];

    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({
        message: `Invalid user type. Allowed types: ${allowedTypes.join(", ")}`,
        error: true,
        success: false,
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashPassword,
      contact,
      type: type || "Others", // Use default if not provided
    });

    const savedUser = await newUser.save();

    // Return response without password
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return res.status(201).json({
      message: "User registered successfully",
      data: userWithoutPassword,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("registerUserController error : ", error);

    // Handle specific Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: `Validation error: ${errors.join(", ")}`,
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const validUser = await UserModel.findOne({ email });
    if (!validUser) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Incorrect password",
        error: true,
        success: false,
      });
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Always set expiration
    );

    const { password: pass, ...rest } = validUser._doc;

    // Fixed: Only send one response
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      })
      .json({
        message: "Login successful",
        success: true,
        user: rest, // Include user data in the response
      });
  } catch (error) {
    console.log("loginUserController error : ", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}
export async function logoutController(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json("User has been signed out");
  } catch (error) {
    console.log("logoutController error : ", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function deleteUserByIdController(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        error: true,
        success: false,
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("deleteUserByIdController error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID format",
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function getAllUserController(req, res) {
  try {
    const users = await UserModel.find().select("-password");

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found",
        count: 0,
        data: [],
        error: false,
        success: true,
      });
    }
    return res.status(200).json({
      message: "All users retrieved successfully",
      count: users.length,
      data: users,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("getAllUserController error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function getUserByIdController(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("getUserByIdController error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID format",
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function updateUserByIdController(req, res) {
  try {
    const { name, email, contact, type } = req.body;
    const clientId = req.params.id;

    // Validate required fields
    if (!name || !email || !contact || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate contact number (10 digits)
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({
        success: false,
        message: "Contact number must be 10 digits",
      });
    }

    const client = await UserModel.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Check if email is being changed to an existing one
    if (email !== client.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // Update client data
    client.name = name;
    client.email = email;
    client.contact = contact;
    client.type = type;

    await client.save();

    const clientData = client.toObject();
    delete clientData.password;

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client: clientData,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating client",
      error: error.message,
    });
  }
}

export async function updateUserProfileController(req, res) {
  try {
    const { name, email, contact, currentPassword, newPassword } = req.body;
    const clientId = req.params.id;

    if (!name || !email || !contact) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and contact are required fields",
        error: true,
      });
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        error: true,
      });
    }

    // Validate contact number (10 digits)
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({
        success: false,
        message: "Contact number must be 10 digits",
        error: true,
      });
    }

    // Find the user
    const user = await UserModel.findById(clientId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: true,
      });
    }

    // Check if email is being changed to an existing one
    if (email !== user.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
          error: true,
        });
      }
    }

    // Handle password change if newPassword is provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to change password",
          error: true,
        });
      }

      // Verify current password
      const isPasswordValid = bcryptjs.compareSync(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
          error: true,
        });
      }

      // Hash and set new password
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(newPassword, salt);
    }

    // Update only allowed fields (excluding type)
    user.name = name;
    user.email = email;
    user.contact = contact;

    await user.save();

    // Prepare response without password
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: userData,
      error: false,
    });
  } catch (error) {
    console.error("updateUserProfileController error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors.join(", ")}`,
        error: true,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        error: true,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: true,
    });
  }
}
