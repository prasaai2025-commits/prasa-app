import { useNavigate } from "react-router-dom";
import "../styles/menu.css";

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
      {/* Top bar */}
      <div className="menu-top">
        <button className="back-btn" onClick={() => navigate("/")}>
          ←
        </button>
        <span className="menu-title">Menu</span>
      </div>

      {/* Centered menu */}
      <div className="menu-center">
        <div className="menu-card" onClick={() => navigate("/dashboard")}>
          Dashboard
        </div>

        <div className="menu-card" onClick={() => navigate("/add-new")}>
          Add New
        </div>

        <div className="menu-card" onClick={() => navigate("/history")}>
          History
        </div>

        <div className="menu-card" onClick={() => navigate("/graph")}>
          Graph
        </div>
      </div>
    </div>
  );
}
