import React from "react";

let year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          <strong>KothaKhoj</strong> &middot; Find rooms and flats for rent in
          Nepal
        </p>
        <p className="muted small">
          &copy; {year} KothaKhoj. Made with the MERN stack.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
