import jwt from "jsonwebtoken";
import { secretKey } from "../constant.js";
import User from "../schema/userSchema.js";

// like isAuthenticated, but does not block
// logged in => req.user is set, not logged in => req.user stays empty
let readUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    let info = jwt.verify(token, secretKey);
    req.user = await User.findById(info.id);
  } catch {
    // no token or wrong token => continue as visitor
  }
  next();
};

export default readUser;
