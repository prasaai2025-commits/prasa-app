import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    approvedAmount: 0,
    pendingExpenses: 0,
    pendingTickets: 0,
  });

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) navigate("/");

    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await api.get("/admin/summary");
      setSummary(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="expense-page">
      <div className="expense-card">

        <h2>Admin Dashboard</h2>

        <p><b>Total Approved Amount:</b> ₹{summary.approvedAmount}</p>
        <p><b>Pending Expenses:</b> {summary.pendingExpenses}</p>
        <p><b>Pending Tickets:</b> {summary.pendingTickets}</p>

        <button className="save-btn" onClick={() => navigate("/admin/expenses")}>
          Expense Approvals
        </button>

        <button className="save-btn" onClick={() => navigate("/admin/tickets")}>
          Ticket Approvals
        </button>

        <button
          className="save-btn"
          onClick={() => {
            localStorage.removeItem("admin");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
