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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your SplitMate account
          </h2>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <RegisterForm onSubmit={handleSubmit} error={error} fieldErrors={fieldErrors} />
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
