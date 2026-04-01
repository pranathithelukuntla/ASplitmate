import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/Forms/LoginForm';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
            Welcome <span className="text-gradient">Back</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Sign in to continue managing your expenses
          </p>
        </div>
        <div className="glass-card p-10">
          <LoginForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-600">
              New to SplitMate?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-bold decoration-2 underline-offset-4 hover:underline transition-all">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
