import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="glass-nav">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-extrabold tracking-tight text-gradient font-outfit">
              SplitMate
            </Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Dashboard
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">Account</span>
              <span className="text-sm font-bold text-slate-800">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/40 hover:bg-white/60 border border-white/20 text-slate-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 flex items-center"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
