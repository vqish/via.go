import { useState } from 'react';
import { Search, Train, Bus, Compass, Info, Check, ShieldAlert } from 'lucide-react';
import './TransportHubPage.css';

interface TransportItem {
  id: string;
  name: string;
  type: 'Rail' | 'Bus' | 'Metro' | 'Ferry' | 'Taxi/Rideshare' | 'Rental';
  coverage: string;
  frequency: string;
  cost: string;
  description: string;
  tips: string;
}

const mockTransport: TransportItem[] = [
  { id: 't1', name: 'Shinkansen (Bullet Train)', type: 'Rail', coverage: 'Nationwide Japan (Tokyo to Osaka, Fukuoka)', frequency: 'Every 10-15 mins', cost: '¥14,000 (~$90)', description: 'One of the fastest, most punctual high-speed trains in the world.', tips: 'Buy a JR Pass online before arriving in Japan to save money.' },
  { id: 't2', name: 'Paris Métro Subway', type: 'Metro', coverage: 'All Parisian zones & suburbs', frequency: 'Every 2-5 mins', cost: '€2.15 per ticket', description: 'Historic metro lines covering all major Parisian attractions and museums.', tips: 'Use Navigo Easy Card to buy discounted books of 10 tickets (Carnet).' },
  { id: 't3', name: 'Grab Rideshare', type: 'Taxi/Rideshare', coverage: 'Southeast Asia (Thailand, Singapore, Vietnam)', frequency: 'Instant pickup', cost: 'Varies (Local rates)', description: 'The leading ride-hailing app in Southeast Asia for taxi cabs and bikes.', tips: 'Link your credit card to the Grab app for cashless payments.' },
  { id: 't4', name: 'Venice Vaporetto Water Bus', type: 'Ferry', coverage: 'Venice canals & outer islands (Murano)', frequency: 'Every 10-20 mins', cost: '€9.50 single ticket', description: 'Public water ferries traversing the iconic Grand Canal.', tips: 'Get a 24h or 48h travel pass if taking more than 3 rides.' }
];

export default function TransportHubPage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [transports, setTransports] = useState<TransportItem[]>(mockTransport);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterTransport(query, selectedType);
  };

  const filterTransport = (searchQuery: string, type: string) => {
    let filtered = mockTransport;
    if (searchQuery) {
      filtered = filtered.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.coverage.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (type !== 'All') {
      filtered = filtered.filter(t => t.type === type);
    }
    setTransports(filtered);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    filterTransport(query, type);
  };

  return (
    <div className="transport-hub-page container">
      <header className="transport-header flex flex-col gap-2">
        <h1 className="font-display">Transit & Transport Hub</h1>
        <p className="text-secondary text-sm">Explore metro passes, train routes, rideshare availability, and local ferry timetables for your destination.</p>
        
        <form onSubmit={handleSearch} className="transport-search-bar glass">
          <Search size={18} className="text-secondary" />
          <input
            type="text"
            placeholder="Search by network, coverage or city (e.g. Shinkansen, Paris)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-brand text-xs">Search</button>
        </form>
      </header>

      {/* Filter pills */}
      <div className="transport-filters mt-6">
        {['All', 'Rail', 'Metro', 'Bus', 'Ferry', 'Taxi/Rideshare', 'Rental'].map((type) => (
          <button
            key={type}
            className={`filter-pill ${selectedType === type ? 'active' : ''}`}
            onClick={() => handleTypeSelect(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transport list */}
      <div className="transport-list mt-6 flex flex-col gap-4">
        {transports.map((t) => (
          <div key={t.id} className="transport-card glass">
            <div className="transport-card-header">
              <div className="transport-title-wrap">
                <Train size={20} className="text-brand" />
                <div>
                  <h4>{t.name}</h4>
                  <span className="badge badge-brand text-xs">{t.type}</span>
                </div>
              </div>
              <span className="transport-cost">{t.cost}</span>
            </div>

            <div className="transport-body mt-4">
              <p className="text-secondary text-sm"><strong>Coverage:</strong> {t.coverage}</p>
              <p className="text-secondary text-sm"><strong>Frequency:</strong> {t.frequency}</p>
              <p className="text-secondary text-sm mt-2">{t.description}</p>
              
              <div className="transport-tip-box mt-3 glass">
                <Info size={14} className="text-brand" />
                <p className="text-secondary text-xs"><strong>Local Tip:</strong> {t.tips}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
