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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700 ml-1">What was it for?</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Dinner, Movie, Groceries..."
            className="w-full input-premium font-medium"
          />
        </div>

        {/* Total Amount */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700 ml-1">How much? (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
              placeholder="0.00"
              className="w-full input-premium pl-8 font-bold text-lg text-indigo-600"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700 ml-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full input-premium font-medium appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
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
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700 ml-1">When?</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
            className="w-full input-premium font-medium"
          />
        </div>
      </div>

      {/* Split Among */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-bold text-slate-800 ml-1 uppercase tracking-wider">
            Split Among
          </label>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black">
            {selectedCount} selected
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {groupMembers.map((member) => {
            const isSelected = selectedIds.has(member.userId);
            const share = isSelected ? perPerson.toFixed(2) : '--';
            return (
              <div
                key={member.userId}
                onClick={() => toggleMember(member.userId)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected 
                  ? 'border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-50' 
                  : 'border-white/20 bg-white/30 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white/40 border-white/30'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-500'}`}>
                    {member.userName}
                  </span>
                </div>
                {isSelected && total > 0 && (
                  <span className="text-sm font-black text-indigo-600 bg-white px-2 py-1 rounded-lg shadow-sm">
                    ₹{share}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {selectedCount === 0 && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Please select at least one person.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={selectedCount === 0 || difference !== 0 || total <= 0}
          className="flex-1 btn-primary py-4 rounded-2xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-black"
        >
          Add Expense 🎉
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-10 bg-white/40 border border-white/20 text-slate-600 py-4 rounded-2xl font-bold hover:bg-white/60 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddExpenseForm;
