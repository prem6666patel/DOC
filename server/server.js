import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB.js";

// Routers
import authRouter from "./router/auth.router.js";
import fileRouter from "./router/file.router.js";
import userRouter from "./router/user.router.js";
import consultationRouter from "./router/consultation.router.js";

dotenv.config();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

// ✅ CORS Middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl or postman
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed.includes("*")) {
        const base = allowed.replace("*", "");
        return origin.startsWith(base);
      }
      return origin === allowed;
    });
    if (isAllowed) return callback(null, true);
    callback(new Error(`❌ CORS not allowed: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Make sure preflight OPTIONS requests are handled
app.options("*", cors(corsOptions));

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// ✅ Routes
app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/user", userRouter);
app.use("/consultation", consultationRouter);

// ✅ Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Connect DB and Start Server
connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

export default app;
