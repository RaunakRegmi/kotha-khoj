import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./Admin/AdminDashboard";
import Inquiries from "./Inquiry/Inquiries";
import NotFound from "./NotFound";
import ProtectedRoute from "./ProtectedRoute";
import CreateRoom from "./Room/CreateRoom";
import MyRooms from "./Room/MyRooms";
import ReadAllRoom from "./Room/ReadAllRoom";
import ReadSingleRoom from "./Room/ReadSingleRoom";
import UpdateRoom from "./Room/UpdateRoom";
import Login from "./User/Login";
import Profile from "./User/Profile";
import Register from "./User/Register";

const KothaRoute = ({ user, setUser }) => {
  return (
    <Routes>
      <Route path="/" element={<ReadAllRoom />} />
      <Route path="/room/:id" element={<ReadSingleRoom user={user} />} />

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

      <Route
        path="/my-rooms"
        element={
          <ProtectedRoute user={user}>
            <MyRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-rooms/create"
        element={
          <ProtectedRoute user={user}>
            <CreateRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-rooms/edit/:id"
        element={
          <ProtectedRoute user={user}>
            <UpdateRoom user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inquiries"
        element={
          <ProtectedRoute user={user}>
            <Inquiries />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute user={user} role="admin">
            <AdminDashboard user={user} />
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
localhost:5173/room/:id => ReadSingleRoom
localhost:5173/login => Login
localhost:5173/register => Register
localhost:5173/profile => Profile (login needed)
localhost:5173/my-rooms => MyRooms (login needed)
localhost:5173/my-rooms/create => CreateRoom (login needed)
localhost:5173/my-rooms/edit/:id => UpdateRoom (login needed)
localhost:5173/inquiries => Inquiries (login needed)
localhost:5173/admin => AdminDashboard (admin only)
anything else => NotFound
*/
