import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAuthorized from "../middleware/isAuthorized.js";
import Inquiry from "../schema/inquirySchema.js";
import Room from "../schema/roomSchema.js";

let roomRoute = Router();

// owner details shown with a room (no password, see userSchema)
let ownerFields = "name email phone";

// only the owner of the room or admin can update/delete it
let canEdit = (room, user) => {
  return room.owner.toString() === user._id.toString() || user.role === "admin";
};

roomRoute
  .route("/")
  // create room => owner is the logged in user
  .post(isAuthenticated, async (req, res, next) => {
    try {
      let result = await Room.create({ ...req.body, owner: req.user._id });
      res.status(201).json({
        success: true,
        message: "Room created successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
  // read rooms => public, only available rooms
  // query example => /room?location=baneshwor&roomType=flat&minRent=5000&maxRent=20000&sort=rent
  .get(async (req, res, next) => {
    try {
      let { location, roomType, minRent, maxRent, sort } = req.query;
      let filter = { available: true };

      if (location) {
        // escape special characters, then search anywhere, any case
        let text = location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.location = { $regex: text, $options: "i" };
      }
      if (roomType) {
        filter.roomType = roomType;
      }
      if (minRent || maxRent) {
        filter.rent = {};
        if (minRent) filter.rent.$gte = Number(minRent);
        if (maxRent) filter.rent.$lte = Number(maxRent);
      }

      // sort => rent (low to high), -rent (high to low), default newest first
      let sortBy = { createdAt: -1 };
      if (sort === "rent") sortBy = { rent: 1 };
      if (sort === "-rent") sortBy = { rent: -1 };

      let result = await Room.find(filter)
        .sort(sortBy)
        .populate("owner", ownerFields);
      res.status(200).json({
        success: true,
        message: "Rooms read successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

// my rooms => rooms posted by logged in user (available or not)
roomRoute.route("/my-rooms").get(isAuthenticated, async (req, res, next) => {
  try {
    let result = await Room.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: "My rooms read successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// all rooms => admin only (available or not)
roomRoute
  .route("/all")
  .get(isAuthenticated, isAuthorized("admin"), async (req, res, next) => {
    try {
      let result = await Room.find()
        .sort({ createdAt: -1 })
        .populate("owner", ownerFields);
      res.status(200).json({
        success: true,
        message: "All rooms read successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

roomRoute
  .route("/:id")
  // read single room => public
  .get(async (req, res, next) => {
    try {
      let result = await Room.findById(req.params.id).populate(
        "owner",
        ownerFields,
      );
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Room read successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
  .patch(isAuthenticated, async (req, res, next) => {
    try {
      let room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }
      if (!canEdit(room, req.user)) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own room.",
        });
      }

      // owner cannot be changed
      let { owner, ...data } = req.body;

      let result = await Room.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        success: true,
        message: "Room updated successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
  .delete(isAuthenticated, async (req, res, next) => {
    try {
      let room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }
      if (!canEdit(room, req.user)) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own room.",
        });
      }

      let result = await Room.findByIdAndDelete(req.params.id);
      // inquiries of this room are useless now
      await Inquiry.deleteMany({ room: req.params.id });

      res.status(200).json({
        success: true,
        message: "Room deleted successfully.",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

export default roomRoute;
