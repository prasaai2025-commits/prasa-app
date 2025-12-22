import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminExpenses() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) navigate("/admin/login");

    loadPending();
  }, []);

  const loadPending = async () => {
    const res = await api.get("/expenses/admin/pending");
    setRows(res.data);
  };

  const approve = async (id) => {
    await api.put(`/expenses/${id}/approve`);
    loadPending();
  };

  const reject = async (id) => {
    await api.put(`/expenses/${id}/reject`);
    loadPending();
  };

  return (
    <div className="expense-page">
      <div className="expense-card">
        <h2>Admin – Expense Approvals</h2>

        {rows.map((r) => (
          <div key={r.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
            <div><b>Employee:</b> {r.emp_id}</div>
            <div><b>Date:</b> {r.expense_date}</div>
            <div><b>Amount:</b> ₹{r.amount}</div>
            <div><b>Description:</b> {r.description}</div>

            <button onClick={() => approve(r.id)}>Approve</button>
            <button onClick={() => reject(r.id)}>Reject</button>
          </div>
        ))}

        {rows.length === 0 && <p>No pending expenses</p>}
      </div>
    </div>
  );
}
