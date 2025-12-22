import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [emp, setEmp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem("employee"));
    if (!employee) {
      navigate("/");
    } else {
      setEmp(employee);
    }
  }, [navigate]);

  if (!emp) return null;

  return (
    <div className="dashboard-page">
      {/* Top bar */}
      <div className="dashboard-top">
        <span className="back-arrow" onClick={() => navigate("/menu")}>
          ←
        </span>
      </div>

      {/* Center content */}
      <div className="dashboard-center">
        <h3 className="portal-title">Employee Portal Information</h3>

        <div className="emp-card">
          <div className="emp-row">
            <span>ID</span>
            <span>{emp.emp_id}</span>
          </div>

          <div className="emp-row">
            <span>Name</span>
            <span>{emp.emp_name}</span>
          </div>

          <div className="emp-row">
            <span>Email</span>
            <span>{emp.email}</span>
          </div>

          <div className="emp-row">
            <span>Phone</span>
            <span>{emp.phone}</span>
          </div>

          <div className="emp-row">
            <span>Department</span>
            <span>{emp.department}</span>
          </div>

          <div className="emp-row">
            <span>Role</span>
            <span>{emp.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
