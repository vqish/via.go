import { useState, useEffect } from 'react';
import { MapPin, Star, Sparkles, Check, Globe, RefreshCw } from 'lucide-react';
import { allCountries } from '../../data/countries';
import { toast } from 'react-hot-toast';
import './MapPage.css';

export default function MapPage() {
  const [visitedIds, setVisitedIds] = useState<string[]>(['us', 'fr', 'jp', 'in']);
  const [activeTab, setActiveTab] = useState<'scratch' | 'pins'>('scratch');
  const [searchQuery, setSearchQuery] = useState('');

  // Load visited countries from profile/localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user_visited_countries');
    if (saved) {
      setVisitedIds(JSON.parse(saved));
    }
  }, []);

  const handleScratch = (id: string) => {
    let nextVisited = [...visitedIds];
    const country = allCountries.find(c => c.id === id);
    if (!country) return;

    if (nextVisited.includes(id)) {
      nextVisited = nextVisited.filter(cid => cid !== id);
      toast.success(`Removed ${country.name} from your visited list`);
    } else {
      nextVisited.push(id);
      toast.success(`Scratched off ${country.flagEmoji} ${country.name}!`);
    }
    setVisitedIds(nextVisited);
    localStorage.setItem('user_visited_countries', JSON.stringify(nextVisited));
  };

  const filteredCountries = allCountries.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const percentVisited = ((visitedIds.length / allCountries.length) * 100).toFixed(1);

  return (
    <div className="map-page container">
      <header className="map-header flex flex-col gap-2">
        <h1 className="font-display">Travel Map & Scratch Map</h1>
        <p className="text-secondary text-sm">Visualize your global adventures. Scratch off countries you have visited, and place pins for saved hotels, cafes, and spots.</p>
      </header>

      {/* Map tabs navigation */}
      <div className="map-tabs mt-6">
        <button className={`map-tab-btn ${activeTab === 'scratch' ? 'active' : ''}`} onClick={() => setActiveTab('scratch')}>
          🗺️ Scratch Map Tracker
        </button>
        <button className={`map-tab-btn ${activeTab === 'pins' ? 'active' : ''}`} onClick={() => setActiveTab('pins')}>
          📍 Saved Place Pins
        </button>
      </div>

      <div className="map-content mt-6">
        {/* Left Side: Map Visual Simulation */}
        <div className="map-visual-panel glass flex flex-col items-center justify-center">
          <div className="simulated-globe animate-spin" style={{ animationDuration: '60s', fontSize: '10rem', marginBottom: 'var(--space-4)' }}>
            🌍
          </div>
          <h2 className="font-display">Interactive Travel Globe</h2>
          <p className="text-secondary text-center text-sm" style={{ maxWidth: '400px', margin: 'var(--space-2) 0' }}>
            Scratch off countries on the right to light up regions on your premium travel dashboard map.
          </p>
          <div className="scratch-progress-meter mt-4 glass">
            <span className="progress-pct">{percentVisited}% Explored</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${percentVisited}%` }} />
            </div>
            <p className="text-secondary text-xs mt-2">{visitedIds.length} of {allCountries.length} countries scratched</p>
          </div>
        </div>

        {/* Right Side: Scratch Controls */}
        <div className="map-controls-panel glass flex flex-col">
          {activeTab === 'scratch' ? (
            <>
              <h3>Scratch Countries List</h3>
              <input
                type="text"
                placeholder="Search country to scratch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="scratch-search-input mt-2"
              />
              <div className="countries-scratch-list mt-4">
                {filteredCountries.map((c) => {
                  const isVisited = visitedIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      className={`scratch-country-item glass ${isVisited ? 'visited' : ''}`}
                      onClick={() => handleScratch(c.id)}
                    >
                      <span className="c-flag">{c.flagEmoji}</span>
                      <span className="c-name">{c.name}</span>
                      <span className="c-check">{isVisited ? <Check size={14} /> : null}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <h3>Pinned Places Directory</h3>
              <p className="text-secondary text-xs mt-2">Saved landmarks and sights will appear here as map pin coordinates.</p>
              
              <div className="pinned-list mt-4">
                {[
                  { name: 'Shinjuku Gyoen', location: 'Tokyo, Japan', category: 'Park' },
                  { name: 'Eiffel Tower', location: 'Paris, France', category: 'Monument' },
                  { name: 'Colosseum', location: 'Rome, Italy', category: 'Monument' }
                ].map((pin, i) => (
                  <div key={i} className="pinned-item-card glass">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-brand" />
                      <div>
                        <h4>{pin.name}</h4>
                        <p className="text-secondary text-xs">{pin.location} · {pin.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
