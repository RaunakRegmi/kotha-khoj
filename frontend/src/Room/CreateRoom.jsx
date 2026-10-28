import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authHeader } from "../auth";
import { apiUrl } from "../constant";
import RoomForm from "./RoomForm";

const CreateRoom = () => {
  let navigate = useNavigate();

  const createRoom = async (data) => {
    try {
      await axios({
        url: `${apiUrl}/room`,
        method: "post",
        data: data,
        headers: authHeader(),
      });

      toast.success("Room created successfully.");
      navigate("/my-rooms");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create room.");
    }
  };

  return (
    <div className="form-card wide">
      <h2>Post a room</h2>
      <RoomForm room={{}} onSubmit={createRoom} buttonText="Post Room" />
    </div>
  );
};

export default CreateRoom;
