import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        result: null,
      });
    }

    const user = verifyAccessToken(token);
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
        result: null,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      message: "Internal server error",
      result: null,
    });
  }
};
