import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { groupsAPI, expensesAPI } from '../api/api';

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    loadGroupData();
  }, [id]);

  const loadGroupData = async () => {
    try {
      const [groupRes, expensesRes] = await Promise.all([
        groupsAPI.getById(id),
        expensesAPI.getByGroup(id),
      ]);
      setGroup(groupRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      setError('Failed to load group data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!userName.trim() && !userEmail.trim()) {
      alert('Please enter a user name or email');
      return;
    }
    setAddingMember(true);
    try {
      const response = await groupsAPI.addMember(id, { userName, userEmail });
      setGroup(response.data);
      setUserName('');
      setUserEmail('');
      alert('Member added successfully!');
    } catch (err) {
      console.error('Error adding member:', err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Failed to add member. Make sure the user name or email is valid.');
      }
    } finally {
      setAddingMember(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Group not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
        <p className="text-gray-600">Created by: {group.createdByName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Link
          to={`/groups/${id}/expense`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
        >
          <h3 className="text-lg font-semibold mb-2">Add Expense</h3>
          <p className="text-gray-600">Record a new expense</p>
        </Link>
        <Link
          to={`/groups/${id}/settlements`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
        >
          <h3 className="text-lg font-semibold mb-2">Settlements</h3>
          <p className="text-gray-600">View balances & settlements</p>
        </Link>
        <Link
          to={`/groups/${id}/analytics`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
        >
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-gray-600">View expense analytics</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Members</h2>
        
        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="mb-6 pb-6 border-b">
          <div className="flex gap-2">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter User Name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={addingMember}
            />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Or Enter User Email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={addingMember}
            />
            <button
              type="submit"
              disabled={addingMember}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {addingMember ? 'Adding...' : 'Add Member'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: You can add by name or email.
          </p>
        </form>

        {/* Members List */}
        <div className="space-y-2">
          {group.members?.map((member) => (
            <div key={member.userId} className="flex justify-between items-center py-2 border-b">
              <span>{member.userName}</span>
              <span className="text-sm text-gray-500">{member.userEmail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-600">No expenses yet</p>
        ) : (
          <div className="space-y-4">
            {expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{expense.title}</h3>
                    <p className="text-sm text-gray-600">
                      {expense.categoryName} • Paid by {expense.paidByName}
                    </p>
                    <p className="text-sm text-gray-500">{expense.expenseDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">₹{expense.totalAmount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
