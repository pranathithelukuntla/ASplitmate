import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupsAPI, settlementsAPI } from '../api/api';
import SettlementForm from '../components/Forms/SettlementForm';

const SettlementView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [memberSummary, setMemberSummary] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [groupRes, balancesRes, settlementsRes, suggestionsRes, memberSummaryRes] = await Promise.all([
        groupsAPI.getById(id),
        settlementsAPI.getBalances(id),
        settlementsAPI.getByGroup(id),
        settlementsAPI.getSuggestions(id),
        settlementsAPI.getMemberSummary(id),
      ]);
      setGroup(groupRes.data);
      setBalances(balancesRes.data);
      setSettlements(settlementsRes.data);
      setSuggestions(suggestionsRes.data);
      setMemberSummary(memberSummaryRes.data);
      setError('');
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      if (err.response) {
        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.status === 404) {
          errorMessage = 'Group not found or you are not a member of this group.';
        } else if (err.response.status === 403) {
          errorMessage = 'You are not a member of this group.';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('SettlementView loadData error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettlementSubmit = async (data) => {
    try {
      const dataWithGroupId = {
        ...data,
        groupId: parseInt(id),
      };
      await settlementsAPI.create(dataWithGroupId);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record settlement');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Calculating settlements...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold">
          {error || 'Group not found'}
        </div>
      </div>
    );
  }

  const groupMembers = group.members?.map((m) => ({
    userId: m.userId,
    userName: m.userName,
  })) || [];

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
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
        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight font-outfit">
          Settlement <span className="text-gradient">Center</span>
        </h1>
        <p className="text-slate-700 font-bold">Finalize balances and settle your dues</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 font-bold flex items-center animate-shake">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Balances Card */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 font-outfit">System Balances</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className={showForm ? 'px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all' : 'btn-primary px-6 py-2'}
            >
              {showForm ? 'Close Form' : 'Record Payment'}
            </button>
          </div>
          <div className="space-y-4">
            {balances.map((balance) => {
              const isSettled = Math.abs(balance.balance) < 0.01;
              const isCreditor = balance.balance > 0;
              return (
                <div
                  key={balance.userId}
                  className={`flex justify-between items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                    isCreditor
                      ? 'bg-emerald-100/30 border-emerald-200'
                      : isSettled
                      ? 'bg-slate-200/20 border-slate-200/30 opacity-60'
                      : 'bg-rose-100/30 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCreditor ? 'bg-emerald-100 text-emerald-700' : isSettled ? 'bg-slate-200 text-slate-500' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {balance.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{balance.userName}</p>
                      {isSettled ? (
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">All Settled ✨</span>
                      ) : (
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isCreditor ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCreditor ? 'To Receive' : 'To Pay'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xl font-black ${isCreditor ? 'text-emerald-600' : isSettled ? 'text-slate-400 font-bold' : 'text-rose-600'}`}>
                    {isSettled ? '₹0.00' : isCreditor ? `+₹${balance.balance.toFixed(2)}` : `-₹${Math.abs(balance.balance).toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions Card */}
        <div className="glass-card p-8 bg-gradient-to-br from-indigo-50/50 to-white">
          <h2 className="text-2xl font-black text-slate-900 mb-8 font-outfit flex items-center">
            Suggested Payments
            <svg className="w-5 h-5 ml-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </h2>
          {suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-emerald-50/30 border-2 border-emerald-100 border-dashed rounded-3xl text-center px-6">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-lg font-black text-emerald-900 mb-1 font-outfit">Perfect Harmony!</p>
              <p className="text-sm font-medium text-emerald-700">All group expenses are completely settled.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((s, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/30 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-extrabold text-slate-900 font-outfit">{s.fromUserName}</span>
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </div>
                      <span className="font-extrabold text-slate-900 font-outfit">{s.toUserName}</span>
                    </div>
                    <span className="text-2xl font-black text-indigo-600">₹{Number(s.amount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="glass-card p-10 mb-12 border-indigo-200 ring-4 ring-indigo-50 animate-fadeIn">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-outfit">Record a Payment</h2>
              <p className="text-slate-500 font-medium text-sm">Update the group balances by logging a direct payment</p>
            </div>
          </div>
          <SettlementForm
            groupMembers={groupMembers}
            onSubmit={handleSettlementSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Summary Table */}
      <div className="glass-card p-8 mb-12 overflow-hidden border-none ring-1 ring-slate-200/50">
        <h2 className="text-2xl font-black text-slate-900 mb-8 font-outfit">Detailed Summary</h2>
        <div className="overflow-x-auto -mx-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-100/30">
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-600">Member</th>
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-600">Total Paid</th>
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-600">Total Received</th>
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-600">Status & Dues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memberSummary.map((m, idx) => (
                <tr key={idx} className="hover:bg-indigo-100/20 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-700">₹{Number(m.totalPaid).toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-700">₹{Number(m.totalReceived).toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6">
                    {m.owes.length === 0 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">Settled</span>
                    ) : (
                      <div className="space-y-1">
                        {m.owes.map((o, i) => (
                          <div key={i} className="text-[11px] font-medium text-slate-500">
                            Owes <span className="text-rose-500 font-bold">{o.toName}</span>: <span className="font-black text-slate-900">₹{Number(o.amount).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Card */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-black text-slate-900 mb-8 font-outfit">Settle-up History</h2>
        {settlements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-slate-400 font-medium">No settlements recorded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="p-5 rounded-2xl border border-white/20 bg-white/30 shadow-sm flex justify-between items-center group hover:border-indigo-100 transition-all">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                   </div>
                   <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      {settlement.payerName} Paid {settlement.receiverName}
                    </p>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">{settlement.settlementDate}</p>
                   </div>
                </div>
                <div className="text-xl font-black text-indigo-600 font-outfit">₹{settlement.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettlementView;
