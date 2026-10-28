import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { authHeader, saveUser } from "../auth";
import { apiUrl } from "../constant";

const Profile = ({ user, setUser }) => {
  // update profile form
  let [name, setName] = useState(user.name);
  let [phone, setPhone] = useState(user.phone);

  // change password form
  let [oldPassword, setOldPassword] = useState("");
  let [newPassword, setNewPassword] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let result = await axios({
        url: `${apiUrl}/user/my-profile`,
        method: "patch",
        data: { name: name, phone: phone },
        headers: authHeader(),
      });

      saveUser(result.data.result);
      setUser(result.data.result);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios({
        url: `${apiUrl}/user/change-password`,
        method: "patch",
        data: { oldPassword: oldPassword, newPassword: newPassword },
        headers: authHeader(),
      });

      setOldPassword("");
      setNewPassword("");
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to change password.",
      );
    }
  };

  return (
    <div>
      <h1>My Profile</h1>
      <div className="profile-grid">
        <div className="card">
          <h3>Account details</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Member since:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                title="Phone must be 10 digits"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                required
              />
            </div>
            <button className="btn btn-primary">Update Profile</button>
          </form>
        </div>

        <div className="card">
          <h3>Change password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                onChange={(e) => setOldPassword(e.target.value)}
                value={oldPassword}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                minLength={6}
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <button className="btn btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
