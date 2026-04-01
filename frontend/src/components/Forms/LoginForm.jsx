import React, { useState } from 'react';

const LoginForm = ({ onSubmit, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold animate-shake">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-slate-700 ml-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          disabled={isLoading}
          className="w-full input-premium placeholder:text-slate-600 font-medium"
        />
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          disabled={isLoading}
          className="w-full input-premium placeholder:text-slate-400 font-medium"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded-xl transition-all duration-200 font-bold flex items-center justify-center ${
          isLoading 
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
          : 'btn-primary'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Signing in...</span>
          </div>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
