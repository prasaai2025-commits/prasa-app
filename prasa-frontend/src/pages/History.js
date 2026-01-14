import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function History() {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee"));
  const emp_id = employee?.emp_id;

  const [type, setType] = useState("expenses");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emp_id) {
      navigate("/login");
      return;
    }
    fetchHistory();
  }, [type]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { emp_id };
      if (filter.from) params.from = filter.from;
      if (filter.to) params.to = filter.to;

      const res = await api.get(`/history/${type}`, { params });
      setData(res.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#9fd3b4", paddingTop: 8 }}>
      <div className="expense-page" style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="expense-card"
          style={{
            width: "100%",
            maxWidth: 420,
            marginTop: 8,
            paddingTop: 10
          }}
        >
          {/* Compact header: arrow + title in one line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8
            }}
          >
            <button
              onClick={() => navigate("/profile")}
              style={{
                background: "#2f7d4e",
                color: "#fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                flexShrink: 0
              }}
            >
              ←
            </button>
            <h2 style={{ margin: 0, fontSize: 20 }}>History</h2>
          </div>

          <div className="expense-tabs">
            <button className={type === "expenses" ? "tab-active" : "tab-inactive"} onClick={() => setType("expenses")}>Expenses</button>
            <button className={type === "bills" ? "tab-active" : "tab-inactive"} onClick={() => setType("bills")}>Bills</button>
            <button className={type === "ticket-system" ? "tab-active" : "tab-inactive"} onClick={() => setType("ticket-system")}>Ticket System</button>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input type="date" value={filter.from} onChange={(e) => setFilter({ ...filter, from: e.target.value })} />
            <input type="date" value={filter.to} onChange={(e) => setFilter({ ...filter, to: e.target.value })} />
            <button className="primary-btn" onClick={fetchHistory}>Apply</button>
          </div>

          {loading && <p>Loading…</p>}

          {/* Scrollable list */}
          <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: 6 }}>
            {data.map((r) => (
              <div key={r.id} className="mobile-card">
                <div><b>Date:</b> {new Date(r.date || r.expense_date || r.ticket_date).toLocaleDateString()}</div>
                {type === "ticket-system" && <div><b>Assigned To:</b> {r.assigned_to}</div>}
                <div><b>Description:</b> {r.description}</div>
                {type !== "ticket-system" && <div><b>Amount:</b> ₹{r.amount}</div>}
                <div><b>Status:</b> {r.status}</div>
              </div>
            ))}
            {!loading && data.length === 0 && <p style={{ textAlign: "center" }}>No records found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
