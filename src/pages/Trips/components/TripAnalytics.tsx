import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { BarChart3, PieChart as PieIcon, LineChart } from 'lucide-react';
import './TripAnalytics.css';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface Activity {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  place: string;
  category: string;
  notes: string;
  cost: number;
  completed: boolean;
}

interface TripAnalyticsProps {
  tripId: string;
  limit: number;
}

const COLORS = ['#6c63ff', '#ff6584', '#43e97b', '#fa8231', '#00d2d3', '#ff9f43', '#5f27cd', '#ff6b6b'];

export default function TripAnalytics({ tripId, limit }: TripAnalyticsProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activities, setActivities] = useState<Record<number, Activity[]>>({});

  useEffect(() => {
    // Read Budget
    const savedBudget = localStorage.getItem(`trip_budget_${tripId}`);
    if (savedBudget) {
      try {
        setExpenses(JSON.parse(savedBudget));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback defaults if no budget stored
      setExpenses([
        { id: '1', category: 'Flights', amount: 540, description: 'Roundtrip Flight tickets', date: '2026-03-25' },
        { id: '2', category: 'Hotels', amount: 420, description: 'Kyoto Ryokan Stay', date: '2026-03-28' },
        { id: '3', category: 'Food', amount: 280, description: 'Snacks, Dining, Ramen', date: '2026-03-27' },
        { id: '4', category: 'Transport', amount: 150, description: 'Shinkansen Ticket', date: '2026-03-29' },
        { id: '5', category: 'Activities', amount: 120, description: 'Tea Ceremony Experience', date: '2026-03-30' },
      ]);
    }

    // Read Itinerary
    const savedItinerary = localStorage.getItem(`trip_itinerary_${tripId}`);
    if (savedItinerary) {
      try {
        setActivities(JSON.parse(savedItinerary));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback defaults if no itinerary stored
      setActivities({
        1: [
          { id: '1', title: 'Arrive at Tokyo Haneda Airport', startTime: '10:00', endTime: '11:30', place: 'Haneda Airport', category: 'Flight', notes: 'Pickup pockets WiFi and PASMO card at airport.', cost: 0, completed: true },
          { id: '2', title: 'Lunch at Ichiran Ramen', startTime: '13:00', endTime: '14:00', place: 'Shinjuku, Tokyo', category: 'Restaurant', notes: 'Classic tonkotsu ramen.', cost: 15, completed: true }
        ],
        2: [
          { id: '3', title: 'Tokyo Skytree Visit', startTime: '09:00', endTime: '11:00', place: 'Sumida, Tokyo', category: 'Sightseeing', notes: 'Check out the high platform view.', cost: 30, completed: true },
          { id: '4', title: 'Senso-ji Temple Tour', startTime: '13:00', endTime: '15:00', place: 'Asakusa, Tokyo', category: 'Sightseeing', notes: 'Oldest temple in Tokyo.', cost: 0, completed: false }
        ],
        3: [
          { id: '5', title: 'Kyoto Ryokan Checkin', startTime: '12:00', endTime: '13:00', place: 'Kyoto', category: 'Hotel', notes: 'Traditional hot spring stay.', cost: 100, completed: false }
        ]
      });
    }
  }, [tripId]);

  // Aggregate budget expenses by category
  const expenseData = Object.values(
    expenses.reduce<Record<string, { name: string; value: number }>>((acc, curr) => {
      const cat = curr.category;
      if (!acc[cat]) {
        acc[cat] = { name: cat, value: 0 };
      }
      acc[cat].value += curr.amount;
      return acc;
    }, {})
  );

  // Daily completeness calculations
  const days = Object.keys(activities).map(Number).sort((a, b) => a - b);
  const completionData = days.map((dayNum) => {
    const list = activities[dayNum] || [];
    const completed = list.filter((a) => a.completed).length;
    const pct = list.length ? Math.round((completed / list.length) * 100) : 0;
    return {
      day: `Day ${dayNum}`,
      Completion: pct,
      Activities: list.length,
    };
  });

  // Aggregate activity distribution by category
  const activityCategories = Object.values(activities)
    .flat()
    .reduce<Record<string, { name: string; count: number }>>((acc, curr) => {
      const cat = curr.category;
      if (!acc[cat]) {
        acc[cat] = { name: cat, count: 0 };
      }
      acc[cat].count += 1;
      return acc;
    }, {});
  const activityDistributionData = Object.values(activityCategories);

  // Key Statistics
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalActivities = Object.values(activities).flat().length;
  const completedActivities = Object.values(activities).flat().filter((a) => a.completed).length;
  const overallCompleteness = totalActivities ? Math.round((completedActivities / totalActivities) * 100) : 0;

  // Custom tooltips
  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <div className="trip-analytics">
      <div className="analytics-grid">
        {/* Statistics highlights */}
        <div className="analytics-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="dashboard-stat-card glass">
            <div className="stat-info">
              <h3>${totalSpent.toLocaleString()}</h3>
              <p>Total Spent</p>
            </div>
          </div>
          <div className="dashboard-stat-card glass">
            <div className="stat-info">
              <h3>{Math.round((totalSpent / limit) * 100)}%</h3>
              <p>Budget Consumed</p>
            </div>
          </div>
          <div className="dashboard-stat-card glass">
            <div className="stat-info">
              <h3>{totalActivities}</h3>
              <p>Planned Sights</p>
            </div>
          </div>
          <div className="dashboard-stat-card glass">
            <div className="stat-info">
              <h3>{overallCompleteness}%</h3>
              <p>Overall Completeness</p>
            </div>
          </div>
        </div>

        {/* Expense Category Pie/Donut */}
        <div className="chart-card glass">
          <div>
            <h3>Expense Allocation</h3>
            <p className="text-secondary text-xs">Category spending share of total expenditures</p>
          </div>
          <div className="chart-container">
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="custom-chart-tooltip">
                            <p className="custom-chart-tooltip-label">{payload[0].name}</p>
                            <p className="custom-chart-tooltip-value">{formatCurrency(payload[0].value as number)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-secondary">
                <PieIcon size={32} style={{ marginBottom: 'var(--space-2)' }} />
                <p className="text-sm">No expenses to display. Add items to Budget tab.</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Completion Area */}
        <div className="chart-card glass">
          <div>
            <h3>Itinerary Progress</h3>
            <p className="text-secondary text-xs">Completion rate percentage day by day</p>
          </div>
          <div className="chart-container">
            {completionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={completionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="day" stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="custom-chart-tooltip">
                            <p className="custom-chart-tooltip-label">{payload[0].payload.day}</p>
                            <p className="custom-chart-tooltip-value">Completeness: {payload[0].value}%</p>
                            <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Total Activities: {payload[0].payload.Activities}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="Completion" stroke="var(--brand-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorCompletion)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-secondary">
                <LineChart size={32} style={{ marginBottom: 'var(--space-2)' }} />
                <p className="text-sm">No daily progress to display. Add activities to Itinerary.</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Distribution Bar Chart */}
        <div className="chart-card glass" style={{ gridColumn: '1 / -1' }}>
          <div>
            <h3>Activity Categorization</h3>
            <p className="text-secondary text-xs">Distribution of activities by types across the entire trip</p>
          </div>
          <div className="chart-container">
            {activityDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={activityDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="custom-chart-tooltip">
                            <p className="custom-chart-tooltip-label">{payload[0].name}</p>
                            <p className="custom-chart-tooltip-value">Count: {payload[0].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="var(--brand-primary)" radius={[4, 4, 0, 0]}>
                    {activityDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-secondary">
                <BarChart3 size={32} style={{ marginBottom: 'var(--space-2)' }} />
                <p className="text-sm">No activities distribution to display. Create items in Itinerary.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
