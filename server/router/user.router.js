import { Router } from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  deleteUserByIdController,
  getAllUserController,
  getUserByIdController,
  updateUserByIdController,
  updateUserProfileController,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.delete("/delete/:id", auth, deleteUserByIdController);
userRouter.get("/getAll", auth, getAllUserController);
userRouter.get("/get/:id", auth, getUserByIdController);
userRouter.put("/update/:id", auth, updateUserByIdController);
userRouter.put("/updateUserProfile/:id", auth, updateUserProfileController);

export default userRouter;
