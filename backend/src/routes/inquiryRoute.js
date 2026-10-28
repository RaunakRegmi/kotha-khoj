import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAuthorized from "../middleware/isAuthorized.js";
import Inquiry from "../schema/inquirySchema.js";
import Room from "../schema/roomSchema.js";

let inquiryRoute = Router();

let roomFields = "title rent location image owner";
let senderFields = "name email phone";

// send inquiry => logged in user asks about someone else's room
inquiryRoute.route("/").post(isAuthenticated, async (req, res, next) => {
  try {
    let { room, message, phone } = req.body;

    let foundRoom = await Room.findById(room);
    if (!foundRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    if (!foundRoom.available) {
      return res.status(400).json({
        success: false,
        message: "This room is not available.",
      });
    }
    if (foundRoom.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send inquiry to your own room.",
      });
    }

    let oldInquiry = await Inquiry.findOne({
      room: room,
      sender: req.user._id,
      status: "pending",
    });
    if (oldInquiry) {
      return res.status(409).json({
        success: false,
        message: "You already sent an inquiry for this room.",
      });
    }

    // status is not taken from body, new inquiry is always pending
    let result = await Inquiry.create({
      room: room,
      sender: req.user._id,
      message: message,
      phone: phone || req.user.phone,
    });

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// sent => inquiries I sent
inquiryRoute.route("/sent").get(isAuthenticated, async (req, res, next) => {
  try {
    let result = await Inquiry.find({ sender: req.user._id })
      .sort({ createdAt: -1 })
      .populate("room", roomFields);
    res.status(200).json({
      success: true,
      message: "Sent inquiries read successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// received => inquiries on my rooms
inquiryRoute
  .route("/received")
  .get(isAuthenticated, async (req, res, next) => {
    try {
      let myRooms = await Room.find({ owner: req.user._id });
      let roomIds = myRooms.map((room) => room._id);

      let result = await Inquiry.find({ room: { $in: roomIds } })
        .sort({ createdAt: -1 })
        .populate("room", roomFields)
        .populate("sender", senderFields);
      res.status(200).json({
        success: true,
        message: "Received inquiries read successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

// all => admin only
inquiryRoute
  .route("/all")
  .get(isAuthenticated, isAuthorized("admin"), async (req, res, next) => {
    try {
      let result = await Inquiry.find()
        .sort({ createdAt: -1 })
        .populate("room", roomFields)
        .populate("sender", senderFields);
      res.status(200).json({
        success: true,
        message: "All inquiries read successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

inquiryRoute
  .route("/:id")
  // update => only room owner can accept or reject
  .patch(isAuthenticated, async (req, res, next) => {
    try {
      let inquiry = await Inquiry.findById(req.params.id).populate("room");
      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found",
        });
      }
      if (
        !inquiry.room ||
        inquiry.room.owner.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Only the room owner can update this inquiry.",
        });
      }

      // only status can be changed
      let result = await Inquiry.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true },
      );
      res.status(200).json({
        success: true,
        message: "Inquiry updated successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
  // delete => sender or admin
  .delete(isAuthenticated, async (req, res, next) => {
    try {
      let inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found",
        });
      }
      if (
        inquiry.sender.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own inquiry.",
        });
      }

      let result = await Inquiry.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Inquiry deleted successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

export default inquiryRoute;
