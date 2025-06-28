import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutController,
} from "../controllers/user.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.post("/logout", logoutController);

export default authRouter;
