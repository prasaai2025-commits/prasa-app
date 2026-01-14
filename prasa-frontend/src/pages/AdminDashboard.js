import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    approvedAmount: 0,
    pendingExpenses: 0,
    pendingTickets: 0
  });

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (!storedAdmin) {
      navigate("/");
      return;
    }

    setAdmin(storedAdmin);
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await api.get("/admin/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Summary load failed", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Dashboard</h2>

        {admin && (
          <div style={styles.section}>
            <h4>Admin Details</h4>
            <p><b>Name:</b> {admin.name}</p>
            <p><b>ID:</b> {admin.admin_id}</p>
            <p><b>Email:</b> {admin.email}</p>
          </div>
        )}

        <div style={styles.section}>
          <h4>Summary</h4>
          <p><b>Total Approved:</b> ₹{summary.approvedAmount}</p>
          <p><b>Pending Expenses:</b> {summary.pendingExpenses}</p>
          <p><b>Pending Tickets:</b> {summary.pendingTickets}</p>
        </div>

        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => navigate("/admin-expenses")}>
            Expense Approvals
          </button>

          <button style={styles.btn} onClick={() => navigate("/admin-pending-requests")}>
            Pending Requests
          </button>

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
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
    paddingTop: 40
  },
  card: {
    background: "#fff",
    width: "92%",
    maxWidth: 420,
    borderRadius: 18,
    padding: 20
  },
  title: { textAlign: "center", marginBottom: 15 },
  section: {
    background: "#f7f7f7",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15
  },
  actions: { display: "flex", flexDirection: "column", gap: 10 },
  btn: {
    background: "#2f855a",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    border: "none",
    fontSize: 15
  },
  logoutBtn: {
    background: "#e53e3e",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    border: "none",
    fontSize: 15
  }
};
