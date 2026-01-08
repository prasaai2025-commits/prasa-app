import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function TicketSystem() {

  const navigate = useNavigate();
  const emp_id = localStorage.getItem("emp_id");

  const [files, setFiles] = useState([]);

  const [form, setForm] = useState({
    ticket_date: "",
    description: "",
    assigned_to: "",
  });

  const reset = () => {
    setForm({
      ticket_date: "",
      description: "",
      assigned_to: "",
    });
    setFiles([]);
  };

  const saveTicket = async () => {
    try {
      const fd = new FormData();
      fd.append("emp_id", emp_id);
      fd.append("ticket_date", form.ticket_date);
      fd.append("description", form.description);
      fd.append("assigned_to", form.assigned_to);

      files.forEach(f => fd.append("attachments", f));

      await api.post("/ticket-system", fd);

      alert("Ticket saved");
      reset();
    } catch (err) {
      console.error(err);
      alert("Ticket save failed");
    }
  };

  return (
    <div
      className="expense-page"
      style={{ position: "relative", minHeight: "100vh" }}
    >

      {/* 🔙 white back arrow → ADD NEW */}
      <button
        onClick={() => navigate(-1)}   // safe back
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: 26,
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        ←
      </button>

      {/* CARD */}
      <div className="expense-card">

        {/* TABS INSIDE CARD */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 12
          }}
        >
          <button
            style={{
              background: "#2f8158",
              color: "white",
              borderRadius: 6,
              padding: "6px 14px",
              border: "none",
              fontWeight: "bold"
            }}
          >
            Ticket System
          </button>

          <button
            style={{
              background: "#e6e6e6",
              borderRadius: 6,
              padding: "6px 14px",
              border: "none"
            }}
            onClick={() => navigate("/tickets/pending")}
          >
            Pending Requests
          </button>
        </div>

        {/* FORM */}
        <input
          type="date"
          value={form.ticket_date}
          onChange={(e) => setForm({ ...form, ticket_date: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="text"
          placeholder="Assign To"
          value={form.assigned_to}
          onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <button className="save-btn" onClick={saveTicket}>
          Save Ticket
        </button>
      </div>
    </div>
  );
}
