import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const CATEGORY_COLORS = {
  Food:          '#F59E0B',
  Transport:     '#10B981',
  Bills:         '#EF4444',
  Entertainment: '#8B5CF6',
  Other:         '#6B7280'
};

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8, padding: '8px 12px' }}>
        <p style={{ color: '#d1d5db', fontSize: 12, fontWeight: 600 }}>{payload[0].name}</p>
        <p style={{ color: '#f5c842', fontSize: 12, fontWeight: 700 }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8, padding: '8px 12px' }}>
        <p style={{ color: '#d1d5db', fontSize: 12, fontWeight: 600 }}>{label}</p>
        <p style={{ color: '#f5c842', fontSize: 12, fontWeight: 700 }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ expenses }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpentThisMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const highestSingleExpense = expenses.length > 0
    ? Math.max(...expenses.map(exp => exp.amount))
    : 0;

  const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

  const chartData = categories.map(cat => ({
    name: cat,
    value: expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0),
    color: CATEGORY_COLORS[cat]
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-6">

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f1117] p-5 rounded-xl border border-[#2a2d3a] flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Spent This Month</span>
          <span className="text-2xl font-bold text-amber-400 mt-3">{formatCurrency(totalSpentThisMonth)}</span>
        </div>
        <div className="bg-[#0f1117] p-5 rounded-xl border border-[#2a2d3a] flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Highest Single Spend</span>
          <span className="text-2xl font-bold text-violet-400 mt-3">{formatCurrency(highestSingleExpense)}</span>
        </div>
        <div className="bg-[#0f1117] p-5 rounded-xl border border-[#2a2d3a] flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">All-Time Total</span>
          <span className="text-2xl font-bold text-emerald-400 mt-3">
            {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
          </span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Pie Chart */}
        <div className="bg-[#0f1117] p-5 rounded-xl border border-[#2a2d3a]">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Spending Share
          </h3>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-600 text-sm italic">
              No data yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 justify-center">
                {chartData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-[#0f1117] p-5 rounded-xl border border-[#2a2d3a]">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Breakdown by Category
          </h3>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-600 text-sm italic">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: '#2a2d3a' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

    </div>
  );
}