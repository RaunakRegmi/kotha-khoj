import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../constant";

const Register = () => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    let data = {
      name: name,
      email: email,
      phone: phone,
      password: password,
    };

    setLoading(true);
    try {
      await axios({
        url: `${apiUrl}/user/register`,
        method: "post",
        data: data,
      });

      toast.success("Registered successfully. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to register.");
    }
    setLoading(false);
  };

  return (
    <div className="form-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            placeholder="98XXXXXXXX"
            pattern="[0-9]{10}"
            title="Phone must be 10 digits"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>
      </form>
      <p className="form-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
