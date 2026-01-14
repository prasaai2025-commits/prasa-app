import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function Expenses() {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee"));

  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [files, setFiles] = useState([]);

  const saveExpense = async () => {
    try {
      const fd = new FormData();

      fd.append("emp_id", employee.emp_id);
      fd.append("expense_date", date);
      fd.append("description", desc);
      fd.append("amount", amount);
      files.forEach(f => fd.append("attachments", f));

      await api.post("/expenses", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Expense saved");
      setDate(""); setDesc(""); setAmount(""); setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Failed to save expense");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* 🔙 Title + Arrow (same as Ticket System) */}
        <div style={styles.header}>
          <span style={styles.backArrow} onClick={() => navigate("/profile")}>←</span>
          <span style={styles.title}>Expenses</span>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={styles.activeTab}>Expenses</button>
          <button style={styles.tab} onClick={() => navigate("/expenses/pending")}>
            Pending Requests
          </button>
        </div>

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={styles.textarea}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={styles.input}
        />

        <input
          type="file"
          multiple
          onChange={e => setFiles([...e.target.files])}
          style={{ marginBottom: 12 }}
        />

        <button style={styles.primaryBtn} onClick={saveExpense}>
          Save Expense
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(#2f855a,#b7e4c7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 40
  },
  card: {
    background: "#fff",
    width: "92%",
    maxWidth: 420,
    borderRadius: 18,
    padding: 20,
    height: "fit-content"
  },

  /* Header (same as Ticket System) */
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 15,
    gap: 10
  },
  backArrow: {
    fontSize: 22,
    cursor: "pointer",
    color: "#2f855a"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2f855a"
  },

  tabs: { display: "flex", gap: 10, marginBottom: 15 },
  activeTab: {
    flex: 1,
    background: "#2f855a",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 8
  },
  tab: {
    flex: 1,
    background: "#eee",
    border: "none",
    padding: 10,
    borderRadius: 8
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #ccc"
  },
  textarea: {
    width: "100%",
    padding: 12,
    height: 90,
    borderRadius: 10,
    border: "1px solid #ccc",
    marginBottom: 12
  },
  primaryBtn: {
    width: "100%",
    background: "#2f855a",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    border: "none",
    fontSize: 16
  }
};
