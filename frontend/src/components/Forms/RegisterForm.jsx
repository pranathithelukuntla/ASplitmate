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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && !fieldErrors && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {fieldErrors && Object.keys(fieldErrors).length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(fieldErrors).map(([field, msg]) => (
              <li key={field} className="text-sm">
                <span className="capitalize font-medium">{field}:</span> {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldErrors?.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors?.name && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldErrors?.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors?.email && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldErrors?.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        {fieldErrors?.password && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
