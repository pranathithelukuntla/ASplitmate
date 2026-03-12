import React, { useState } from 'react';

const SettlementForm = ({ groupMembers, onSubmit, onCancel }) => {
  const [payerId, setPayerId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [settlementDate, setSettlementDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const settlementData = {
      payerId: parseInt(payerId),
      receiverId: parseInt(receiverId),
      amount: parseFloat(amount),
      settlementDate,
    };
    onSubmit(settlementData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Payer</label>
        <select
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select payer</option>
          {groupMembers.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.userName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Receiver</label>
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select receiver</option>
          {groupMembers
            .filter((member) => member.userId !== parseInt(payerId))
            .map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.userName}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={settlementDate}
          onChange={(e) => setSettlementDate(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Record Settlement
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

export default SettlementForm;
