import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/expense.css";

export default function History() {
  const navigate = useNavigate();

  const [type, setType] = useState("expenses");
  const [data, setData] = useState([]);

  const [filter, setFilter] = useState({
    from: "",
    to: "",
  });

  const fetchHistory = async () => {
    try {
      const params = {};
      if (filter.from) params.from = filter.from;
      if (filter.to) params.to = filter.to;

      const res = await api.get(`/history/${type}`, { params });
      setData(res.data || []);
    } catch (err) {
      console.error("FETCH HISTORY ERROR:", err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [type]);

  const downloadMonthlyPDF = async () => {
    try {
      const res = await api.get(`/history/${type}/monthly-pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-history.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed");
    }
  };

  return (
    <div className="expense-page">
      <button className="back-btn" onClick={() => navigate("/menu")}>
        ←
      </button>

      <div className="expense-card" style={{ width: "90%", maxWidth: 900 }}>
        <h2 style={{ textAlign: "center" }}>History</h2>

        {/* TABS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <button
            className="save-btn"
            style={{ background: type === "expenses" ? "#2f7d57" : "#999" }}
            onClick={() => setType("expenses")}
          >
            Expenses
          </button>

          <button
            className="save-btn"
            style={{ background: type === "bills" ? "#2f7d57" : "#999" }}
            onClick={() => setType("bills")}
          >
            Bills
          </button>

          <button
            className="save-btn"
            style={{ background: type === "ticket-system" ? "#2f7d57" : "#999" }}
            onClick={() => setType("ticket-system")}
          >
            Ticket System
          </button>
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <input
            type="date"
            value={filter.from}
            onChange={(e) => setFilter({ ...filter, from: e.target.value })}
          />
          <input
            type="date"
            value={filter.to}
            onChange={(e) => setFilter({ ...filter, to: e.target.value })}
          />

          <button className="save-btn" onClick={fetchHistory}>
            Apply
          </button>

          <button className="save-btn" onClick={downloadMonthlyPDF}>
            Download PDF
          </button>
        </div>

        {/* TABLE */}
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Date</th>

              {type === "bills" && <th>Type</th>}

              {type === "ticket-system" && <th>Assigned To</th>}

              <th>Description</th>

              {type !== "ticket-system" && <th>Amount</th>}

              {type === "bills" && <th>Download</th>}
              {type === "ticket-system" && <th>Attachments</th>}

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan="7" align="center">
                  No records
                </td>
              </tr>
            )}

            {data.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.date).toLocaleDateString()}</td>

                {type === "bills" && <td>{row.bill_type}</td>}

                {type === "ticket-system" && <td>{row.assigned_to}</td>}

                <td>{row.description}</td>

                {type !== "ticket-system" && <td>{row.amount}</td>}

                {type === "bills" && (
                  <td>
                    <a
                      href={`http://localhost:5000${row.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  </td>
                )}

                {type === "ticket-system" && (
                  <td>
                    {row.attachment_paths
                      ?.split(",")
                      .map((f, i) => (
                        <div key={i}>
                          <a
                            href={`http://localhost:5000${f}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            File {i + 1}
                          </a>
                        </div>
                      ))}
                  </td>
                )}

                <td>{row.status || "Approved"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
