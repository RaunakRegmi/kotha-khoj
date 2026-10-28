import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { authHeader } from "../auth";
import { apiUrl } from "../constant";

// form shown on room details page
const SendInquiry = ({ roomId, user }) => {
  let [message, setMessage] = useState("");
  let [phone, setPhone] = useState(user.phone);
  let [sent, setSent] = useState(false);
  let [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      room: roomId,
      message: message,
      phone: phone,
    };

    setLoading(true);
    try {
      await axios({
        url: `${apiUrl}/inquiry`,
        method: "post",
        data: data,
        headers: authHeader(),
      });

      setMessage("");
      setSent(true);
      toast.success("Inquiry sent. The owner will contact you.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send inquiry.");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <p className="notice notice-success">
        Your inquiry was sent. You can check its status in Inquiries.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Message</label>
        <textarea
          placeholder="Hi, is this room still available? When can I visit?"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          required
        />
      </div>
      <div className="form-group">
        <label>Your Phone</label>
        <input
          type="tel"
          pattern="[0-9]{10}"
          title="Phone must be 10 digits"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          required
        />
      </div>
      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
};

export default SendInquiry;
