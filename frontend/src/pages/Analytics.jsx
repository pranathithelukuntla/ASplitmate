import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupsAPI, analyticsAPI } from '../api/api';
import BarChart from '../components/Charts/BarChart';
import PieChart from '../components/Charts/PieChart';
import LineChart from '../components/Charts/LineChart';

const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [groupRes, analyticsRes] = await Promise.all([
        groupsAPI.getById(id),
        analyticsAPI.getGroupAnalytics(id),
      ]);
      setGroup(groupRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !group || !analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Analytics not available'}
        </div>
      </div>
    );
  }

  const categoryData = Object.entries(analytics.categoryWise || {}).map(([name, value]) => ({
    name,
    total: parseFloat(value),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/groups/${id}`)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Group
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics - {group.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-2">Total Expense</h2>
        <p className="text-4xl font-bold text-blue-600">
          ₹{analytics.totalExpense?.toFixed(2) || '0.00'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Category-wise Expenses</h3>
          {categoryData.length > 0 ? (
            <PieChart data={analytics.categoryWise} />
          ) : (
            <p className="text-gray-600">No category data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Monthly Trends</h3>
          {analytics.monthlyTrends && analytics.monthlyTrends.length > 0 ? (
            <LineChart data={analytics.monthlyTrends} />
          ) : (
            <p className="text-gray-600">No monthly data available</p>
          )}
        </div>
      </div>

      {categoryData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
          <BarChart data={categoryData} dataKey="name" name="Amount" />
        </div>
      )}
    </div>
  );
};

export default Analytics;
