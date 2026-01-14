import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function PendingTickets() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("employee");
    if (stored) {
      setEmployee(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!employee) return;
    loadPending();
  }, [employee]);

  const loadPending = async () => {
    try {
      const res = await api.get("/ticket-system/active", {
        params: { emp_id: employee.emp_id }
      });
      setRows(res.data || []);
    } catch (err) {
      console.log("pending ticket error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-page" style={{ position: "relative" }}>

      {/* White box container placed at TOP */}
      <div
        className="expense-card"
        style={{
          marginTop: 20,
          maxHeight: "calc(100vh - 40px)",
          display: "flex",
          flexDirection: "column"
        }}
      >

        {/* Header with arrow inside the box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingBottom: 10,
            borderBottom: "1px solid #ddd"
          }}
        >
          <button
            className="back-btn"
            onClick={() => navigate("/ticket-system")}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer"
            }}
          >
            ←
          </button>

          <h3 style={{ margin: 0, flex: 1, textAlign: "center" }}>
            Pending Tickets
          </h3>

          {/* Spacer so title stays centered */}
          <div style={{ width: 30 }}></div>
        </div>

        {/* Scrollable content */}
        <div
          className="mobile-list"
          style={{
            marginTop: 10,
            overflowY: "auto",
            flex: 1,
            paddingRight: 5
          }}
        >
          {loading && <p>Loading…</p>}

          {rows.map((r) => (
            <div key={r.id} className="mobile-card">
              <div><b>Date:</b> {r.ticket_date}</div>
              <div><b>Assigned To:</b> {r.assigned_to}</div>
              <div><b>Description:</b> {r.description}</div>
              <div><b>Status:</b> {r.status}</div>
            </div>
          ))}

          {!loading && rows.length === 0 && (
            <p style={{ textAlign: "center" }}>No pending tickets</p>
          )}
        </div>
      </div>
    </div>
  );
}
