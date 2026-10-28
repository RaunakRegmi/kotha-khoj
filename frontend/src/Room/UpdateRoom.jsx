import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authHeader } from "../auth";
import { apiUrl } from "../constant";
import RoomForm from "./RoomForm";

const UpdateRoom = ({ user }) => {
  let [room, setRoom] = useState(null);
  let [loading, setLoading] = useState(true);
  let params = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    let getRoom = async () => {
      try {
        let result = await axios({
          url: `${apiUrl}/room/${params.id}`,
          method: "get",
        });
        setRoom(result.data.result);
      } catch {
        setRoom(null);
      }
      setLoading(false);
    };

    getRoom();
  }, [params.id]);

  const updateRoom = async (data) => {
    try {
      await axios({
        url: `${apiUrl}/room/${params.id}`,
        method: "patch",
        data: data,
        headers: authHeader(),
      });

      toast.success("Room updated successfully.");
      navigate(`/room/${params.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update room.");
    }
  };

  if (loading) {
    return <p className="center-box muted">Loading room...</p>;
  }

  let canEdit =
    room && (room.owner?._id === user._id || user.role === "admin");

  if (!canEdit) {
    return (
      <div className="center-box">
        <h2>{room ? "You can only edit your own room" : "Room not found"}</h2>
        <Link to="/my-rooms" className="btn btn-primary">
          Go to My Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="form-card wide">
      <h2>Edit room</h2>
      <RoomForm room={room} onSubmit={updateRoom} buttonText="Save Changes" />
    </div>
  );
};

export default UpdateRoom;
