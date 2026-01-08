import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/login.css";
import logo from "../assets/prasa-logo.png";

import bcrypt from "bcryptjs";   // ⬅️ added for secure offline auth

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ============================
  // 🔐 OFFLINE AUTH HELPERS
  // ============================

  // save hashed credentials locally
  const saveOfflineUser = (user) => {
    const hash = bcrypt.hashSync(user.password, 10);

    const data = {
      id: user.id,          // emp_id or admin_id
      role: user.role,      // "employee" / "admin"
      name: user.name,
      hash,
    };

    localStorage.setItem("offlineUser", JSON.stringify(data));
  };

  // get cached user
  const getOfflineUser = () => {
    const data = localStorage.getItem("offlineUser");
    if (!data) return null;
    return JSON.parse(data);
  };

  // verify on offline mode
  const offlineLogin = (id, pwd) => {
    const user = getOfflineUser();
    if (!user) return false;

    if (user.id !== id) return false;

    return bcrypt.compareSync(pwd, user.hash);
  };

  // ============================
  // 🚀 MAIN LOGIN FUNCTION
  // ============================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const id = userId.trim();
    const pwd = password.trim();

    if (!id || !pwd) {
      setError("ID and Password are required");
      return;
    }

    // ============================
    // 🌐 1) TRY EMPLOYEE LOGIN ONLINE
    // ============================
    try {
      const empRes = await fetch(
        "https://prasa-app-eh1g.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emp_id: id, password: pwd }),
        }
      );

      if (empRes.ok) {
        const data = await empRes.json();

        localStorage.setItem("employee", JSON.stringify(data.user));
        localStorage.removeItem("admin");

        // save offline credentials
        saveOfflineUser({
          id,
          role: "employee",
          password: pwd,
          name: data.user?.name || "",
        });

        navigate("/home");
        return;
      }
    } catch (err) {
      console.log("employee online login failed…");
    }

    // ============================
    // 🌐 2) TRY ADMIN LOGIN ONLINE
    // ============================
    try {
      const adminRes = await fetch(
        "https://prasa-app-eh1g.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin_id: id, password: pwd }),
        }
      );

      if (adminRes.ok) {
        const data = await adminRes.json();

        localStorage.setItem("admin", JSON.stringify(data.admin));
        localStorage.removeItem("employee");

        // save offline credentials
        saveOfflineUser({
          id,
          role: "admin",
          password: pwd,
          name: data.admin?.name || "",
        });

        navigate("/admin/dashboard");
        return;
      }
    } catch (err) {
      console.log("admin online login failed…");
    }

    // ============================
    // 📴 3) OFFLINE LOGIN FALLBACK
    // ============================
    if (!navigator.onLine) {
      const ok = offlineLogin(id, pwd);

      if (ok) {
        const cached = getOfflineUser();

        if (cached.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }

        return;
      }
    }

    // ============================
    // ❌ 4) TOTAL FAILURE
    // ============================
    setError("Invalid ID or Password");
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
            placeholder="Employee/Admin ID"
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
