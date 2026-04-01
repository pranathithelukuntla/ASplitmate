import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/Forms/RegisterForm';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (data) => {
    setError('');
    setFieldErrors({});
    const result = await register(data.name, data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setFieldErrors(result.fieldErrors || {});
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
            Join <span className="text-gradient">SplitMate</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Start splitting expenses with friends today
          </p>
        </div>
        <div className="glass-card p-10">
          <RegisterForm onSubmit={handleSubmit} error={error} fieldErrors={fieldErrors} />
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-bold decoration-2 underline-offset-4 hover:underline transition-all">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
