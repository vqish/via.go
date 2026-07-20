import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, PlaneTakeoff, Calendar, Users, MapPin, ChevronRight, Search, Clock, ArrowRight } from 'lucide-react';
import './TripsPage.css';

type TripStatus = 'all' | 'planning' | 'upcoming' | 'ongoing' | 'completed';

// Sample trips for demonstration
const sampleTrips = [
  {
    id: '1',
    name: 'Japan Cherry Blossom Tour',
    countries: ['Japan'],
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    startDate: '2026-03-25',
    endDate: '2026-04-05',
    travelers: 2,
    status: 'upcoming',
    tripType: 'leisure',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    budget: 5000,
    currency: 'USD',
    daysLeft: 264,
  },
  {
    id: '2',
    name: 'European Summer Adventure',
    countries: ['France', 'Italy', 'Spain'],
    cities: ['Paris', 'Rome', 'Barcelona'],
    startDate: '2026-07-10',
    endDate: '2026-07-28',
    travelers: 4,
    status: 'planning',
    tripType: 'group',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    budget: 12000,
    currency: 'USD',
    daysLeft: 371,
  },
  {
    id: '3',
    name: 'Thailand Beach Retreat',
    countries: ['Thailand'],
    cities: ['Bangkok', 'Phuket', 'Chiang Mai'],
    startDate: '2025-12-01',
    endDate: '2025-12-14',
    travelers: 2,
    status: 'completed',
    tripType: 'romantic',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    budget: 3500,
    currency: 'USD',
    daysLeft: 0,
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  planning: { label: 'Planning', color: 'var(--brand-primary)' },
  upcoming: { label: 'Upcoming', color: 'var(--brand-warm)' },
  ongoing: { label: 'Ongoing', color: 'var(--brand-accent)' },
  completed: { label: 'Completed', color: 'var(--text-tertiary)' },
  cancelled: { label: 'Cancelled', color: 'var(--brand-secondary)' },
};

const tripTypeEmoji: Record<string, string> = {
  leisure: '🌴', adventure: '🏔️', business: '💼', family: '👨‍👩‍👧‍👦',
  romantic: '💑', solo: '🧳', group: '👥', backpacking: '🎒',
};

export default function TripsPage() {
  const [filter, setFilter] = useState<TripStatus>('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTrips = sampleTrips.filter((t) => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.countries.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="trips-page">
      <div className="trips-header">
        <div className="container">
          <div className="trips-header-content">
            <div>
              <h1 className="trips-title font-display">My Trips</h1>
              <p className="trips-subtitle">Plan and manage all your adventures in one place</p>
            </div>
            <button
              className="btn-create-trip"
              id="create-trip-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} /> New Trip
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="trips-controls">
          <div className="trips-search-wrap">
            <Search size={16} className="trips-search-icon" />
            <input
              type="text"
              placeholder="Search trips or destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="trips-search"
              id="trips-search-input"
            />
          </div>
          <div className="trips-filters">
            {(['all', 'planning', 'upcoming', 'ongoing', 'completed'] as TripStatus[]).map((s) => (
              <button
                key={s}
                className={`filter-pill ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
                id={`filter-${s}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <div className="trips-grid">
            {filteredTrips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`} className="trip-card" id={`trip-${trip.id}`}>
                <div className="trip-card-img">
                  <img src={trip.coverImage} alt={trip.name} loading="lazy" />
                  <div className="trip-card-overlay" />
                  <div className="trip-status-badge" style={{ backgroundColor: statusConfig[trip.status]?.color }}>
                    {statusConfig[trip.status]?.label}
                  </div>
                  <div className="trip-type-badge">
                    {tripTypeEmoji[trip.tripType]} {trip.tripType}
                  </div>
                </div>
                <div className="trip-card-body">
                  <h3 className="trip-name">{trip.name}</h3>
                  <div className="trip-meta">
                    <span className="trip-meta-item">
                      <MapPin size={13} />
                      {trip.cities.slice(0, 2).join(', ')}{trip.cities.length > 2 ? ` +${trip.cities.length - 2}` : ''}
                    </span>
                    <span className="trip-meta-item">
                      <Users size={13} />
                      {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="trip-dates">
                    <Calendar size={13} />
                    <span>{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {trip.status === 'upcoming' && trip.daysLeft > 0 && (
                    <div className="trip-countdown">
                      <Clock size={13} />
                      <span>{trip.daysLeft} days away</span>
                    </div>
                  )}
                  <div className="trip-card-footer">
                    <span className="trip-budget">${trip.budget?.toLocaleString()} budget</span>
                    <span className="trip-view">View <ArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Create new trip card */}
            <button className="trip-card trip-card-create" onClick={() => setShowCreateModal(true)} id="create-trip-card">
              <Plus size={32} />
              <span>Plan New Trip</span>
              <p>Start building your next adventure</p>
            </button>
          </div>
        ) : (
          <div className="trips-empty">
            <PlaneTakeoff size={48} className="trips-empty-icon" />
            <h3>No trips found</h3>
            <p>
              {search ? `No trips matching "${search}"` : "You haven't planned any trips yet"}
            </p>
            <button className="btn-create-trip" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} /> Create Your First Trip
            </button>
          </div>
        )}
      </div>

      {/* Create Trip Modal */}
      {showCreateModal && (
        <CreateTripModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateTripModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    tripType: 'leisure',
    country: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: save to Firestore
    alert('Trip created! (Demo mode — connect Firebase to persist)');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title font-display">Create New Trip</h2>
        <p className="modal-subtitle">Tell us about your next adventure</p>

        <form onSubmit={handleSubmit} className="trip-form" id="create-trip-form">
          <div className="form-group">
            <label>Trip Name *</label>
            <input
              type="text"
              placeholder="e.g. Japan Cherry Blossom Tour"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="form-input"
              id="trip-name-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="form-input" id="trip-start-date" />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required className="form-input" id="trip-end-date" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Travelers</label>
              <input type="number" min={1} max={50} value={form.travelers} onChange={(e) => setForm({ ...form, travelers: +e.target.value })} className="form-input" id="trip-travelers" />
            </div>
            <div className="form-group">
              <label>Trip Type</label>
              <select value={form.tripType} onChange={(e) => setForm({ ...form, tripType: e.target.value })} className="form-input" id="trip-type">
                {['leisure', 'adventure', 'business', 'family', 'romantic', 'solo', 'group', 'backpacking'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Primary Destination</label>
            <input type="text" placeholder="e.g. Japan" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="form-input" id="trip-country" />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-brand">
              <PlaneTakeoff size={16} /> Create Trip <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
