import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupsAPI, expensesAPI } from '../api/api';
import AddExpenseForm from '../components/Forms/AddExpenseForm';

const AddExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroup();
  }, [id]);

  const loadGroup = async () => {
    try {
      const response = await groupsAPI.getById(id);
      setGroup(response.data);
    } catch (err) {
      setError('Failed to load group');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (expenseData) => {
    try {
      const dataWithGroupId = {
        ...expenseData,
        groupId: parseInt(id),
      };
      await expensesAPI.create(dataWithGroupId);
      navigate(`/groups/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold">
          Group not found
        </div>
      </div>
    );
  }

  const groupMembers = group.members?.map((m) => ({
    userId: m.userId,
    userName: m.userName,
  })) || [];

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl animate-fade-in">
      <div className="mb-10 text-center">
         <button
          onClick={() => navigate(`/groups/${id}`)}
          className="group flex items-center text-indigo-600 hover:text-indigo-700 font-bold mb-8 mx-auto transition-all"
        >
          <svg className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Group
        </button>
        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight font-outfit">Add <span className="text-gradient">Expense</span></h1>
        <p className="text-slate-500 font-medium">Split bills effortlessly with your group</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 font-bold flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      )}

      <div className="glass-card p-10">
        <AddExpenseForm
          groupMembers={groupMembers}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/groups/${id}`)}
        />
      </div>
    </div>
  );
};

export default AddExpense;
