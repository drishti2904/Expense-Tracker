import React from 'react';

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
  const totalsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0);
    return acc;
  }, {});

  const maxCategorySpent = Math.max(...Object.values(totalsByCategory), 1);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const categoryColors = {
    Food: '#F59E0B',
    Transport: '#10B981',
    Bills: '#EF4444',
    Entertainment: '#8B5CF6',
    Other: '#6B7280'
  };

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

      {/* Category Bar Chart */}
      <div className="bg-[#0f1117] p-6 rounded-xl border border-[#2a2d3a]">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">
          Expense Breakdown by Category
        </h3>
        <div className="space-y-4">
          {categories.map(cat => {
            const amount = totalsByCategory[cat];
            const ratio = (amount / maxCategorySpent) * 100;
            const color = categoryColors[cat];
            return (
              <div key={cat} className="flex items-center text-sm gap-3">
                {/* Color dot + label */}
                <div className="flex items-center gap-2 w-28 shrink-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="font-medium text-gray-400 truncate">{cat}</span>
                </div>
                {/* Bar */}
                <div className="flex-1 bg-[#1a1d27] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(ratio, 2)}%`, backgroundColor: color }}
                  />
                </div>
                {/* Amount */}
                <span className="w-24 text-right font-semibold text-gray-300 shrink-0">
                  {formatCurrency(amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}