import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
        error: true,
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: true,
      success: false,
    });
  }
};
