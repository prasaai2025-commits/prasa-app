import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import AddNew from "./pages/AddNew";

import Expenses from "./pages/Expenses";
import PendingExpenses from "./pages/PendingExpenses";

import TicketSystem from "./pages/TicketSystem";
import PendingTickets from "./pages/PendingTickets";

import History from "./pages/History";
import Graph from "./pages/Graph";

import AdminExpenses from "./pages/AdminExpenses";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTickets from "./pages/AdminTickets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* EMPLOYEE */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-new" element={<AddNew />} />

        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/pending" element={<PendingExpenses />} />

        <Route path="/ticket-system" element={<TicketSystem />} />
        <Route path="/tickets/pending" element={<PendingTickets />} />

        <Route path="/history" element={<History />} />
        <Route path="/graph" element={<Graph />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/expenses" element={<AdminExpenses />} />
        <Route path="/admin/tickets" element={<AdminTickets />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
