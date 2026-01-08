import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { queueAdminAction } from "../adminOffline";

export default function AdminExpenses() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) navigate("/");

    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const res = await api.get("/admin/expenses/pending");
      setRows(res.data || []);

      let sum = 0;
      (res.data || []).forEach((r) => (sum += Number(r.amount || 0)));
      setTotal(sum);
    } catch (e) {
      console.error(e);
    }
  };

  const approve = async (id) => {
    try {
      await api.put(`/admin/expenses/${id}/approve`);
      loadPending();
    } catch (e) {
      await queueAdminAction({
        type: "expense-approve",
        url: `/admin/expenses/${id}/approve`
      });
      alert("Saved offline. Will sync when internet is back.");
    }
  };

  const reject = async (id) => {
    try {
      await api.put(`/admin/expenses/${id}/reject`);
      loadPending();
    } catch (e) {
      await queueAdminAction({
        type: "expense-reject",
        url: `/admin/expenses/${id}/reject`
      });
      alert("Saved offline. Will sync when internet is back.");
    }
  };

  return (
    <div className="expense-page">
      <div className="expense-card">

        {/* 🔙 BACK ARROW */}
        <div
          style={{
            fontSize: "24px",
            color: "#ffffff",
            cursor: "pointer",
            marginBottom: "10px",
            width: "fit-content"
          }}
          onClick={() => navigate("/admin/dashboard")}
        >
          ←
        </div>

        <h2>Expense Approvals</h2>

        <p><b>Total Pending Amount:</b> ₹{total}</p>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {rows.map((r) => (
            <div
              key={r.id}
              style={{ borderBottom: "1px solid #ccc", paddingBottom: 10, marginBottom: 10 }}
            >
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
