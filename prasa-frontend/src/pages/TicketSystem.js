import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function TicketSystem() {
  const navigate = useNavigate();
  const emp_id = "EMP001";

  const [employees, setEmployees] = useState([]);
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);

  const [form, setForm] = useState({
    ticket_date: "",
    description: "",
    assigned_to: "",
  });

  useEffect(() => {
    api.get(`/auth/employees?exclude=${emp_id}`)
      .then((r) => setEmployees(r.data));

    loadActiveTickets();
  }, []);

  const loadActiveTickets = async () => {
    const res = await api.get("/ticket-system/active");
    setRows(res.data);
  };

  const saveTicket = async () => {
    const fd = new FormData();
    fd.append("emp_id", emp_id);
    fd.append("ticket_date", form.ticket_date);
    fd.append("description", form.description);
    fd.append("assigned_to", form.assigned_to);
    files.forEach(f => fd.append("attachments", f));

    await api.post("/ticket-system", fd);
    loadActiveTickets();
  };

  const acceptTicket = async (id) => {
    await api.put(`/ticket-system/${id}/accept`);
    loadActiveTickets();
  };

  const completeTicket = async (id) => {
    await api.put(`/ticket-system/${id}/complete`);
    loadActiveTickets();
  };

  return (
    <div className="expense-page">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>

      <div className="expense-card">
        <h2>Ticket System</h2>

        <input
          type="date"
          value={form.ticket_date}
          onChange={(e) => setForm({ ...form, ticket_date: e.target.value })}
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          value={form.assigned_to}
          onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
        >
          <option value="">Assign To</option>
          {employees.map((e) => (
            <option key={e.emp_id} value={e.emp_id}>
              {e.emp_name}
            </option>
          ))}
        </select>

        <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />

        <button className="save-btn" onClick={saveTicket}>Save Ticket</button>
      </div>

      <div className="expense-card" style={{ marginTop: 16 }}>
        <h3>WIP / Pending Tickets</h3>

        {rows.map((r) => (
          <div key={r.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
            <div><b>Date:</b> {r.ticket_date}</div>
            <div><b>Description:</b> {r.description}</div>
            <div><b>Status:</b> {r.status}</div>

            {r.status === "pending" && (
              <button onClick={() => acceptTicket(r.id)}>Accept</button>
            )}

            {r.status === "WIP" && (
              <button onClick={() => completeTicket(r.id)}>Complete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
