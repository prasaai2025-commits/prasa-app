import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function PendingExpenses() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const employee = JSON.parse(localStorage.getItem("employee"));
  const emp_id = employee?.emp_id;

  useEffect(() => {
    if (!emp_id) return;   // ❌ do NOT redirect
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const res = await api.get("/expenses/active", {
        params: { emp_id }
      });
      setRows(res.data || []);
    } catch (e) {
      console.error("Pending expense error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-page">
      {/* White Card */}
      <div className="expense-card">

            {/* 🔙 Title + Arrow (pending request)) */}
        <div className="expense-header" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/expenses")}
            style={{
              background: "#2f855a",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            ←
          </button>

          <h3 style={{ margin: 0, fontWeight: "600" }}>
            Pending / Rejected Expenses
          </h3>
        </div>

        {/* Scrollable list */}
        <div
          className="expense-scroll"
          style={{
            marginTop: "15px",
            maxHeight: "70vh",      // ✅ Android-safe scrolling
            overflowY: "auto",
            paddingRight: "6px"
          }}
        >
          {loading && <p>Loading...</p>}

          {rows.map((r) => (
            <div key={r.id} className="mobile-card">
              <div><b>Date:</b> {r.expense_date}</div>
              <div><b>Description:</b> {r.description}</div>
              <div><b>Amount:</b> ₹{r.amount}</div>
              <div><b>Status:</b> {r.status}</div>
            </div>
          ))}

          {!loading && rows.length === 0 && <p>No pending requests</p>}
        </div>

      </div>
    </div>
  );
}
