import React, { useState } from 'react';

const RegisterForm = ({ onSubmit, error, fieldErrors }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && !fieldErrors && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold animate-shake">
          {error}
        </div>
      )}
      {fieldErrors && Object.keys(fieldErrors).length > 0 && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl">
          <p className="font-bold text-sm mb-2">Please fix the following:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {Object.entries(fieldErrors).map(([field, msg]) => (
              <li key={field} className="text-xs">
                <span className="capitalize font-bold">{field}:</span> {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-slate-700 ml-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Doe"
          className={`w-full input-premium font-medium ${
            fieldErrors?.name ? 'border-red-300 ring-4 ring-red-50' : ''
          }`}
        />
        {fieldErrors?.name && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{fieldErrors.name}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-slate-700 ml-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className={`w-full input-premium font-medium ${
            fieldErrors?.email ? 'border-red-300 ring-4 ring-red-50' : ''
          }`}
        />
        {fieldErrors?.email && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{fieldErrors.email}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="••••••••"
          className={`w-full input-premium font-medium ${
            fieldErrors?.password ? 'border-red-300 ring-4 ring-red-50' : ''
          }`}
        />
        <div className="flex justify-between items-center ml-1">
          <p className="text-[10px] text-slate-400 font-medium">Minimum 6 characters</p>
          {fieldErrors?.password && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{fieldErrors.password}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full btn-primary text-white py-3 rounded-xl mt-4 font-bold shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98]"
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
