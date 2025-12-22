import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import AddNew from "./pages/AddNew";

import Expenses from "./pages/Expenses";
import TicketSystem from "./pages/TicketSystem";

import History from "./pages/History";
import Graph from "./pages/Graph";

import AdminExpenses from "./pages/AdminExpenses";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔑 MAIN LOGIN (ONLY ONE ENTRY POINT) */}
        <Route path="/login" element={<Login />} />

        {/* Default root → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* EMPLOYEE ROUTES */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-new" element={<AddNew />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/ticket-system" element={<TicketSystem />} />
        <Route path="/history" element={<History />} />
        <Route path="/graph" element={<Graph />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/expenses" element={<AdminExpenses />} />

        {/* 🔥 SAFETY NET – NO BLANK PAGE EVER */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
