import { model, Schema } from "mongoose";

let userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be user or admin",
      },
      default: "user",
    },
  },
  {
    timestamps: true,
    // never send password to frontend
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  },
);

let User = model("User", userSchema);
export default User;
