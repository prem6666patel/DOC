import { Router } from "express";
import { auth } from "../middleware/authMiddleware.js";
import upload from "../middleware/base64Upload.js";
import {
  uploadFileController,
  getFileByUserIdController,
  deleteFileByIdController,
  updateFileByIdController,
  getAllFileController,
} from "../controllers/file.controller.js";

const fileRouter = Router();

fileRouter.post("/upload", auth, upload.single("file"), uploadFileController);
fileRouter.get("/get/:id", auth, getFileByUserIdController);
fileRouter.get("/getAll", auth, getAllFileController);
fileRouter.delete("/delete/:id", auth, deleteFileByIdController);
fileRouter.put(
  "/update/:id",
  auth,
  upload.single("file"),
  updateFileByIdController
);

export default fileRouter;
