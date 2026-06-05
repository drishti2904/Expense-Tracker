import React, { useState } from 'react';
import { Edit2, Trash2, Download } from 'lucide-react';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filteredExpenses = expenses.filter(exp => {
    if (categoryFilter !== 'All' && exp.category !== categoryFilter) return false;
    const expDate = new Date(exp.date);
    const today = new Date();
    if (dateFilter === 'this-month') {
      return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === 'last-month') {
      const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
      const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
      return expDate.getMonth() === lastMonth && expDate.getFullYear() === year;
    } else if (dateFilter === 'custom') {
      if (customStart && expDate < new Date(customStart)) return false;
      if (customEnd && expDate > new Date(customEnd)) return false;
    }
    return true;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const exportToCSV = () => {
    if (sortedExpenses.length === 0) return alert('No data to export!');
    const headers = ['ID,Amount,Category,Date,Note\n'];
    const rows = sortedExpenses.map(e => `"${e.id}","${e.amount}","${e.category}","${e.date}","${e.note.replace(/"/g, '""')}"`);
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const selectClass = `
    w-full p-2 rounded-lg text-xs text-gray-300
    bg-[#0f1117] border border-[#2a2d3a]
    focus:outline-none focus:border-amber-400
    transition-colors cursor-pointer
  `;

  const categoryBadge = {
    Food:          'bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20',
    Transport:     'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20',
    Bills:         'bg-rose-400/10 text-rose-400 ring-1 ring-rose-400/20',
    Entertainment: 'bg-violet-400/10 text-violet-400 ring-1 ring-violet-400/20',
    Other:         'bg-gray-400/10 text-gray-400 ring-1 ring-gray-400/20',
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#2a2d3a]">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[#2a2d3a] bg-[#1a1d27] flex flex-wrap gap-4 justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
          Transactions Ledger
        </h3>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-b border-[#2a2d3a] bg-[#1a1d27]">
        <div>
          <label className="block text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5">
            Category
          </label>
          <select
            className={selectClass}
            style={{ backgroundColor: '#0f1117' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5">
            Timeline
          </label>
          <select
            className={selectClass}
            style={{ backgroundColor: '#0f1117' }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {dateFilter === 'custom' && (
          <div className="sm:col-span-2 md:col-span-1 flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5">Start</label>
              <input
                type="date"
                className={selectClass}
                style={{ colorScheme: 'dark' }}
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-500 text-xs uppercase tracking-wider font-medium mb-1.5">End</label>
              <input
                type="date"
                className={selectClass}
                style={{ colorScheme: 'dark' }}
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#1a1d27]">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-gray-500 border-b border-[#2a2d3a]">
            <tr>
              <th className="py-3 px-5 font-medium">Date</th>
              <th className="py-3 px-5 font-medium">Category</th>
              <th className="py-3 px-5 font-medium">Amount</th>
              <th className="py-3 px-5 font-medium">Note</th>
              <th className="py-3 px-5 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2d3a]">
            {sortedExpenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-600 italic">
                  No records found.
                </td>
              </tr>
            ) : (
              sortedExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-[#0f1117] transition-colors group"
                >
                  <td className="py-3 px-5 whitespace-nowrap text-gray-400 font-medium">{exp.date}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${categoryBadge[exp.category] || categoryBadge.Other}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-semibold text-gray-200">{formatCurrency(exp.amount)}</td>
                  <td className="py-3 px-5 text-gray-500 max-w-xs truncate" title={exp.note}>
                    {exp.note || '—'}
                  </td>
                  <td className="py-3 px-5 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(exp)}
                        className="text-gray-500 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-400/10 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(exp.id)}
                        className="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-400/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}