import React from "react";
import { Link } from "react-router-dom";
import { formatRent, formatRoomType } from "../format";

const AdminRooms = ({ rooms, handleDelete }) => {
  if (rooms.length === 0) {
    return <p className="center-box muted">No rooms.</p>;
  }

  return (
    <div className="table-box">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Type</th>
            <th>Rent</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            return (
              <tr key={room._id}>
                <td>
                  <Link to={`/room/${room._id}`}>{room.title}</Link>
                </td>
                <td>{room.owner ? room.owner.name : "-"}</td>
                <td>{room.location}</td>
                <td>{formatRoomType(room.roomType)}</td>
                <td>{formatRent(room.rent)}</td>
                <td>
                  {room.available ? (
                    <span className="badge badge-green">Available</span>
                  ) : (
                    <span className="badge badge-gray">Not available</span>
                  )}
                </td>
                <td className="table-actions">
                  <Link
                    to={`/my-rooms/edit/${room._id}`}
                    className="btn btn-light"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(
                        "room",
                        room._id,
                        `Delete "${room.title}"? Its inquiries will also be deleted.`,
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRooms;
