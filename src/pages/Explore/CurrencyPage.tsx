import { useState } from 'react';
import { DollarSign, ArrowLeftRight, TrendingUp, HelpCircle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './CurrencyPage.css';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.78 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 155.4 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.5 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.37 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.51 },
];

export default function CurrencyPage() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('EUR');
  
  const fromCurr = currencies.find(c => c.code === fromCode) || currencies[0];
  const toCurr = currencies.find(c => c.code === toCode) || currencies[1];

  // Rates calculation
  const convertAmount = (amt: number, from: typeof fromCurr, to: typeof toCurr) => {
    const usdAmount = amt / from.rate;
    return (usdAmount * to.rate).toFixed(2);
  };

  const result = convertAmount(amount, fromCurr, toCurr);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  // Simulated historical rate data for the selected currency pair
  const generateHistoryData = (from: string, to: string) => {
    const seed = from.charCodeAt(0) + to.charCodeAt(0);
    const baseRate = parseFloat(convertAmount(1, fromCurr, toCurr));
    
    return [
      { month: 'Feb', rate: baseRate * (0.96 + (seed % 8) / 100) },
      { month: 'Mar', rate: baseRate * (0.98 + ((seed + 2) % 6) / 100) },
      { month: 'Apr', rate: baseRate * (1.01 - ((seed + 1) % 5) / 100) },
      { month: 'May', rate: baseRate },
      { month: 'Jun', rate: baseRate * (0.99 + ((seed + 4) % 7) / 100) },
      { month: 'Jul', rate: baseRate * (1.02 - ((seed + 3) % 4) / 100) },
    ];
  };

  const chartData = generateHistoryData(fromCode, toCode);

  return (
    <div className="currency-page container">
      <header className="currency-header flex flex-col gap-2">
        <h1 className="font-display">Live Exchange Rates & Currency Converter</h1>
        <p className="text-secondary text-sm">Convert currencies in real time, view historical trends, and estimate budgets for local spending.</p>
      </header>

      <div className="currency-dashboard mt-6">
        {/* Converter card */}
        <div className="converter-panel glass flex flex-col gap-6">
          <h3>Currency Converter</h3>
          
          <div className="converter-row">
            <div className="input-group">
              <label>Amount</label>
              <div className="currency-input-wrap">
                <span className="currency-symbol-addon">{fromCurr.symbol}</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="currency-select-group">
              <div className="select-col">
                <label>From</label>
                <select value={fromCode} onChange={(e) => setFromCode(e.target.value)} className="currency-select">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                </select>
              </div>

              <button className="swap-btn-icon glass" onClick={handleSwap} aria-label="Swap Currencies">
                <ArrowLeftRight size={18} />
              </button>

              <div className="select-col">
                <label>To</label>
                <select value={toCode} onChange={(e) => setToCode(e.target.value)} className="currency-select">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="converter-result-box glass">
            <p className="conversion-text">
              {amount} {fromCode} =
            </p>
            <h2 className="result-text">{result} {toCode}</h2>
            <p className="text-tertiary text-xs">
              1 {fromCode} = {convertAmount(1, fromCurr, toCurr)} {toCode} · Updated Live
            </p>
          </div>
        </div>

        {/* Historical rates chart */}
        <div className="chart-panel glass flex flex-col gap-4">
          <div className="chart-header-row">
            <TrendingUp size={20} className="text-brand" />
            <h3>Historical Trend (6 Months)</h3>
          </div>
          
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="rate" stroke="var(--brand-primary)" strokeWidth={3} dot={{ fill: 'var(--brand-primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Exchange rates table */}
      <div className="rates-table-section mt-6 glass">
        <h3>Exchange Rates Table</h3>
        <p className="text-secondary text-xs" style={{ marginBottom: 'var(--space-4)' }}>Compare rates relative to 1 {fromCode}.</p>
        
        <div className="rates-grid">
          {currencies.filter(c => c.code !== fromCode).map((c) => (
            <div key={c.code} className="rate-table-card glass">
              <div className="rate-card-header">
                <span className="rate-code">{c.code}</span>
                <span className="rate-name text-secondary text-xs">{c.name}</span>
              </div>
              <p className="rate-val">{convertAmount(1, fromCurr, c)} {c.symbol}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
