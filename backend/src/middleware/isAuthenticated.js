import jwt from "jsonwebtoken";
import { secretKey } from "../constant.js";
import User from "../schema/userSchema.js";

// checks token and puts logged in user in req.user
let isAuthenticated = async (req, res, next) => {
  try {
    // header looks like => Authorization: Bearer <token>
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    let info = jwt.verify(token, secretKey);
    let user = await User.findById(info.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please login again.",
    });
  }
};

export default isAuthenticated;
