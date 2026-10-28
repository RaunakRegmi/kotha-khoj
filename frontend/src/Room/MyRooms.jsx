import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authHeader } from "../auth";
import { apiUrl } from "../constant";
import RoomCard from "./RoomCard";

const MyRooms = () => {
  let [rooms, setRooms] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    let getMyRooms = async () => {
      try {
        let result = await axios({
          url: `${apiUrl}/room/my-rooms`,
          method: "get",
          headers: authHeader(),
        });
        setRooms(result.data.result);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load rooms.");
      }
      setLoading(false);
    };

    getMyRooms();
  }, []);

  // mark available <=> not available
  let handleToggle = async (room) => {
    try {
      let result = await axios({
        url: `${apiUrl}/room/${room._id}`,
        method: "patch",
        data: { available: !room.available },
        headers: authHeader(),
      });

      // replace old room with updated room on screen
      setRooms((currentRooms) =>
        currentRooms.map((value) =>
          value._id === room._id ? result.data.result : value,
        ),
      );
      toast.success(
        result.data.result.available
          ? "Room marked as available."
          : "Room marked as not available.",
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update room.");
    }
  };

  let handleDelete = async (id) => {
    if (!window.confirm("Delete this room? Its inquiries will also be deleted.")) {
      return;
    }
    try {
      await axios({
        url: `${apiUrl}/room/${id}`,
        method: "delete",
        headers: authHeader(),
      });

      // remove deleted room from screen
      setRooms((currentRooms) =>
        currentRooms.filter((value) => value._id !== id),
      );
      toast.success("Room deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete room.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Rooms</h1>
        <Link to="/my-rooms/create" className="btn btn-primary">
          + Post a Room
        </Link>
      </div>

      {loading ? (
        <p className="center-box muted">Loading your rooms...</p>
      ) : rooms.length === 0 ? (
        <div className="center-box">
          <h3>You have not posted any room yet</h3>
          <p className="muted">Post your first room so people can find it.</p>
        </div>
      ) : (
        <div className="room-grid">
          {rooms.map((room) => {
            return (
              <RoomCard key={room._id} room={room}>
                <div className="card-actions">
                  <button
                    className="btn btn-light"
                    onClick={() => navigate(`/my-rooms/edit/${room._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-light"
                    onClick={() => handleToggle(room)}
                  >
                    {room.available ? "Mark Unavailable" : "Mark Available"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(room._id)}
                  >
                    Delete
                  </button>
                </div>
              </RoomCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRooms;
