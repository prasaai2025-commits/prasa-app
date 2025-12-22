import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import api from "../api";

ChartJS.register(ArcElement, Tooltip, Legend);

const Graph = () => {
  const navigate = useNavigate();

  const employee = JSON.parse(localStorage.getItem("employee"));
  const emp_id = employee?.emp_id;

  const [expense, setExpense] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [ticket, setTicket] = useState({
    completed: 0,
    wip: 0,
    pending: 0,
  });

  useEffect(() => {
    if (emp_id) {
      loadExpense();
      loadTicket();
    }
  }, [emp_id]);

  const loadExpense = async () => {
    const res = await api.get(`/expenses/employee/summary/${emp_id}`);
    setExpense(res.data);
  };

  const loadTicket = async () => {
    const res = await api.get(`/ticket-system/employee/summary/${emp_id}`);
    setTicket(res.data);
  };

  const totalExpense =
    expense.approved + expense.pending + expense.rejected;

  const expenseData = {
    labels: [
      `Approved (${percent(expense.approved, totalExpense)}%)`,
      `Pending (${percent(expense.pending, totalExpense)}%)`,
      `Rejected (${percent(expense.rejected, totalExpense)}%)`,
    ],
    datasets: [
      {
        data: [
          expense.approved,
          expense.pending,
          expense.rejected,
        ],
        backgroundColor: ["#2e7d32", "#f9a825", "#c62828"],
      },
    ],
  };

  const ticketData = {
    labels: [
      `Completed (${ticket.completed})`,
      `WIP (${ticket.wip})`,
      `Pending (${ticket.pending})`,
    ],
    datasets: [
      {
        data: [
          ticket.completed,
          ticket.wip,
          ticket.pending,
        ],
        backgroundColor: ["#1b5e20", "#ffb300", "#1565c0"],
      },
    ],
  };

  function percent(v, t) {
    return t === 0 ? 0 : ((v / t) * 100).toFixed(1);
  }

  return (
    <div
      style={{
        background: "#e8f5e9",
        minHeight: "100vh",
        padding: "12px",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "22px",
            cursor: "pointer",
            color: "#1b5e20",
            marginRight: "8px",
          }}
        >
          ←
        </button>

        <h3 style={{ color: "#1b5e20", margin: 0 }}>
          My Monthly Summary
        </h3>
      </div>

      {/* EXPENSE PIE */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "12px",
          marginBottom: "16px",
          maxWidth: "360px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h4 style={{ textAlign: "center", marginBottom: "8px" }}>
          Expense Status
        </h4>

        <div
          style={{
            width: "240px",
            height: "240px",
            margin: "0 auto",
          }}
        >
          <Pie
            data={expenseData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    boxWidth: 12,
                    font: { size: 11 },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* TICKET PIE */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "12px",
          maxWidth: "360px",
          margin: "0 auto",
        }}
      >
        <h4 style={{ textAlign: "center", marginBottom: "8px" }}>
          Ticket Status
        </h4>

        <div
          style={{
            width: "240px",
            height: "240px",
            margin: "0 auto",
          }}
        >
          <Pie
            data={ticketData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    boxWidth: 12,
                    font: { size: 11 },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Graph;
