import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) navigate("/admin/login");
  }, []);

  return (
    <div className="expense-page">
      <div className="expense-card">
        <h2>Admin Dashboard</h2>

        <button
          className="save-btn"
          onClick={() => navigate("/admin/expenses")}
        >
          Expense Approvals
        </button>

        <button
          className="save-btn"
          onClick={() => {
            localStorage.removeItem("admin");
            navigate("/admin/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
