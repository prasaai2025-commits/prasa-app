import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function History() {
  const navigate = useNavigate();
  const emp = JSON.parse(localStorage.getItem("employee"));
  const emp_id = emp?.emp_id;

  const [type, setType] = useState("expenses");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ from: "", to: "" });

  const fetchHistory = async () => {
    try {
      const params = { emp_id };
      if (filter.from) params.from = filter.from;
      if (filter.to) params.to = filter.to;

      const res = await api.get(`/history/${type}`, { params });
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [type]);

  return (
    <div className="expense-page">
      <button className="back-btn" onClick={() => navigate("/menu")}>
        ←
      </button>

      <div className="expense-card">
        <h2 style={{ textAlign: "center" }}>History</h2>

        {/* TABS */}
        <div className="expense-tabs">
          <button
            className={type === "expenses" ? "tab-active" : "tab-inactive"}
            onClick={() => setType("expenses")}
          >
            Expenses
          </button>
          <button
            className={type === "bills" ? "tab-active" : "tab-inactive"}
            onClick={() => setType("bills")}
          >
            Bills
          </button>
          <button
            className={type === "ticket-system" ? "tab-active" : "tab-inactive"}
            onClick={() => setType("ticket-system")}
          >
            Ticket System
          </button>
        </div>

        {/* FILTER */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input type="date" value={filter.from}
            onChange={(e) => setFilter({ ...filter, from: e.target.value })} />
          <input type="date" value={filter.to}
            onChange={(e) => setFilter({ ...filter, to: e.target.value })} />
          <button className="primary-btn" onClick={fetchHistory}>Apply</button>
        </div>

        {/* DESKTOP TABLE */}
        <div className="desktop-only">
          <table width="100%" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Date</th>
                {type === "bills" && <th>Type</th>}
                {type === "ticket-system" && <th>Assigned To</th>}
                <th>Description</th>
                {type !== "ticket-system" && <th>Amount</th>}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr><td colSpan="6" align="center">No records</td></tr>
              )}
              {data.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  {type === "bills" && <td>{r.bill_type}</td>}
                  {type === "ticket-system" && <td>{r.assigned_to}</td>}
                  <td>{r.description}</td>
                  {type !== "ticket-system" && <td>{r.amount}</td>}
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ANDROID CARDS */}
        <div className="mobile-only mobile-list">
          {data.map((r) => (
            <div key={r.id} className="mobile-card">
              <div className="mobile-row"><b>Date:</b> {new Date(r.date).toLocaleDateString()}</div>
              {type === "bills" && <div className="mobile-row"><b>Type:</b> {r.bill_type}</div>}
              {type === "ticket-system" && <div className="mobile-row"><b>Assigned:</b> {r.assigned_to}</div>}
              <div className="mobile-row"><b>Description:</b> {r.description}</div>
              {type !== "ticket-system" && <div className="mobile-row"><b>Amount:</b> ₹{r.amount}</div>}
              <div className="mobile-row"><b>Status:</b> {r.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
