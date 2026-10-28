import React from "react";
import { Link } from "react-router-dom";
import {
  formatRent,
  formatRoomType,
  handleImageError,
  noImage,
} from "../format";

// one room box, used in room list (and my rooms later)
const RoomCard = ({ room, children }) => {
  return (
    <div className="room-card">
      <Link to={`/room/${room._id}`}>
        <img
          src={room.image || noImage}
          alt={room.title}
          onError={handleImageError}
        />
      </Link>
      <div className="room-card-body">
        <div className="room-card-top">
          <span className="badge">{formatRoomType(room.roomType)}</span>
          {!room.available ? (
            <span className="badge badge-gray">Not available</span>
          ) : null}
        </div>
        <Link to={`/room/${room._id}`} className="room-title">
          {room.title}
        </Link>
        <p className="muted room-location">{room.location}</p>
        <p className="room-rent">
          {formatRent(room.rent)} <span className="muted">/ month</span>
        </p>
        {/* extra buttons can be passed inside <RoomCard>...</RoomCard> */}
        {children}
      </div>
    </div>
  );
};

export default RoomCard;
