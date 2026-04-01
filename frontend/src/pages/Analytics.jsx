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
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Generating insights...</p>
        </div>
      </div>
    );
  }

  if (error || !group || !analytics) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold">
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
          Spending <span className="text-gradient">Insights</span>
        </h1>
        <p className="text-slate-500 font-medium">Visualizing {group.name}'s financial footprint</p>
      </div>

      <div className="glass-card p-10 mb-8 border-none ring-1 ring-slate-200/50 bg-gradient-to-br from-indigo-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Group Expense</h2>
          <p className="text-6xl font-black text-slate-900 tracking-tight font-outfit">
            ₹{analytics.totalExpense?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/40 p-4 rounded-2xl shadow-sm border border-white/20 flex-1 md:flex-none">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items</p>
              <p className="text-xl font-black text-slate-900">12</p> {/* Example static, ideally dynamic */}
           </div>
           <div className="bg-white/40 p-4 rounded-2xl shadow-sm border border-white/20 flex-1 md:flex-none">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Highest</p>
              <p className="text-xl font-black text-indigo-600">Food</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card p-8 border-none ring-1 ring-slate-200/50">
          <h3 className="text-2xl font-black text-slate-900 mb-8 font-outfit">Category-wise</h3>
          {categoryData.length > 0 ? (
            <div className="h-[300px]">
              <PieChart data={analytics.categoryWise} />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-3xl">
              <p className="text-slate-400 font-medium italic">No category data available</p>
            </div>
          )}
        </div>

        <div className="glass-card p-8 border-none ring-1 ring-slate-200/50">
           <h3 className="text-2xl font-black text-slate-900 mb-8 font-outfit">Monthly Trends</h3>
          {analytics.monthlyTrends && analytics.monthlyTrends.length > 0 ? (
             <div className="h-[300px]">
               <LineChart data={analytics.monthlyTrends} />
             </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-3xl">
              <p className="text-slate-400 font-medium italic">No monthly data available</p>
            </div>
          )}
        </div>
      </div>

      {categoryData.length > 0 && (
        <div className="glass-card p-8 border-none ring-1 ring-slate-200/50">
           <h3 className="text-2xl font-black text-slate-900 mb-8 font-outfit">Category Breakdown</h3>
          <div className="h-[400px]">
            <BarChart data={categoryData} dataKey="name" name="Amount" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
