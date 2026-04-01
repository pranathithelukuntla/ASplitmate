import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import AddExpense from './pages/AddExpense';
import SettlementView from './pages/SettlementView';
import Analytics from './pages/Analytics';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden selection:bg-indigo-100 pb-20">
          {/* Animated Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/40 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-violet-400/40 rounded-full blur-[100px] animate-pulse duration-5000"></div>
            <div className="absolute top-[60%] -left-[5%] w-[30%] h-[30%] bg-indigo-400/40 rounded-full blur-[110px] animate-pulse"></div>
            <div className="absolute -bottom-[10%] right-[10%] w-[35%] h-[35%] bg-fuchsia-400/40 rounded-full blur-[110px] animate-pulse duration-7000"></div>
          </div>

          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/new"
              element={
                <ProtectedRoute>
                  <CreateGroup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/:id"
              element={
                <ProtectedRoute>
                  <GroupDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/:id/expense"
              element={
                <ProtectedRoute>
                  <AddExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/:id/settlements"
              element={
                <ProtectedRoute>
                  <SettlementView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/:id/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
