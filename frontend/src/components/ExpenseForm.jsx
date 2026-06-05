import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export default function ExpenseForm({ onSubmit, editingExpense, clearEdit }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setNote(editingExpense.note);
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return alert('Amount must be greater than 0');
    if (!category) return alert('Category is required');
    if (new Date(date) > new Date()) return alert('Future dates are not allowed');
    onSubmit({ amount, category, date, note });
    resetForm();
  };

  const inputClass = `
    w-full px-3 py-2 rounded-lg text-sm text-gray-200
    bg-[#0f1117] border border-[#2a2d3a]
    focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400
    placeholder-gray-600 transition-colors
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">

      <div>
        <label className="block text-gray-500 font-medium mb-1.5 text-xs uppercase tracking-wider">
          Amount (₹) *
        </label>
        <input
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          className={inputClass}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-500 font-medium mb-1.5 text-xs uppercase tracking-wider">
          Category *
        </label>
        <select
          required
          className={`${inputClass} cursor-pointer`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ backgroundColor: '#0f1117' }}
        >
          <option value="" disabled className="text-gray-600">Select Category</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat} className="text-gray-200 bg-[#1a1d27]">{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-500 font-medium mb-1.5 text-xs uppercase tracking-wider">
          Date *
        </label>
        <input
          type="date"
          required
          max={new Date().toISOString().split('T')[0]}
          className={inputClass}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ colorScheme: 'dark' }}
        />
      </div>

      <div>
        <label className="block text-gray-500 font-medium mb-1.5 text-xs uppercase tracking-wider">
          Note (Optional)
        </label>
        <textarea
          placeholder="What did you buy?"
          rows="2"
          className={`${inputClass} resize-none`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 bg-amber-400 hover:bg-amber-300 text-[#0f1117] font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          {editingExpense ? 'Save Changes' : 'Add Expense'}
        </button>
        {editingExpense && (
          <button
            type="button"
            onClick={clearEdit}
            className="bg-[#0f1117] hover:bg-[#2a2d3a] text-gray-400 font-medium py-2 px-4 rounded-lg border border-[#2a2d3a] transition-colors text-sm"
          >
            Cancel
          </button>
        )}
      </div>

    </form>
  );
}