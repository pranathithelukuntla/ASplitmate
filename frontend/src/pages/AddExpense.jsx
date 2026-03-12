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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Expense</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6">
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
