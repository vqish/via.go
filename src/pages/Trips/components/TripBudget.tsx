import { useState, useEffect } from 'react';
import { Plus, Trash, Search, DollarSign, Calendar, Edit } from 'lucide-react';
import './TripBudget.css';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface TripBudgetProps {
  tripId: string;
  limit: number;
}

const budgetCategories = [
  'Flights', 'Hotels', 'Food', 'Transport', 'Shopping',
  'Entertainment', 'Activities', 'Insurance', 'Visa', 'SIM Card',
  'Emergency', 'Miscellaneous'
];

export default function TripBudget({ tripId, limit }: TripBudgetProps) {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`trip_budget_${tripId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: '1', category: 'Flights', amount: 540, description: 'Roundtrip Flight tickets', date: '2026-03-25' },
      { id: '2', category: 'Hotels', amount: 420, description: 'Kyoto Ryokan Stay', date: '2026-03-28' },
      { id: '3', category: 'Food', amount: 280, description: 'Snacks, Dining, Ramen', date: '2026-03-27' },
    ];
  });

  useEffect(() => {
    localStorage.setItem(`trip_budget_${tripId}`, JSON.stringify(expenses));
  }, [expenses, tripId]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    category: 'Flights',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.amount <= 0 || !form.description) return;

    if (editingId) {
      setExpenses(expenses.map((exp) =>
        exp.id === editingId ? { ...exp, ...form, amount: Number(form.amount) } : exp
      ));
      setEditingId(null);
    } else {
      const newExp: Expense = {
        id: Date.now().toString(),
        category: form.category,
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
      };
      setExpenses([...expenses, newExp]);
    }

    setForm({
      category: 'Flights',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);
  };

  const handleEdit = (exp: Expense) => {
    setForm({
      category: exp.category,
      amount: exp.amount,
      description: exp.description,
      date: exp.date,
    });
    setEditingId(exp.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Math stats
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = limit - totalSpent;
  const largestExpense = expenses.length
    ? Math.max(...expenses.map((e) => e.amount))
    : 0;

  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
                          e.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="trip-budget-planner">
      <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="dashboard-stat-card glass">
          <div className="stat-info">
            <h3>${limit.toLocaleString()}</h3>
            <p>Total Budget</p>
          </div>
        </div>
        <div className="dashboard-stat-card glass">
          <div className="stat-info">
            <h3 style={{ color: totalSpent > limit ? 'var(--brand-secondary)' : 'var(--text-primary)' }}>
              ${totalSpent.toLocaleString()}
            </h3>
            <p>Spent</p>
          </div>
        </div>
        <div className="dashboard-stat-card glass">
          <div className="stat-info">
            <h3 style={{ color: remaining < 0 ? 'var(--brand-secondary)' : 'var(--brand-accent)' }}>
              ${remaining.toLocaleString()}
            </h3>
            <p>Remaining</p>
          </div>
        </div>
        <div className="dashboard-stat-card glass">
          <div className="stat-info">
            <h3>${largestExpense.toLocaleString()}</h3>
            <p>Largest Expense</p>
          </div>
        </div>
      </div>

      <div className="budget-layout">
        {/* Left Column - Expense entries list */}
        <div className="expenses-area">
          <div className="controls-bar glass">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filters-wrap">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                {budgetCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="btn-brand" onClick={() => setShowAddForm(true)}>
                <Plus size={16} /> Add Expense
              </button>
            </div>
          </div>

          {showAddForm && (
            <form onSubmit={handleSave} className="expense-form glass animate-scale-in">
              <h3>{editingId ? 'Edit Expense' : 'Add Expense'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount ($) *</label>
                  <input
                    type="number"
                    min={0.01}
                    step="any"
                    value={form.amount || ''}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {budgetCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Kyoto Ryokan Stay"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={() => { setShowAddForm(false); setEditingId(null); }}>Cancel</button>
                <button type="submit" className="btn-brand">Save Expense</button>
              </div>
            </form>
          )}

          <div className="expenses-list">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp) => (
                <div key={exp.id} className="expense-item glass">
                  <div className="expense-details">
                    <span className="badge badge-brand">{exp.category}</span>
                    <h4>{exp.description}</h4>
                    <p className="text-secondary text-xs"><Calendar size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{exp.date}</p>
                  </div>
                  <div className="expense-value">${exp.amount.toLocaleString()}</div>
                  <div className="expense-actions">
                    <button className="icon-btn" onClick={() => handleEdit(exp)}><Edit size={14} /></button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(exp.id)}><Trash size={14} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-budget glass text-center">
                <DollarSign size={28} className="text-tertiary" />
                <h4>No expenses found</h4>
                <p className="text-secondary text-sm">Add your flights, hotel stays, and dining checks to track your trip budget.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Category breakdown progress */}
        <div className="budget-analysis glass">
          <h3>Category Breakdown</h3>
          <div className="breakdown-list">
            {budgetCategories.map((cat) => {
              const catSpent = expenses
                .filter((e) => e.category === cat)
                .reduce((acc, curr) => acc + curr.amount, 0);
              if (catSpent === 0) return null;
              const percent = Math.min(100, Math.round((catSpent / limit) * 100));

              return (
                <div key={cat} className="breakdown-item">
                  <div className="breakdown-header">
                    <span>{cat}</span>
                    <span>${catSpent.toLocaleString()} ({percent}%)</span>
                  </div>
                  <div className="bar-bg"><div className="bar-fill" style={{ width: `${percent}%` }} /></div>
                </div>
              );
            })}
            {expenses.length === 0 && (
              <p className="text-secondary text-sm text-center">Add expenses to view category breakdown.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
