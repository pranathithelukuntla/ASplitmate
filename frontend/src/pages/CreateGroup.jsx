import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupsAPI } from '../api/api';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await groupsAPI.create({ name });
      navigate(`/groups/${response.data.id}`);
    } catch (err) {
      console.error('Error creating group:', err);
      let errorMessage = 'Failed to create group';
      
      if (err.response) {
        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.errors) {
          const errors = Object.values(err.response.data.errors).join(', ');
          errorMessage = `Validation errors: ${errors}`;
        } else {
          errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = 'Cannot connect to server. Make sure backend is running on http://localhost:8080';
      } else {
        errorMessage = err.message || 'Failed to create group';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl animate-fade-in relative">
      <div className="mb-10 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="group flex items-center text-indigo-600 hover:text-indigo-700 font-bold mb-8 mx-auto transition-all"
        >
          <svg className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight font-outfit">Create <span className="text-gradient">Group</span></h1>
        <p className="text-slate-500 font-medium">Start a new group to track and split expenses together</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 font-bold flex items-center animate-shake">
           <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      )}

      <div className="glass-card p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Summer Trip ✈️"
              className="w-full input-premium py-4 font-bold text-lg"
              disabled={loading}
            />
            <p className="text-xs text-slate-400 font-medium ml-1">Tip: Choose a descriptive name your friends will recognize.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-4 rounded-2xl shadow-indigo-100 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Group...</span>
                </div>
              ) : 'Create Group 🎉'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 bg-white/40 border border-white/20 text-slate-600 py-4 rounded-2xl font-bold hover:bg-white/60 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
