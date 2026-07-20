import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Compass, PlaneTakeoff, Plus, Star, Map,
  DollarSign, BookOpen, ChevronRight
} from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  if (loading || !currentUser) {
    return (
      <div className="dashboard-loading text-center" style={{ padding: 'var(--space-20) 0' }}>
        <div className="animate-spin" style={{ fontSize: '2rem' }}>⚙️</div>
        <p className="margin-top-4">Loading dashboard...</p>
      </div>
    );
  }

  // Get user profile details or mock
  const stats = userProfile?.travelStats || {
    countriesVisited: 4,
    citiesVisited: 12,
    totalTrips: 3,
    travelStreak: 5,
    wishlistCount: 8,
  };

  const quickActions = [
    { label: 'New Trip', to: '/trips', icon: <Plus size={18} />, desc: 'Plan adventure', class: 'action-brand' },
    { label: 'Explore', to: '/explore', icon: <Compass size={18} />, desc: 'Find destinations', class: 'action-explore' },
    { label: 'Scratch Map', to: '/scratch-map', icon: <Map size={18} />, desc: 'Trace travels', class: 'action-map' },
    { label: 'Lists', to: '/lists', icon: <Star size={18} />, desc: 'Custom lists', class: 'action-lists' },
    { label: 'Budget', to: '/budget', icon: <DollarSign size={18} />, desc: 'Track spend', class: 'action-budget' },
    { label: 'Journal', to: '/journal', icon: <BookOpen size={18} />, desc: 'Save memories', class: 'action-journal' },
  ];

  return (
    <div className="dashboard-page container">
      {/* Welcome Header */}
      <header className="dashboard-header animate-fade-in">
        <div>
          <span className="welcome-tag">✨ Welcome Back</span>
          <h1 className="font-display">Hello, {userProfile?.displayName || currentUser.displayName || 'Traveler'}</h1>
          <p className="text-secondary">Ready to plan your next destination?</p>
        </div>
        <div className="dashboard-time font-mono text-sm text-secondary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </header>

      {/* Stats row */}
      <section className="stats-row animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {[
          { label: 'Countries Visited', value: stats.countriesVisited, icon: '🌍' },
          { label: 'Cities Visited', value: stats.citiesVisited, icon: '🏙️' },
          { label: 'Total Trips', value: stats.totalTrips, icon: '✈️' },
          { label: 'Streak (Months)', value: stats.travelStreak, icon: '🔥' },
        ].map((stat) => (
          <div key={stat.label} className="dashboard-stat-card glass">
            <span className="stat-emoji">{stat.icon}</span>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="dashboard-grid">
        {/* Main Column */}
        <div className="dashboard-main-col flex flex-col gap-6">
          {/* Quick Actions */}
          <section className="dashboard-section glass">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.to} className={`action-btn-card ${action.class}`}>
                  <div className="action-icon-wrap">{action.icon}</div>
                  <div className="action-info">
                    <h4>{action.label}</h4>
                    <p>{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Upcoming Trips */}
          <section className="dashboard-section glass">
            <div className="section-header-row">
              <h2 className="section-title">Upcoming Trips</h2>
              <Link to="/trips" className="view-all-link">View all <ChevronRight size={14} /></Link>
            </div>
            
            <div className="upcoming-list">
              {/* Trip Item */}
              <div className="trip-summary-card">
                <div className="trip-cover-placeholder" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400)' }} />
                <div className="trip-summary-info">
                  <div className="badge badge-brand">Upcoming · 264 days left</div>
                  <h3>Japan Cherry Blossom Tour</h3>
                  <p className="text-secondary text-sm">📅 Mar 25 – Apr 05, 2026 · 👥 2 Travelers</p>
                </div>
                <Link to="/trips" className="btn-details-arrow"><ChevronRight size={16} /></Link>
              </div>

              {/* Empty state for second trip */}
              <div className="trip-summary-empty border-dashed">
                <PlaneTakeoff size={24} className="text-tertiary" />
                <div>
                  <h4>No other upcoming trips</h4>
                  <p className="text-secondary text-sm">Need a weekend getaway? Start planning today.</p>
                </div>
                <Link to="/trips" className="btn-brand text-xs">Create Trip</Link>
              </div>
            </div>
          </section>
        </div>

        {/* Side Column */}
        <div className="dashboard-side-col flex flex-col gap-6">
          {/* Recently Viewed */}
          <section className="dashboard-section glass">
            <h2 className="section-title">Recently Viewed</h2>
            <div className="recent-list">
              {[
                { name: 'Tokyo, Japan', emoji: '🇯🇵', capital: 'Tokyo', id: 'jp', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200' },
                { name: 'Paris, France', emoji: '🇫🇷', capital: 'Paris', id: 'fr', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200' },
                { name: 'Rome, Italy', emoji: '🇮🇹', capital: 'Rome', id: 'it', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200' },
              ].map((item) => (
                <Link key={item.name} to={`/explore/country/${item.id}`} className="recent-item">
                  <img src={item.img} alt={item.name} />
                  <div className="recent-item-info">
                    <h4>{item.emoji} {item.name}</h4>
                    <p className="text-secondary text-xs">Capital: {item.capital}</p>
                  </div>
                  <ChevronRight size={14} className="recent-chevron" />
                </Link>
              ))}
            </div>
          </section>

          {/* Budget Quick View */}
          <section className="dashboard-section glass">
            <h2 className="section-title">Budget Overview</h2>
            <div className="budget-quick-card">
              <div className="budget-dial">
                <span className="total-spent">$1,240</span>
                <span className="budget-limit">of $3,000 limit</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '41%' }} />
              </div>
              <div className="budget-breakdown-row">
                <span className="text-secondary text-xs">Flights: $540</span>
                <span className="text-secondary text-xs">Hotels: $420</span>
                <span className="text-secondary text-xs">Food: $280</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
