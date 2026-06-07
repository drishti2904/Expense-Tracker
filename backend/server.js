const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data', 'expenses.json');
const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

app.use(cors());
app.use(express.json());

const readData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing file:', error);
  }
};

// Reusable validation function
const validateExpense = ({ amount, category, date }) => {
  if (!amount || parseFloat(amount) <= 0) {
    return 'Amount must be greater than 0.';
  }
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return 'Category must be one of: Food, Transport, Bills, Entertainment, Other.';
  }
  if (!date) {
    return 'Date is required.';
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (selectedDate > today) {
    return 'Future dates are not allowed.';
  }
  return null; // null means valid
};

// GET
app.get('/api/expenses', (req, res) => {
  res.json(readData());
});

// POST
app.post('/api/expenses', (req, res) => {
  const { amount, category, date, note } = req.body;

  const error = validateExpense({ amount, category, date });
  if (error) return res.status(400).json({ error });

  const expenses = readData();
  const newExpense = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    category,
    date,
    note: note || ''
  };

  expenses.push(newExpense);
  writeData(expenses);
  res.status(201).json(newExpense);
});

// PUT
app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { amount, category, date, note } = req.body;

  const error = validateExpense({ amount, category, date });
  if (error) return res.status(400).json({ error });

  const expenses = readData();
  const index = expenses.findIndex(exp => exp.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  expenses[index] = {
    ...expenses[index],
    amount: parseFloat(amount),
    category,
    date,
    note: note || ''
  };

  writeData(expenses);
  res.json(expenses[index]);
});

// DELETE
app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  let expenses = readData();

  if (!expenses.some(exp => exp.id === id)) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  expenses = expenses.filter(exp => exp.id !== id);
  writeData(expenses);
  res.json({ message: 'Expense deleted successfully.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});