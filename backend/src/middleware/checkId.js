import { isValidObjectId } from "mongoose";

// runs before every route that has :id
// wrong id like /room/abc => clear message instead of mongoose error
let checkId = (req, res, next, id) => {
  if (isValidObjectId(id)) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }
};

export default checkId;
