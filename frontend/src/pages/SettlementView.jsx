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
      {/* Member Settlement Summary Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Member Settlement Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Member</th>
                <th className="px-4 py-2 text-left">Total Paid</th>
                <th className="px-4 py-2 text-left">Total Received</th>
                <th className="px-4 py-2 text-left">Owes</th>
              </tr>
            </thead>
            <tbody>
              {memberSummary.map((m, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2 font-medium">{m.name}</td>
                  <td className="px-4 py-2">₹{Number(m.totalPaid).toFixed(2)}</td>
                  <td className="px-4 py-2">₹{Number(m.totalReceived).toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {m.owes.length === 0 ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <ul className="list-disc pl-4">
                        {m.owes.map((o, i) => (
                          <li key={i}>{`Owes ${o.toName}: ₹${Number(o.amount).toFixed(2)}`}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/groups/${id}`)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Group
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlements</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Balances</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
            >
              {showForm ? 'Cancel' : 'Record Settlement'}
            </button>
          </div>
          <div className="space-y-2">
            {balances.map((balance) => (
              <div
                key={balance.userId}
                className={`flex justify-between items-center p-3 rounded ${
                  balance.balance > 0
                    ? 'bg-green-50 border border-green-200'
                    : balance.balance < 0
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="font-medium">{balance.userName}</span>
                <span
                  className={`font-semibold ${
                    balance.balance > 0
                      ? 'text-green-600'
                      : balance.balance < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {balance.balance > 0 ? '+' : ''}₹{balance.balance.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Settlement Suggestions */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Who Pays Whom</h2>
          {suggestions.length === 0 ? (
            <p className="text-gray-600">All balances are settled!</p>
          ) : (
            <div className="space-y-2">
              {suggestions.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded bg-blue-50 border border-blue-200">
                  <span className="font-medium">{s.fromUserName} pays {s.toUserName}</span>
                  <span className="font-semibold text-blue-700">₹{Number(s.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Record Settlement</h2>
            <SettlementForm
              groupMembers={groupMembers}
              onSubmit={handleSettlementSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Settlement History</h2>
        {settlements.length === 0 ? (
          <p className="text-gray-600">No settlements recorded yet</p>
        ) : (
          <div className="space-y-3">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {settlement.payerName} → {settlement.receiverName}
                    </p>
                    <p className="text-sm text-gray-500">{settlement.settlementDate}</p>
                  </div>
                  <div className="text-lg font-semibold">₹{settlement.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettlementView;
