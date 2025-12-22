import { useNavigate } from "react-router-dom";
import "../styles/AddNew.css";

export default function AddNew() {
  const navigate = useNavigate();

  return (
    <div className="addnew-page">
      {/* Back Arrow */}
      <div className="addnew-back" onClick={() => navigate("/menu")}>
        ←
      </div>

      <div className="addnew-card">
        <h2 className="addnew-title">Add New</h2>

        <button
          className="addnew-item"
          onClick={() => navigate("/expenses")}
        >
          Expenses
        </button>

        <button
          className="addnew-item"
          onClick={() => navigate("/ticket-system")}
        >
          Ticket System
        </button>
      </div>
    </div>
  );
}
