import React from "react";
import { Link } from "react-router-dom";
import { formatDate, statusClass } from "../format";

const AdminInquiries = ({ inquiries, handleDelete }) => {
  if (inquiries.length === 0) {
    return <p className="center-box muted">No inquiries.</p>;
  }

  return (
    <div className="table-box">
      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>From</th>
            <th>Message</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => {
            return (
              <tr key={inquiry._id}>
                <td>
                  {inquiry.room ? (
                    <Link to={`/room/${inquiry.room._id}`}>
                      {inquiry.room.title}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{inquiry.sender ? inquiry.sender.name : "-"}</td>
                <td className="message-cell">{inquiry.message}</td>
                <td>
                  <span className={statusClass(inquiry.status)}>
                    {inquiry.status}
                  </span>
                </td>
                <td>{formatDate(inquiry.createdAt)}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete("inquiry", inquiry._id, "Delete this inquiry?")
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

export default AdminInquiries;
