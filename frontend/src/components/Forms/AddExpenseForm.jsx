import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../api/api';

const AddExpenseForm = ({ groupMembers, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [splits, setSplits] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoriesAPI.getAll().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    // Always split equally among all members when totalAmount or groupMembers changes
    if (groupMembers.length > 0) {
      const total = parseFloat(totalAmount) || 0;
      const equalAmount = total / groupMembers.length;
      setSplits(
        groupMembers.map((member) => ({
          userId: member.userId,
          amount: equalAmount.toFixed(2),
        }))
      );
    }
  }, [groupMembers, totalAmount]);

  // Remove handleSplitChange, splits are now always auto-calculated and read-only

  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseData = {
      title,
      totalAmount: parseFloat(totalAmount),
      categoryId: parseInt(categoryId),
      expenseDate,
      splits: splits.map((s) => ({
        userId: s.userId,
        amount: parseFloat(s.amount),
      })),
    };
    onSubmit(expenseData);
  };

  const totalSplit = splits.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
  const difference = (parseFloat(totalAmount) || 0) - totalSplit;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Total Amount</label>
        <input
          type="number"
          step="0.01"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Split Among Members</label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {groupMembers.map((member) => {
            const split = splits.find((s) => s.userId === member.userId);
            return (
              <div key={member.userId} className="flex items-center justify-between">
                <span className="text-sm">{member.userName}</span>
                <input
                  type="number"
                  step="0.01"
                  value={split?.amount || 0}
                  readOnly
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm bg-gray-100"
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-sm">
          <span className={difference === 0 ? 'text-green-600' : 'text-red-600'}>
            Total Split: {totalSplit.toFixed(2)} | Difference: {difference.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={difference !== 0}
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Add Expense
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddExpenseForm;
