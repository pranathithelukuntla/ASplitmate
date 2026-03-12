import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChart = ({ data }) => {
  const chartData = (data || []).map((item) => ({
    month: item.yearMonth,
    total: parseFloat(item.total),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Expense" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
