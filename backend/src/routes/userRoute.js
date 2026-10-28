import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "../constant.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAuthorized from "../middleware/isAuthorized.js";
import Inquiry from "../schema/inquirySchema.js";
import Room from "../schema/roomSchema.js";
import User from "../schema/userSchema.js";

let userRoute = Router();

// register => anyone can make a normal user account
userRoute.route("/register").post(async (req, res, next) => {
  try {
    let { name, email, password, phone } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    let oldUser = await User.findOne({ email: email?.toLowerCase().trim() });
    if (oldUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    // role is not taken from body, so nobody can register as admin
    let result = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// login => check email and password, then give token
userRoute.route("/login").post(async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email: email?.toLowerCase().trim() });
    let isValidPassword = user
      ? await bcrypt.compare(password || "", user.password)
      : false;

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    let token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      result: user,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// my profile => logged in user reads and updates own account
userRoute
  .route("/my-profile")
  .get(isAuthenticated, async (req, res, next) => {
    res.status(200).json({
      success: true,
      message: "Profile read successfully.",
      result: req.user,
    });
  })
  .patch(isAuthenticated, async (req, res, next) => {
    try {
      // only name and phone can be changed here
      let result = await User.findByIdAndUpdate(
        req.user._id,
        { name: req.body.name, phone: req.body.phone },
        { new: true, runValidators: true },
      );

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

userRoute
  .route("/change-password")
  .patch(isAuthenticated, async (req, res, next) => {
    try {
      let { oldPassword, newPassword } = req.body;

      let isValidPassword = await bcrypt.compare(
        oldPassword || "",
        req.user.password,
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Old password is wrong",
        });
      }

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters",
        });
      }

      req.user.password = await bcrypt.hash(newPassword, 10);
      await req.user.save();

      res.status(200).json({
        success: true,
        message: "Password changed successfully.",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

// admin only => read all users
userRoute
  .route("/")
  .get(isAuthenticated, isAuthorized("admin"), async (req, res, next) => {
    try {
      let result = await User.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        message: "Users read successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

// admin only => read and delete single user
userRoute
  .route("/:id")
  .get(isAuthenticated, isAuthorized("admin"), async (req, res, next) => {
    try {
      let result = await User.findById(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User read successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
  .delete(isAuthenticated, isAuthorized("admin"), async (req, res, next) => {
    try {
      if (req.params.id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Admin cannot delete own account",
        });
      }

      let result = await User.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // also delete user's rooms, inquiries on those rooms and inquiries user sent
      let rooms = await Room.find({ owner: req.params.id });
      let roomIds = rooms.map((room) => room._id);
      await Inquiry.deleteMany({
        $or: [{ room: { $in: roomIds } }, { sender: req.params.id }],
      });
      await Room.deleteMany({ owner: req.params.id });

      res.status(200).json({
        success: true,
        message: "User deleted successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

export default userRoute;
