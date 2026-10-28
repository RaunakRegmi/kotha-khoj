import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="center-box">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Go to Rooms
      </Link>
    </div>
  );
};

export default NotFound;
