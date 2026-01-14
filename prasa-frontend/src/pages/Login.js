import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import prasaLogo from "../assets/prasa-logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (role === "admin") {
         const res = await api.post("/auth/admin/login", {
          admin_id: username,
          password
        });

        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        localStorage.removeItem("employee");
        navigate("/admin-dashboard");
      } else {
          const res = await api.post("/auth/login", {
          emp_id: username,
          password
        });

        localStorage.setItem("employee", JSON.stringify(res.data.employee));
        localStorage.removeItem("admin");
        navigate("/profile");
      }
    } catch (err) {
      alert("Invalid ID or Password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={prasaLogo} alt="PRASA" className="login-logo" />

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={role === "admin" ? "Admin ID" : "Employee ID"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 🔥 EMPLOYEE ○ ADMIN ○ — ONE LINE */}
          <div className="role-row">
            <label>
              <input
                type="radio"
                checked={role === "employee"}
                onChange={() => setRole("employee")}
              />
              Employee
            </label>

            <label>
              <input
                type="radio"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />
              Admin
            </label>
          </div>

          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
