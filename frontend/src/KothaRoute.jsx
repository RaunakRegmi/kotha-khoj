import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import ProtectedRoute from "./ProtectedRoute";
import ReadAllRoom from "./Room/ReadAllRoom";
import Login from "./User/Login";
import Profile from "./User/Profile";
import Register from "./User/Register";

const KothaRoute = ({ user, setUser }) => {
  return (
    <Routes>
      <Route path="/" element={<ReadAllRoom />} />

      {/* logged in user should not see login/register again */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user}>
            <Profile user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default KothaRoute;

/*
localhost:5173/ => ReadAllRoom
localhost:5173/login => Login
localhost:5173/register => Register
localhost:5173/profile => Profile (login needed)
anything else => NotFound
*/
