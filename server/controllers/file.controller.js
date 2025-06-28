import FileModel from "../models/file.model.js";
import mongoose from "mongoose";

export async function uploadFileController(req, res) {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false,
      });
    }

    const base64Data = req.file.buffer.toString("base64");

    const file = new FileModel({
      userId,
      name,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      base64Data,
    });

    await file.save();

    return res.status(201).json({
      message: "File uploaded successfully",
      file,
      success: true,
    });
  } catch (error) {
    console.error("uploadFileController error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function getFileByUserIdController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "File ID is required",
        error: true,
        success: false,
      });
    }

    const files = await FileModel.find({ userId: id })
      .populate("userId")
      .exec();

    if (!files || files.length === 0) {
      return res.status(404).json({
        message: "No files found for this user",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Files retrieved successfully",
      data: files,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("getFileByUserIdController error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function deleteFileByIdController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "File ID is required",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid file ID format",
        error: true,
        success: false,
      });
    }

    const deletedFile = await FileModel.findByIdAndDelete(id);

    if (!deletedFile) {
      return res.status(404).json({
        message: "File not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "File deleted successfully",
      data: deletedFile,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("deleteFileByIdController error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function updateFileByIdController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "File ID is required",
        error: true,
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false,
      });
    }

    const updateData = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      base64Data: req.file.buffer.toString("base64"),
      uploadedAt: Date.now(),
    };

    const updatedFile = await FileModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFile) {
      return res.status(404).json({
        message: "File not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "File updated successfully",
      data: updatedFile,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("updateFileByIdController error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid file ID format",
        error: true,
        success: false,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
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

export async function getAllFileController(req, res) {
  try {
    const files = await FileModel.find().populate("userId", "name").exec();

    if (!files || files.length === 0) {
      return res.status(404).json({
        message: "No files found for this user",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Files retrieved successfully",
      data: files,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("getAllFileController error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}
