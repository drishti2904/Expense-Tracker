import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import ExpenseList from './components/ExpenseList.jsx';

const API_URL = 'https://spendwise-backend-jbxx.onrender.com/api/expenses';

const BUDGETS = {
  Food: 5000,
  Transport: 2000,
  Bills: 10000,
  Entertainment: 4000,
  Other: 3000
};

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const handleAddOrUpdate = async (expenseData) => {
    if (editingExpense) {
      await fetch(`${API_URL}/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      setEditingExpense(null);
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
    }
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchExpenses();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 pb-16 font-sans">

      {/* ── Header ── */}
      <header className="bg-[#1a1d27] border-b border-[#2a2d3a] py-4 px-6 mb-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-yellow-600 text-4xl">◈</span>
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-white leading-none">SpendWise</h1>
              <p className="text-s text-yellow-500 mt-0.75">Personal Expense Tracker</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-[#0f1117] border border-[#2a2d3a] px-3 py-1.5 rounded-full">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left Column ── */}
        <div className="space-y-5">

          {/* Add / Edit Expense Card */}
          <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-5">
              {editingExpense ? '✏️ Edit Expense' : '➕ Add Expense'}
            </h2>
            <ExpenseForm
              onSubmit={handleAddOrUpdate}
              editingExpense={editingExpense}
              clearEdit={() => setEditingExpense(null)}
            />
          </div>

          {/* Budget Progress Card */}
          <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-5">
              Category Budgets
            </h3>
            <div className="space-y-4">
              {Object.keys(BUDGETS).map(cat => {
                const currentMonthTotal = expenses
                  .filter(e => e.category === cat && new Date(e.date).getMonth() === new Date().getMonth())
                  .reduce((sum, e) => sum + e.amount, 0);
                const percent = Math.min((currentMonthTotal / BUDGETS[cat]) * 100, 100);
                const isOver = currentMonthTotal > BUDGETS[cat];
                const isWarn = !isOver && percent >= 80;

                return (
                  <div key={cat}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-gray-400">{cat}</span>
                      <span className={`text-xs font-semibold ${isOver ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-gray-500'}`}>
                        ₹{currentMonthTotal.toLocaleString()} / ₹{BUDGETS[cat].toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-[#0f1117] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-red-500' : isWarn ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {isOver && (
                      <p className="text-[10px] text-red-400 mt-1">
                        ⚠ Over by ₹{(currentMonthTotal - BUDGETS[cat]).toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
            <Dashboard expenses={expenses} />
          </div>
          <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-2xl p-6">
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
            />
          </div>
        </div>

      </main>
    </div>
  );
}