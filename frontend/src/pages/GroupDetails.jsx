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
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-700 font-bold animate-pulse">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="px-8 bg-white/40 border border-white/20 text-slate-600 py-4 rounded-2xl font-bold hover:bg-white/60 transition-all active:scale-[0.98]">
          {error || 'Group not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <Link to="/dashboard" className="group flex items-center text-indigo-600 hover:text-indigo-700 font-bold mb-6 transition-all">
          <svg className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight font-outfit">{group.name}</h1>
            <div className="flex items-center text-slate-800 font-bold">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold mr-3 uppercase tracking-wider">Group</span>
              Created by <span className="text-slate-800 font-bold ml-1">{group.createdByName}</span>
            </div>
          </div>
          <div className="flex gap-3">
             <Link
              to={`/groups/${id}/expense`}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Expense
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: 'Home', link: `/groups/${id}/expense`, icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'bg-indigo-50 text-indigo-600', label: 'Add Expense' },
          { title: 'Settlements', link: `/groups/${id}/settlements`, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-emerald-50 text-emerald-600', label: 'View Balances' },
          { title: 'Analytics', link: `/groups/${id}/analytics`, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v12', color: 'bg-amber-50 text-amber-600', label: 'View Spending' }
        ].map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="glass-card p-8 group hover:scale-[1.02] transition-all"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon}></path>
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1 font-outfit">{item.title}</h3>
            <p className="text-slate-700 font-bold text-sm">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 self-start">
          <div className="bg-indigo-50/40 p-4 rounded-2xl shadow-sm border border-indigo-100/30 flex-1 md:flex-none">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 font-outfit">Members</h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-xs">{group.members?.length || 0}</span>
            </div>
            
            <form onSubmit={handleAddMember} className="space-y-3 mb-10">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="User Name"
                className="w-full input-premium text-sm font-medium"
                disabled={addingMember}
              />
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="User Email (optional)"
                className="w-full input-premium text-sm font-medium"
                disabled={addingMember}
              />
              <button
                type="submit"
                disabled={addingMember}
                className="w-full btn-primary py-3 rounded-xl shadow-indigo-100 disabled:opacity-50"
              >
                {addingMember ? 'Adding...' : 'Add Member'}
              </button>
            </form>

            <div className="space-y-4">
              {group.members?.map((member) => (
                <div key={member.userId} className="flex items-center p-3 rounded-2xl hover:bg-indigo-100/30 transition-colors group">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm mr-4 group-hover:scale-105 transition-transform">
                    {member.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{member.userName}</p>
                    <p className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">{member.userEmail || 'No email'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass-card p-8 ring-1 ring-slate-200/50 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 font-outfit">Recent Activity</h2>
              <Link to={`/groups/${id}/expense`} className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
            </div>
            
            {expenses.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center bg-indigo-100/20 rounded-3xl text-center">
                <div className="w-16 h-16 bg-indigo-100/30 text-indigo-300 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-slate-500 font-medium mb-4">No expenses recorded yet.</p>
                <Link to={`/groups/${id}/expense`} className="text-indigo-600 font-bold">Add first expense</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.slice(0, 8).map((expense) => (
                  <div key={expense.id} className="p-5 rounded-2xl border border-white/20 hover:border-indigo-200 hover:bg-indigo-100/20 transition-all group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white/40 ring-1 ring-white/20 rounded-xl flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition-transform">
                          {/* Could map category to emoji here */}
                          💰
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm mb-0.5">{expense.title}</h3>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                            {expense.categoryName} • Paid by {expense.paidByName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-900">₹{expense.totalAmount}</p>
                        <p className="text-[10px] font-black text-slate-600 mt-0.5 uppercase">{expense.expenseDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
