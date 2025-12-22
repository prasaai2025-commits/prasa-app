import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/prasa-logo.png";
import "../styles/home.css";

const Home = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("employee"));
    if (!emp) {
      navigate("/");
    } else {
      setEmployee(emp);
    }
  }, [navigate]);

  if (!employee) return null;

  return (
    <div className="home-container">
      <div className="home-card">
        <img src={logo} alt="PRASA Logo" className="home-logo" />

        <h2 className="home-title">PRASA Employee Portal</h2>

        <p className="home-welcome">
          Welcome,<br />
          <strong>{employee.emp_name}</strong>
        </p>

        <button
          className="profile-btn"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default Home;
