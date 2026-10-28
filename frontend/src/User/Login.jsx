import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveLogin } from "../auth";
import { apiUrl } from "../constant";

const Login = ({ setUser }) => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      email: email,
      password: password,
    };

    setLoading(true);
    try {
      let result = await axios({
        url: `${apiUrl}/user/login`,
        method: "post",
        data: data,
      });

      saveLogin(result.data.token, result.data.result);
      setUser(result.data.result);
      toast.success(`Welcome, ${result.data.result.name}!`);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login.");
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
      <p className="form-footer">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
