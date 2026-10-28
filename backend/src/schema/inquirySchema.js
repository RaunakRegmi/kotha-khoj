import { model, Schema } from "mongoose";

let inquirySchema = Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    // user who sent this inquiry
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected"],
        message: "Status must be pending, accepted or rejected",
      },
      default: "pending",
    },
  },
  { timestamps: true },
);

let Inquiry = model("Inquiry", inquirySchema);
export default Inquiry;
