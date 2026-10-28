import React from "react";
import { formatDate } from "../format";

// user => logged in admin (admin cannot delete own account)
const AdminUsers = ({ users, user, handleDelete }) => {
  if (users.length === 0) {
    return <p className="center-box muted">No users.</p>;
  }

  return (
    <div className="table-box">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((value) => {
            return (
              <tr key={value._id}>
                <td>{value.name}</td>
                <td>{value.email}</td>
                <td>{value.phone}</td>
                <td>
                  <span
                    className={
                      value.role === "admin" ? "badge" : "badge badge-gray"
                    }
                  >
                    {value.role}
                  </span>
                </td>
                <td>{formatDate(value.createdAt)}</td>
                <td>
                  {value._id === user._id ? (
                    <span className="muted small">You</span>
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleDelete(
                          "user",
                          value._id,
                          `Delete ${value.name}? Their rooms and inquiries will also be deleted.`,
                        )
                      }
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
