import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/login.css";
import logo from "../assets/prasa-logo.png";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const id = userId.trim();
    const pwd = password.trim();

    if (!id || !pwd) {
      setError("ID and Password are required");
      return;
    }

    /* =====================
       1️⃣ TRY ADMIN LOGIN
    ====================== */
    try {
      const adminRes = await api.post("/admin/login", {
        admin_id: id,
        password: pwd,
      });

      // ✅ ADMIN SUCCESS
      localStorage.setItem(
        "admin",
        JSON.stringify(adminRes.data.admin)
      );
      navigate("/admin/dashboard");
      return; // stop here
    } catch (adminErr) {
      // ❌ Not admin → continue to employee login
    }

    /* =====================
       2️⃣ TRY EMPLOYEE LOGIN
    ====================== */
    try {
      const empRes = await api.post("/auth/login", {
        emp_id: id,
        password: pwd,
      });

      // ✅ EMPLOYEE SUCCESS
      localStorage.setItem(
        "employee",
        JSON.stringify(empRes.data.user)
      );
      navigate("/home");
    } catch (empErr) {
      setError("Invalid ID or Password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="PRASA" className="login-logo" />

        <h2 className="login-title">PRASA Login</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Employee ID or Admin ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
