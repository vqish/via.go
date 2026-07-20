import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, DollarSign, Backpack, Folder, BookOpen, FileText, BarChart3,
  Clock, MapPin, Users, Heart, Share2, Compass, AlertCircle
} from 'lucide-react';
import TripItinerary from './components/TripItinerary';
import TripBudget from './components/TripBudget';
import TripPacking from './components/TripPacking';
import TripDocuments from './components/TripDocuments';
import TripJournal from './components/TripJournal';
import TripNotes from './components/TripNotes';
import TripAnalytics from './components/TripAnalytics';
import './TripDetailsPage.css';

type DetailTab = 'overview' | 'itinerary' | 'budget' | 'packing' | 'documents' | 'journal' | 'notes' | 'analytics';

// Mock Trip Data corresponding to index
const mockTrips = [
  {
    id: '1',
    name: 'Japan Cherry Blossom Tour',
    countries: ['Japan'],
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    startDate: '2026-03-25',
    endDate: '2026-04-05',
    travelers: 2,
    status: 'upcoming',
    tripType: 'Couple',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    budget: 5000,
    notes: 'A dream journey to see sakura in Tokyo, temples in Kyoto, and street food in Osaka.',
    visibility: 'Shared',
    isFavorite: true,
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
    tripType: 'Friends',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
    budget: 12000,
    notes: 'Backpacking through the culture capitals of Europe.',
    visibility: 'Private',
    isFavorite: false,
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
    tripType: 'Solo',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    budget: 3500,
    notes: 'Reliving island life and delicious street food.',
    visibility: 'Private',
    isFavorite: false,
  },
];

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [trip, setTrip] = useState<typeof mockTrips[0] | null>(null);

  useEffect(() => {
    const found = mockTrips.find((t) => t.id === id);
    if (found) {
      setTrip(found);
    }
  }, [id]);

  if (!trip) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-20) 0' }}>
        <AlertCircle size={48} className="text-secondary" style={{ marginBottom: 'var(--space-4)' }} />
        <h2>Trip Not Found</h2>
        <button onClick={() => navigate('/trips')} className="btn-brand" style={{ marginTop: 'var(--space-4)' }}>
          Back to Trips
        </button>
      </div>
    );
  }

  // Statistics calculation helper
  const tripDuration = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div className="trip-details-page">
      {/* Trip Hero Banner */}
      <section className="trip-hero-banner" style={{ backgroundImage: `url(${trip.coverImage})` }}>
        <div className="hero-banner-overlay" />
        <div className="hero-banner-content container">
          <div className="banner-top-actions">
            <button className="btn-back" onClick={() => navigate('/trips')}>← All Trips</button>
            <div className="action-row">
              <button className="icon-btn-circle"><Heart size={16} fill={trip.isFavorite ? 'currentColor' : 'none'} /></button>
              <button className="icon-btn-circle"><Share2 size={16} /></button>
            </div>
          </div>
          <div className="banner-info-wrap">
            <div className="badge-row">
              <span className="badge badge-brand">{trip.status}</span>
              <span className="badge badge-success">{trip.tripType}</span>
              <span className="badge badge-warn">{trip.visibility}</span>
            </div>
            <h1 className="font-display">{trip.name}</h1>
            <div className="trip-summary-meta">
              <span className="meta-item"><MapPin size={14} /> {trip.cities.join(', ')}</span>
              <span className="meta-item"><Users size={14} /> {trip.travelers} Travelers</span>
              <span className="meta-item"><Calendar size={14} /> {trip.startDate} to {trip.endDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="details-tab-nav">
        <div className="container tabs-inner">
          {[
            { id: 'overview', label: 'Overview', icon: <Compass size={15} /> },
            { id: 'itinerary', label: 'Itinerary', icon: <Calendar size={15} /> },
            { id: 'budget', label: 'Budget', icon: <DollarSign size={15} /> },
            { id: 'packing', label: 'Packing', icon: <Backpack size={15} /> },
            { id: 'documents', label: 'Documents', icon: <Folder size={15} /> },
            { id: 'journal', label: 'Journal', icon: <BookOpen size={15} /> },
            { id: 'notes', label: 'Notes', icon: <FileText size={15} /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as DetailTab)}
              id={`tab-${tab.id}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div className="container tab-panel-container">
        {activeTab === 'overview' && (
          <div className="overview-pane animate-fade-in">
            <div className="overview-grid-layout">
              {/* Trip stats cards */}
              <div className="overview-stats-grid">
                <div className="stat-box glass">
                  <h4>Duration</h4>
                  <p>{tripDuration} Days</p>
                </div>
                <div className="stat-box glass">
                  <h4>Target Budget</h4>
                  <p>${trip.budget.toLocaleString()}</p>
                </div>
                <div className="stat-box glass">
                  <h4>Cities</h4>
                  <p>{trip.cities.length}</p>
                </div>
                <div className="stat-box glass">
                  <h4>Travelers</h4>
                  <p>{trip.travelers} Guests</p>
                </div>
              </div>

              {/* Notes */}
              <div className="glass notes-card">
                <h3>About this Journey</h3>
                <p>{trip.notes || 'No description notes added to this trip.'}</p>
              </div>

              {/* Countdown & Quick Info */}
              <div className="glass info-card-quick">
                <h3>Trip Information</h3>
                <div className="info-detail">
                  <Clock size={16} />
                  <div>
                    <h4>Countdown</h4>
                    <p>Starts in {Math.max(0, Math.ceil((new Date(trip.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && <TripItinerary tripId={trip.id} daysCount={tripDuration} startDate={trip.startDate} />}
        {activeTab === 'budget' && <TripBudget tripId={trip.id} limit={trip.budget} />}
        {activeTab === 'packing' && <TripPacking tripId={trip.id} tripType={trip.tripType} />}
        {activeTab === 'documents' && <TripDocuments tripId={trip.id} />}
        {activeTab === 'journal' && <TripJournal tripId={trip.id} />}
        {activeTab === 'notes' && <TripNotes tripId={trip.id} />}
        {activeTab === 'analytics' && <TripAnalytics tripId={trip.id} limit={trip.budget} />}
      </div>
    </div>
  );
}
