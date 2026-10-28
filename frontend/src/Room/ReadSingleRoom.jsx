import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../constant";
import {
  formatDate,
  formatRent,
  formatRoomType,
  handleImageError,
  noImage,
} from "../format";
import SendInquiry from "../Inquiry/SendInquiry";

const ReadSingleRoom = ({ user }) => {
  let [room, setRoom] = useState(null);
  let [loading, setLoading] = useState(true);
  let params = useParams();

  useEffect(() => {
    let getRoom = async () => {
      setLoading(true);
      try {
        let result = await axios({
          url: `${apiUrl}/room/${params.id}`,
          method: "get",
        });
        setRoom(result.data.result);
      } catch {
        // room not found or wrong id
        setRoom(null);
      }
      setLoading(false);
    };

    getRoom();
  }, [params.id]);

  if (loading) {
    return <p className="center-box muted">Loading room...</p>;
  }

  if (!room) {
    return (
      <div className="center-box">
        <h2>Room not found</h2>
        <p className="muted">It may have been removed by the owner.</p>
        <Link to="/" className="btn btn-primary">
          Back to Rooms
        </Link>
      </div>
    );
  }

  let isMyRoom = user && room.owner && user._id === room.owner._id;

  // what to show in inquiry box
  let inquiryBox;
  if (!user) {
    inquiryBox = (
      <p>
        <Link to="/login">Login</Link> to send an inquiry to the owner.
      </p>
    );
  } else if (isMyRoom) {
    inquiryBox = (
      <>
        <p className="muted">This is your room.</p>
        <Link to={`/my-rooms/edit/${room._id}`} className="btn btn-light">
          Edit Room
        </Link>
      </>
    );
  } else if (!room.available) {
    inquiryBox = <p className="muted">This room is not available now.</p>;
  } else {
    inquiryBox = <SendInquiry roomId={room._id} user={user} />;
  }

  return (
    <div>
      <Link to="/" className="back-link">
        &larr; Back to Rooms
      </Link>

      <div className="room-details">
        <div>
          <img
            className="room-details-image"
            src={room.image || noImage}
            alt={room.title}
            onError={handleImageError}
          />

          <div className="card">
            <div className="room-card-top">
              <span className="badge">{formatRoomType(room.roomType)}</span>
              {room.available ? (
                <span className="badge badge-green">Available</span>
              ) : (
                <span className="badge badge-gray">Not available</span>
              )}
            </div>
            <h1>{room.title}</h1>
            <p className="room-rent big">
              {formatRent(room.rent)} <span className="muted">/ month</span>
            </p>
            <p>
              <strong>Location:</strong> {room.location}
            </p>
            <p>
              <strong>Address:</strong> {room.address}
            </p>
            <p className="muted">Posted on {formatDate(room.createdAt)}</p>

            <h3>About this room</h3>
            <p className="pre-line">{room.description}</p>
          </div>
        </div>

        <aside>
          <div className="card">
            <h3>Owner</h3>
            {room.owner ? (
              <>
                <p>
                  <strong>{room.owner.name}</strong>
                </p>
                <p>
                  Phone:{" "}
                  <a href={`tel:${room.owner.phone}`}>{room.owner.phone}</a>
                </p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${room.owner.email}`}>{room.owner.email}</a>
                </p>
              </>
            ) : (
              <p className="muted">Owner details not available.</p>
            )}
          </div>

          <div className="card">
            <h3>Send an inquiry</h3>
            {inquiryBox}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ReadSingleRoom;
