import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authHeader } from "../auth";
import { apiUrl } from "../constant";
import AdminInquiries from "./AdminInquiries";
import AdminRooms from "./AdminRooms";
import AdminUsers from "./AdminUsers";

const AdminDashboard = ({ user }) => {
  // which tab is open => "users", "rooms" or "inquiries"
  let [tab, setTab] = useState("users");
  let [users, setUsers] = useState([]);
  let [rooms, setRooms] = useState([]);
  let [inquiries, setInquiries] = useState([]);
  let [loading, setLoading] = useState(true);
  // change this number to load all data again
  let [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let getData = async () => {
      try {
        let usersResult = await axios({
          url: `${apiUrl}/user`,
          method: "get",
          headers: authHeader(),
        });
        let roomsResult = await axios({
          url: `${apiUrl}/room/all`,
          method: "get",
          headers: authHeader(),
        });
        let inquiriesResult = await axios({
          url: `${apiUrl}/inquiry/all`,
          method: "get",
          headers: authHeader(),
        });
        setUsers(usersResult.data.result);
        setRooms(roomsResult.data.result);
        setInquiries(inquiriesResult.data.result);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load data.");
      }
      setLoading(false);
    };

    getData();
  }, [refresh]);

  // one delete function for users, rooms and inquiries
  // type => "user", "room" or "inquiry"
  let handleDelete = async (type, id, confirmText) => {
    if (!window.confirm(confirmText)) {
      return;
    }
    try {
      await axios({
        url: `${apiUrl}/${type}/${id}`,
        method: "delete",
        headers: authHeader(),
      });
      toast.success(`${type[0].toUpperCase() + type.slice(1)} deleted.`);
      // deleting user/room also deletes related data, so load everything again
      setRefresh(refresh + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || `Unable to delete ${type}.`);
    }
  };

  let availableRooms = rooms.filter((room) => room.available).length;
  let pendingInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "pending",
  ).length;

  if (loading) {
    return <p className="center-box muted">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="stats">
        <div className="card stat">
          <span className="stat-number">{users.length}</span>
          <span className="muted">Users</span>
        </div>
        <div className="card stat">
          <span className="stat-number">{rooms.length}</span>
          <span className="muted">Rooms ({availableRooms} available)</span>
        </div>
        <div className="card stat">
          <span className="stat-number">{inquiries.length}</span>
          <span className="muted">Inquiries ({pendingInquiries} pending)</span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={tab === "users" ? "tab active" : "tab"}
          onClick={() => setTab("users")}
        >
          Users
        </button>
        <button
          className={tab === "rooms" ? "tab active" : "tab"}
          onClick={() => setTab("rooms")}
        >
          Rooms
        </button>
        <button
          className={tab === "inquiries" ? "tab active" : "tab"}
          onClick={() => setTab("inquiries")}
        >
          Inquiries
        </button>
      </div>

      {tab === "users" ? (
        <AdminUsers users={users} user={user} handleDelete={handleDelete} />
      ) : null}
      {tab === "rooms" ? (
        <AdminRooms rooms={rooms} handleDelete={handleDelete} />
      ) : null}
      {tab === "inquiries" ? (
        <AdminInquiries inquiries={inquiries} handleDelete={handleDelete} />
      ) : null}
    </div>
  );
};

export default AdminDashboard;
