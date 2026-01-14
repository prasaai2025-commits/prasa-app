import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function TicketSystem() {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee"));
  const emp_id = employee?.emp_id;

  const [employees, setEmployees] = useState([]);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    ticket_date: "",
    assigned_to: "",
    task: ""
  });

  useEffect(() => {
    if (!emp_id) {
      navigate("/login");
      return;
    }
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/auth/employees", {
        params: { exclude: emp_id }
      });
      setEmployees(res.data || []);
    } catch {
      setEmployees([]);
    }
  };

  const saveTicket = async () => {
    try {
      const fd = new FormData();
      fd.append("emp_id", emp_id);
      fd.append("ticket_date", form.ticket_date);
      fd.append("assigned_to", form.assigned_to);
      fd.append("description", form.task);
      files.forEach(f => fd.append("attachments", f));

      await api.post("/ticket-system", fd);
      alert("Ticket saved");

      setForm({ ticket_date: "", assigned_to: "", task: "" });
      setFiles([]);
    } catch {
      alert("Failed to save ticket");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* 🔙 HEADER WITH BACK + TITLE */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate("/profile")}>
            ←
          </button>
          <h3 style={styles.headerTitle}>Ticket System</h3>
        </div>

        <div style={styles.tabs}>
          <button style={styles.activeTab}>Ticket System</button>
          <button style={styles.tab} onClick={() => navigate("/tickets/pending")}>
            Pending Requests
          </button>
        </div>

        <input
          type="date"
          value={form.ticket_date}
          onChange={e => setForm({ ...form, ticket_date: e.target.value })}
          style={styles.input}
        />

        <select
          value={form.assigned_to}
          onChange={e => setForm({ ...form, assigned_to: e.target.value })}
          style={styles.input}
        >
          <option value="">Assign To</option>
          {employees.map(emp => (
            <option key={emp.emp_id} value={emp.emp_id}>
              {emp.emp_name} ({emp.emp_id})
            </option>
          ))}
        </select>

        <textarea
          placeholder="Task"
          value={form.task}
          onChange={e => setForm({ ...form, task: e.target.value })}
          style={styles.textarea}
        />

        <input
          type="file"
          multiple
          style={styles.fileInput}
          onChange={e => setFiles([...e.target.files])}
        />

        <button style={styles.primaryBtn} onClick={saveTicket}>
          Save Ticket
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
    paddingTop: 40,
    paddingBottom: 20
  },

  card: {
    background: "#fff",
    width: "92%",
    maxWidth: 420,
    borderRadius: 18,
    padding: 18,
    boxSizing: "border-box"
  },

  /* 🔝 HEADER (Arrow + Title inside card) */
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 22,
    marginRight: 10,
    cursor: "pointer"
  },
  headerTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: "#2f855a"
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
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },

  textarea: {
    width: "100%",
    padding: 12,
    height: 90,
    borderRadius: 10,
    border: "1px solid #ccc",
    marginBottom: 12,
    boxSizing: "border-box"
  },

  fileInput: {
    marginBottom: 12
  },

  primaryBtn: {
    width: "100%",
    background: "#2f855a",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    border: "none"
  }
};
