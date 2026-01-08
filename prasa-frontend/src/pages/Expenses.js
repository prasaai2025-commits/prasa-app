import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function Expenses() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const saveExpense = async () => {
    await api.post("/expenses", {
      expense_date: date,
      description: desc,
      amount
    });
    alert("Expense saved");
  };

  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate("/add-new")}>←</button>

      <div style={styles.card}>
        <div style={styles.tabs}>
          <button style={styles.activeTab}>Expenses</button>
          <button style={styles.tab} onClick={() => navigate("/pending-expenses")}>
            Pending Requests
          </button>
        </div>

        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input}/>
        <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} style={styles.textarea}/>
        <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={styles.input}/>

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
    paddingTop: 60
  },
  back: {
    position: "absolute",
    top: 15,
    left: 15,
    color: "white",
    background: "none",
    border: "none",
    fontSize: 26
  },
  card: {
    background: "#fff",
    width: "92%",
    maxWidth: 420,
    borderRadius: 18,
    padding: 20
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 15
  },
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
