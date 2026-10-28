// make express application
// attach port to it

import express, { json } from "express";
import cors from "cors";
import connectToDb from "./src/connectToDb.js";
import { port } from "./src/constant.js";
import userRoute from "./src/routes/userRoute.js";
import roomRoute from "./src/routes/roomRoute.js";
import inquiryRoute from "./src/routes/inquiryRoute.js";

let app = express();

app.use(cors());
app.use(json());

app.get("/", (req, res, next) => {
  res.json({ success: true, message: "KothaKhoj API is running" });
});

app.use("/user", userRoute);
app.use("/room", roomRoute);
app.use("/inquiry", inquiryRoute);

app.listen(port, () => {
  console.log(`application is listening at port ${port}`);
  connectToDb();
});
