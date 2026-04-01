import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { groupsAPI } from '../api/api';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  // Normalize stored user id: some places store `id`, others `userId`.
  const currentUserId = currentUser?.id ?? currentUser?.userId;
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;
    try {
      await groupsAPI.delete(groupId);
      setGroups(groups.filter(g => g.id !== groupId));
    } catch (err) {
      alert('Failed to delete group. You must be the group creator.');
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await groupsAPI.getAll();
      setGroups(response.data || []);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error loading groups:', err);
      let errorMessage = 'Failed to load groups';
      
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Make sure backend is running on http://localhost:8080';
      } else {
        errorMessage = err.message || 'Failed to load groups';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-700 font-bold animate-pulse">Loading your groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
          Hey, <span className="text-gradient">{currentUser?.name || 'User'}</span>
        </h1>
        <p className="text-lg text-slate-700 font-bold">
          Manage your shared expenses and split bills with ease.
        </p>
      </header>

      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-bold text-slate-800 font-outfit">Your Groups</h2>
        <Link
          to="/groups/new"
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New Group
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 font-bold flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <p className="text-xl font-bold text-slate-800 mb-2">No groups yet</p>
          <p className="text-slate-700 font-bold max-w-xs mb-8">Create your first group to start splitting expenses with your friends and family!</p>
          <Link
            to="/groups/new"
            className="btn-primary"
          >
            Get Started Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <div key={group.id} className="relative group">
              <Link to={`/groups/${group.id}`} className="block">
                <div className="glass-card p-8 h-full flex flex-col border-none ring-1 ring-white/20 hover:ring-indigo-300 shadow-sm transition-all duration-300 bg-white/20">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-indigo-50/50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors font-outfit">{group.name}</h3>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-slate-800">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span className="text-sm font-bold">Creator: {group.createdByName}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <span className="text-sm font-black">{group.members?.length || 0} members</span>
                    </div>
                  </div>
                </div>
              </Link>
              {currentUserId && group.createdById === currentUserId && (
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white"
                  title="Delete Group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
