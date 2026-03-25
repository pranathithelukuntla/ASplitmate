import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../api/api';

const AddExpenseForm = ({ groupMembers, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState([]);
  // selectedIds: set of userIds who are included in the split (default: all members)
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    categoriesAPI.getAll().then((res) => setCategories(res.data));
  }, []);

  // When group members load, select all by default
  useEffect(() => {
    if (groupMembers.length > 0) {
      setSelectedIds(new Set(groupMembers.map((m) => m.userId)));
    }
  }, [groupMembers]);

  // Toggle a member in/out of the split
  const toggleMember = (userId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  // Compute the per-person share
  const selectedCount = selectedIds.size;
  const total = parseFloat(totalAmount) || 0;
  const perPerson = selectedCount > 0 ? total / selectedCount : 0;

  // Build the splits array from selected members
  const splits = groupMembers
    .filter((m) => selectedIds.has(m.userId))
    .map((m) => ({ userId: m.userId, amount: parseFloat(perPerson.toFixed(2)) }));

  // Floating-point rounding guard: adjust last person's share so it sums exactly
  if (splits.length > 0) {
    const sumExceptLast = splits.slice(0, -1).reduce((s, x) => s + x.amount, 0);
    splits[splits.length - 1].amount = parseFloat((total - sumExceptLast).toFixed(2));
  }

  const totalSplit = splits.reduce((s, x) => s + x.amount, 0);
  const difference = parseFloat((total - totalSplit).toFixed(2));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCount === 0) return;
    onSubmit({
      title,
      totalAmount: total,
      categoryId: parseInt(categoryId),
      expenseDate,
      splits,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
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

      {/* Total Amount */}
      <div>
        <label className="block text-sm font-medium mb-1">Total Amount (₹)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
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

      {/* Date */}
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

      {/* Split Among */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Split Among ({selectedCount} of {groupMembers.length} selected)
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
          {groupMembers.map((member) => {
            const isSelected = selectedIds.has(member.userId);
            const share = isSelected ? perPerson.toFixed(2) : '—';
            return (
              <div
                key={member.userId}
                className="flex items-center justify-between gap-3"
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleMember(member.userId)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className={`text-sm ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>
                    {member.userName}
                  </span>
                </label>
                <span className={`text-sm font-medium w-20 text-right ${isSelected ? 'text-blue-700' : 'text-gray-300'}`}>
                  {isSelected ? `₹${share}` : '—'}
                </span>
              </div>
            );
          })}
        </div>

        {selectedCount === 0 && (
          <p className="mt-1 text-xs text-red-600">Please select at least one member to split with.</p>
        )}

        {selectedCount > 0 && total > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            ₹{total.toFixed(2)} ÷ {selectedCount} member{selectedCount > 1 ? 's' : ''} = <strong>₹{perPerson.toFixed(2)}</strong> each
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={selectedCount === 0 || difference !== 0 || total <= 0}
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
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
