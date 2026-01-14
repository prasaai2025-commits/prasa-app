import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminExpenses() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!admin || !admin.admin_id) {
      navigate("/");
      return;
    }
    loadPending();
  }, []);

  const loadPending = async () => {
    const res = await api.get("/admin/expenses/pending");

    const sorted = (res.data || []).sort((a, b) =>
      (a.emp_id || "").localeCompare(b.emp_id || "")
    );

    setRows(sorted);

    let sum = 0;
    sorted.forEach(r => sum += Number(r.amount || 0));
    setTotal(sum);
  };

  const approve = async (id) => {
    await api.put(`/admin/expenses/${id}/approve`);
    loadPending();
  };

  const reject = async (id) => {
    await api.put(`/admin/expenses/${id}/reject`);
    loadPending();
  };

  return (
    <div className="expense-page">
      <div className="expense-card" style={{ height: "85vh", display: "flex", flexDirection: "column" }}>

        {/* 🔹 Arrow + Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 22, cursor: "pointer" }} onClick={() => navigate("/admin-dashboard")}>
            ←
          </div>
          <h2>Expense Approvals</h2>
        </div>

        <p><b>Total Pending:</b> ₹{total}</p>

        {/* 🔹 Scrollable list */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: 5 }}>
          {rows.map(r => (
            <div key={r.id} style={{ borderBottom: "1px solid #ddd", padding: 10 }}>
              <p><b>Employee:</b> {r.emp_id}</p>
              <p><b>Date:</b> {r.expense_date}</p>
              <p><b>Amount:</b> ₹{r.amount}</p>
              <p><b>Description:</b> {r.description}</p>

              <button onClick={() => approve(r.id)}>Approve</button>
              <button onClick={() => reject(r.id)}>Reject</button>
            </div>
          ))}

          {rows.length === 0 && <p>No pending expenses</p>}
        </div>

      </div>
    </div>
  );
}
