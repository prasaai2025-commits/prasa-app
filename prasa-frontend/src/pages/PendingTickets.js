import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function PendingTickets() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ CORRECT WAY
  const employee = JSON.parse(localStorage.getItem("employee"));
  const emp_id = employee?.emp_id;

  useEffect(() => {
    // 🔐 guard
    if (!emp_id) {
      navigate("/");
      return;
    }
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const res = await api.get("/ticket-system/active", {
        params: { emp_id },
      });
      setRows(res.data || []);
    } catch (err) {
      console.log("pending ticket error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-page" style={{ position: "relative" }}>
      {/* BACK → TICKET SYSTEM */}
      <button
        onClick={() => navigate("/ticketsystem")}
        className="back-btn"
        style={{ position: "absolute", top: 15, left: 15 }}
      >
        ←
      </button>

      <div className="expense-card" style={{ marginTop: 60 }}>
        <h3>Pending Tickets</h3>

        {loading && <p>Loading…</p>}

        <div className="mobile-list">
          {rows.map((r) => (
            <div key={r.id} className="mobile-card">
              <div><b>Date:</b> {r.ticket_date}</div>
              <div><b>Description:</b> {r.description}</div>
              <div><b>Status:</b> {r.status}</div>
            </div>
          ))}

          {!loading && rows.length === 0 && <p>No pending tickets.</p>}
        </div>
      </div>
    </div>
  );
}
