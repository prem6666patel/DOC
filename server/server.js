import express from "express";
import cors from "cors";
import authRouter from "./router/auth.router.js";
import connectDB from "./utils/connectDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileRouter from "./router/file.router.js";
import userRouter from "./router/user.router.js";
import consultationRouter from "./router/consultation.router.js";

dotenv.config();

const app = express();

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/user", userRouter);
app.use("/consultation", consultationRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running at", PORT);
  });
});
