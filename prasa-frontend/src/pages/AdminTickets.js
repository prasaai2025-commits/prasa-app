import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { queueAdminAction } from "../adminOffline";

export default function AdminTickets() {

  const navigate = useNavigate();

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  const [tab, setTab] = useState("pending");

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) navigate("/");

    loadPending();
    loadApproved();
  }, []);

  const loadPending = async () => {
    try {
      const res = await api.get("/admin/tickets/pending");
      setPending(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadApproved = async () => {
    try {
      const res = await api.get("/admin/tickets/approved");
      setApproved(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const approveTicket = async (id) => {
    try {
      await api.put(`/admin/tickets/${id}/approve`);
      loadPending();
      loadApproved();
    } catch {
      await queueAdminAction({
        type: "ticket-approve",
        url: `/admin/tickets/${id}/approve`
      });
      alert("Saved offline. Will sync when internet is back.");
    }
  };

  const rejectTicket = async (id) => {
    try {
      await api.put(`/admin/tickets/${id}/reject`);
      loadPending();
      loadApproved();
    } catch {
      await queueAdminAction({
        type: "ticket-reject",
        url: `/admin/tickets/${id}/reject`
      });
      alert("Saved offline. Will sync when internet is back.");
    }
  };

  return (
    <div className="expense-page">
      <div className="expense-card">

        {/* 🔙 Back to Dashboard */}
        <div
          style={{
            fontSize: "24px",
            color: "#ffffff",
            cursor: "pointer",
            width: "fit-content",
            marginBottom: "8px"
          }}
          onClick={() => navigate("/admin/dashboard")}
        >
          ←
        </div>

        <h2>Ticket Approvals</h2>

        <div style={{ display:"flex", gap:"10px", marginBottom:"10px" }}>
          <button 
            onClick={() => setTab("pending")}
            style={{ background: tab==="pending" ? "#1f6f52" : "#ccc" }}
          >
            Pending
          </button>

          <button 
            onClick={() => setTab("approved")}
            style={{ background: tab==="approved" ? "#1f6f52" : "#ccc" }}
          >
            Approved
          </button>
        </div>

        <div style={{ maxHeight: "420px", overflowY: "auto" }}>

          {tab === "pending" && pending.map(t => (
            <div key={t.id} style={{ borderBottom:"1px solid #ddd", marginBottom:"8px" }}>
              <p><b>ID:</b> {t.id}</p>
              <p><b>Employee:</b> {t.emp_id}</p>
              <p><b>Description:</b> {t.description}</p>
              <p><b>Status:</b> {t.status}</p>

              <button onClick={() => approveTicket(t.id)}>Approve</button>
              <button onClick={() => rejectTicket(t.id)}>Reject</button>
            </div>
          ))}

          {tab === "pending" && pending.length === 0 && <p>No pending tickets</p>}

          {tab === "approved" && approved.map(t => (
            <div key={t.id} style={{ borderBottom:"1px solid #ddd", marginBottom:"8px" }}>
              <p><b>ID:</b> {t.id}</p>
              <p><b>Employee:</b> {t.emp_id}</p>
              <p><b>Description:</b> {t.description}</p>
              <p><b>Status:</b> {t.status}</p>
            </div>
          ))}

          {tab === "approved" && approved.length === 0 && <p>No approved tickets</p>}

        </div>
      </div>
    </div>
  );
}
