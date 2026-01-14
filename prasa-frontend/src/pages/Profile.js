import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const employee = JSON.parse(localStorage.getItem("employee")) || {};
  const employeeName = employee.emp_name || "Employee";
  const empId = employee.emp_id || "N/A";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(#2f855a, #b7e4c7)" }}>
      <div className="profile-page">
        <div className="profile-container">

          <div className="profile-topbar">
            <span className="hamburger" onClick={() => setOpenMenu(true)}>☰</span>
            <h3>PRASA</h3>
            <div className="profile-icons">
              <span className="icon-btn">🔔</span>
              <span className="icon-btn logout-btn" onClick={logout}>⏻</span>
            </div>
          </div>

          {openMenu && (
            <div className="drawer-overlay" onClick={() => setOpenMenu(false)}>
              <div className="drawer" onClick={(e) => e.stopPropagation()}>
                <h4>Settings</h4>
                <div className="drawer-item"><strong>Name:</strong> {employeeName}</div>
                <div className="drawer-item"><strong>Employee ID:</strong> {empId}</div>
              </div>
            </div>
          )}

          <div className="profile-greeting-box">
            <div className="profile-greet">{getGreeting()}</div>
            <div className="profile-name">Hello, {employeeName}</div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">MY WORKSPACE</div>
            <div className="profile-grid">
              <div className="profile-card" onClick={() => navigate("/dashboard")}>
                <div className="profile-card-icon">🏠</div>
                <div className="profile-card-label">Dashboard</div>
              </div>

              <div className="profile-card" onClick={() => navigate("/expenses")}>
                <div className="profile-card-icon">💰</div>
                <div className="profile-card-label">Expenses</div>
              </div>

              <div className="profile-card" onClick={() => navigate("/ticket-system")}>
                <div className="profile-card-icon">🎫</div>
                <div className="profile-card-label">Tickets</div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">REPORTS</div>
            <div className="profile-grid">
              <div className="profile-card" onClick={() => navigate("/history")}>
                <div className="profile-card-icon">📄</div>
                <div className="profile-card-label">History</div>
              </div>

              <div className="profile-card" onClick={() => navigate("/graphs")}>
                <div className="profile-card-icon">📊</div>
                <div className="profile-card-label">Graphs</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
