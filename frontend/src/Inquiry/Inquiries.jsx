import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authHeader } from "../auth";
import { apiUrl } from "../constant";
import { formatDate, formatRent, statusClass } from "../format";

const Inquiries = () => {
  // which tab is open => "received" or "sent"
  let [tab, setTab] = useState("received");
  let [received, setReceived] = useState([]);
  let [sent, setSent] = useState([]);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    let getInquiries = async () => {
      try {
        let receivedResult = await axios({
          url: `${apiUrl}/inquiry/received`,
          method: "get",
          headers: authHeader(),
        });
        let sentResult = await axios({
          url: `${apiUrl}/inquiry/sent`,
          method: "get",
          headers: authHeader(),
        });
        setReceived(receivedResult.data.result);
        setSent(sentResult.data.result);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load inquiries.",
        );
      }
      setLoading(false);
    };

    getInquiries();
  }, []);

  // owner => accept or reject
  let handleStatus = async (id, status) => {
    try {
      let result = await axios({
        url: `${apiUrl}/inquiry/${id}`,
        method: "patch",
        data: { status: status },
        headers: authHeader(),
      });

      // update only status on screen (room and sender stay populated)
      setReceived((current) =>
        current.map((value) =>
          value._id === id
            ? { ...value, status: result.data.result.status }
            : value,
        ),
      );
      toast.success(`Inquiry ${status}.`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update inquiry.");
    }
  };

  // sender => delete
  let handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) {
      return;
    }
    try {
      await axios({
        url: `${apiUrl}/inquiry/${id}`,
        method: "delete",
        headers: authHeader(),
      });

      setSent((current) => current.filter((value) => value._id !== id));
      toast.success("Inquiry deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete inquiry.");
    }
  };

  let list = tab === "received" ? received : sent;

  return (
    <div>
      <h1>Inquiries</h1>

      <div className="tabs">
        <button
          className={tab === "received" ? "tab active" : "tab"}
          onClick={() => setTab("received")}
        >
          Received ({received.length})
        </button>
        <button
          className={tab === "sent" ? "tab active" : "tab"}
          onClick={() => setTab("sent")}
        >
          Sent ({sent.length})
        </button>
      </div>

      {loading ? (
        <p className="center-box muted">Loading inquiries...</p>
      ) : list.length === 0 ? (
        <div className="center-box">
          <h3>No inquiries yet</h3>
          <p className="muted">
            {tab === "received"
              ? "When someone asks about your room, it will show here."
              : "Inquiries you send to room owners will show here."}
          </p>
        </div>
      ) : (
        <div className="inquiry-list">
          {list.map((inquiry) => {
            return (
              <div key={inquiry._id} className="card inquiry-card">
                <div className="inquiry-top">
                  {inquiry.room ? (
                    <Link to={`/room/${inquiry.room._id}`} className="room-title">
                      {inquiry.room.title}
                    </Link>
                  ) : (
                    <span className="muted">Room removed</span>
                  )}
                  <span className={statusClass(inquiry.status)}>
                    {inquiry.status}
                  </span>
                </div>

                {inquiry.room ? (
                  <p className="muted">
                    {inquiry.room.location} &middot;{" "}
                    {formatRent(inquiry.room.rent)} / month
                  </p>
                ) : null}

                {tab === "received" && inquiry.sender ? (
                  <p>
                    <strong>From:</strong> {inquiry.sender.name} &middot;{" "}
                    <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>{" "}
                    &middot;{" "}
                    <a href={`mailto:${inquiry.sender.email}`}>
                      {inquiry.sender.email}
                    </a>
                  </p>
                ) : null}

                <p className="inquiry-message pre-line">{inquiry.message}</p>
                <p className="muted small">Sent on {formatDate(inquiry.createdAt)}</p>

                <div className="card-actions">
                  {tab === "received" ? (
                    <>
                      <button
                        className="btn btn-primary"
                        disabled={inquiry.status === "accepted"}
                        onClick={() => handleStatus(inquiry._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-light"
                        disabled={inquiry.status === "rejected"}
                        onClick={() => handleStatus(inquiry._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(inquiry._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inquiries;
