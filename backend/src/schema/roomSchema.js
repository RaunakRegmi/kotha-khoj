import { model, Schema } from "mongoose";

let roomSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, "Rent is required"],
      min: [1, "Rent must be more than 0"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    roomType: {
      type: String,
      required: [true, "Room type is required"],
      enum: {
        values: ["single", "double", "flat", "apartment"],
        message: "Room type must be single, double, flat or apartment",
      },
    },
    image: {
      type: String,
      default: "",
    },
    available: {
      type: Boolean,
      default: true,
    },
    // user who posted this room
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  { timestamps: true },
);

let Room = model("Room", roomSchema);
export default Room;
