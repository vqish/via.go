import { useState, useEffect } from 'react';
import { Search, Plane, Clock, ShieldAlert, Check, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './FlightTrackerPage.css';

interface Flight {
  id: string;
  number: string;
  airline: string;
  from: string;
  to: string;
  depTime: string;
  arrTime: string;
  gate: string;
  terminal: string;
  delay: string;
  status: 'Scheduled' | 'Boarding' | 'In Air' | 'Delayed' | 'Landed';
  boardingTime: string;
}

const mockFlights: Flight[] = [
  { id: 'f1', number: 'SQ 22', airline: 'Singapore Airlines', from: 'SIN (Singapore)', to: 'EWR (New York)', depTime: '11:35 AM', arrTime: '06:00 PM', gate: 'B22', terminal: 'T3', delay: 'None', status: 'In Air', boardingTime: '10:50 AM' },
  { id: 'f2', number: 'LH 430', airline: 'Lufthansa', from: 'FRA (Frankfurt)', to: 'ORD (Chicago)', depTime: '01:20 PM', arrTime: '03:40 PM', gate: 'A14', terminal: 'T1', delay: '45 mins', status: 'Delayed', boardingTime: '12:55 PM' },
  { id: 'f3', number: 'AA 100', airline: 'American Airlines', from: 'JFK (New York)', to: 'LHR (London)', depTime: '06:15 PM', arrTime: '06:20 AM', gate: 'C4', terminal: 'T8', delay: 'None', status: 'Boarding', boardingTime: '05:30 PM' },
  { id: 'f4', number: 'EK 318', airline: 'Emirates', from: 'DXB (Dubai)', to: 'NRT (Tokyo)', depTime: '02:50 AM', arrTime: '05:35 PM', gate: 'C23', terminal: 'T3', delay: 'None', status: 'Scheduled', boardingTime: '02:05 AM' }
];

export default function FlightTrackerPage() {
  const [query, setQuery] = useState('');
  const [flights, setFlights] = useState<Flight[]>(mockFlights);
  const [savedFlightIds, setSavedFlightIds] = useState<string[]>([]);

  // Load saved flights from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved_tracked_flights');
    if (saved) {
      setSavedFlightIds(JSON.parse(saved));
    }
  }, []);

  const handleSaveFlight = (id: string) => {
    let nextSaved = [...savedFlightIds];
    if (nextSaved.includes(id)) {
      nextSaved = nextSaved.filter(fid => fid !== id);
      toast.success('Flight removed from watch list');
    } else {
      nextSaved.push(id);
      toast.success('Flight added to watch list');
    }
    setSavedFlightIds(nextSaved);
    localStorage.setItem('saved_tracked_flights', JSON.stringify(nextSaved));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setFlights(mockFlights);
      return;
    }
    const filtered = mockFlights.filter(f => f.number.toLowerCase().includes(query.toLowerCase()) || f.from.toLowerCase().includes(query.toLowerCase()) || f.to.toLowerCase().includes(query.toLowerCase()));
    setFlights(filtered);
  };

  return (
    <div className="flight-tracker-page container">
      <header className="flight-header flex flex-col gap-2">
        <h1 className="font-display">Live Flight Tracking</h1>
        <p className="text-secondary text-sm">Monitor departure, arrivals, gates, terminals, delays, and boarding times for your upcoming travel flights.</p>
        
        <form onSubmit={handleSearch} className="flight-search-bar glass">
          <Search size={18} className="text-secondary" />
          <input
            type="text"
            placeholder="Search by flight number or airport code (e.g. SQ 22, JFK, London)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-brand text-xs">Find Flight</button>
        </form>
      </header>

      {/* Tracked flights list */}
      <div className="flights-main-section mt-6">
        <h3>Live Flights Directory</h3>
        <div className="flights-list-grid mt-4">
          {flights.length > 0 ? (
            flights.map((flight) => {
              const isSaved = savedFlightIds.includes(flight.id);
              
              // Color for status badge
              let statusClass = 'badge-success';
              if (flight.status === 'Delayed') statusClass = 'badge-warm';
              else if (flight.status === 'Boarding') statusClass = 'badge-brand';

              return (
                <div key={flight.id} className="flight-card glass">
                  <div className="flight-card-header">
                    <div className="airline-info">
                      <Plane size={18} className="text-brand rotate-45" />
                      <div>
                        <h4>{flight.number}</h4>
                        <p className="text-secondary text-xs">{flight.airline}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`badge ${statusClass}`}>{flight.status}</span>
                      <button
                        className={`watch-btn glass ${isSaved ? 'active' : ''}`}
                        onClick={() => handleSaveFlight(flight.id)}
                        aria-label="Watch Flight"
                      >
                        {isSaved ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Route progress */}
                  <div className="flight-route-visual mt-4">
                    <div className="airport-node text-left">
                      <span className="airport-code font-display">{flight.from.split(' ')[0]}</span>
                      <p className="text-secondary text-xs">{flight.depTime}</p>
                    </div>
                    <div className="route-line-wrap">
                      <div className="route-line" />
                      <Plane size={14} className="flying-plane" style={{ left: flight.status === 'In Air' ? '50%' : flight.status === 'Landed' ? '100%' : '0%' }} />
                    </div>
                    <div className="airport-node text-right">
                      <span className="airport-code font-display">{flight.to.split(' ')[0]}</span>
                      <p className="text-secondary text-xs">{flight.arrTime}</p>
                    </div>
                  </div>

                  {/* Operational details */}
                  <div className="flight-details-grid mt-4">
                    <div className="op-detail">
                      <span>Gate</span>
                      <p>{flight.gate}</p>
                    </div>
                    <div className="op-detail">
                      <span>Terminal</span>
                      <p>{flight.terminal}</p>
                    </div>
                    <div className="op-detail">
                      <span>Boarding Time</span>
                      <p>{flight.boardingTime}</p>
                    </div>
                    <div className="op-detail">
                      <span>Delay Status</span>
                      <p style={{ color: flight.delay !== 'None' ? 'var(--brand-warm)' : 'var(--brand-accent)', fontWeight: 800 }}>
                        {flight.delay}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-flights-state text-center glass">
              <AlertCircle size={40} className="text-tertiary" />
              <h4>No matching flights found</h4>
              <p className="text-secondary">Try searching for other airline routes or code details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
