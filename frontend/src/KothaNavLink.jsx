import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeLogin } from "./auth";

const KothaNavLink = ({ user, setUser }) => {
  let navigate = useNavigate();

  let handleLogout = () => {
    removeLogin();
    setUser(null);
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="logo">
          KothaKhoj
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" end>
            Rooms
          </NavLink>

          {user ? (
            <>
              <NavLink to="/my-rooms">My Rooms</NavLink>
              <NavLink to="/inquiries">Inquiries</NavLink>
              {user.role === "admin" ? (
                <NavLink to="/admin">Admin</NavLink>
              ) : null}
              <NavLink to="/profile">Hi, {user.name}</NavLink>
              <button className="btn btn-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default KothaNavLink;
