import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function Expenses() {
  const navigate = useNavigate();
  const emp_id = "EMP001";

  const [rows, setRows] = useState([]);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    id: null,
    expense_date: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    const res = await api.get("/expenses/active");
    setRows(res.data);
  };

  const saveExpense = async () => {
    try {
      const fd = new FormData();
      fd.append("expense_date", form.expense_date);
      fd.append("description", form.description);
      fd.append("amount", form.amount);
      if (file) fd.append("voucher", file);

      if (form.id) {
        await api.put(`/expenses/${form.id}`, fd);
      } else {
        await api.post("/expenses", fd);
      }

      reset();
      loadPending();
    } catch {
      alert("Save failed");
    }
  };

  const editRow = (r) => {
    setForm({
      id: r.id,
      expense_date: r.expense_date,
      description: r.description,
      amount: r.amount,
    });
  };

  const deleteRow = async (id) => {
    if (!window.confirm("Delete expense?")) return;
    await api.delete(`/expenses/${id}`);
    loadPending();
  };

  const reset = () => {
    setForm({ id: null, expense_date: "", description: "", amount: "" });
    setFile(null);
  };

  return (
    <div className="expense-page">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>

      {/* EXPENSE FORM (TOP CARD) */}
      <div className="expense-card">
        <h2>Expenses</h2>

        <input
          type="date"
          value={form.expense_date}
          onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
        />

        <textarea
          maxLength={1000}
          placeholder="Description (up to 1000 words)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button className="save-btn" onClick={saveExpense}>
          {form.id ? "Update Expense" : "Save Expense"}
        </button>
      </div>

      {/* PENDING / REJECTED — BELOW FORM */}
      <div className="expense-card" style={{ marginTop: 16 }}>
        <h3>Pending / Rejected Expenses</h3>

        <div style={{ maxHeight: 260, overflowY: "auto" }}>
          {rows.map((r) => (
            <div key={r.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
              <div><b>Date:</b> {r.expense_date}</div>
              <div><b>Description:</b> {r.description}</div>
              <div><b>Amount:</b> ₹{r.amount}</div>
              <div><b>Status:</b> {r.status}</div>

              <div style={{ marginTop: 6 }}>
                <button onClick={() => editRow(r)}>Edit</button>
                <button onClick={() => deleteRow(r.id)} style={{ marginLeft: 6 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p>No pending or rejected expenses</p>}
        </div>
      </div>
    </div>
  );
}
