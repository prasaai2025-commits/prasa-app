import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import PendingExpenses from "./pages/PendingExpenses";
import TicketSystem from "./pages/TicketSystem";
import PendingTickets from "./pages/PendingTickets";
import History from "./pages/History";
import Graph from "./pages/Graph";

/* ADMIN PAGES */
import AdminDashboard from "./pages/AdminDashboard";
import AdminExpenses from "./pages/AdminExpenses";
import AdminPendingRequests from "./pages/AdminPendingRequests";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* EMPLOYEE ROUTES */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/expenses" element={<Expenses />} />
        <Route path="/pending-expenses" element={<PendingExpenses />} />
        <Route path="/expenses/pending" element={<PendingExpenses />} />

        <Route path="/ticket-system" element={<TicketSystem />} />
        <Route path="/tickets/pending" element={<PendingTickets />} />

        <Route path="/history" element={<History />} />
        <Route path="/graphs" element={<Graph />} />

        {/* ADMIN ROUTES (THIS WAS MISSING) */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-expenses" element={<AdminExpenses />} />
        <Route path="/admin-pending-requests" element={<AdminPendingRequests />} />

        {/* FALLBACK */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
