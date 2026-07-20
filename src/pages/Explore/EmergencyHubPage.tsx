import { useState } from 'react';
import { Search, ShieldAlert, Phone, Heart, Navigation } from 'lucide-react';
import { allCountries } from '../../data/countries';
import { generateCountryDetails } from '../../data/travelDatabase';
import './EmergencyHubPage.css';

export default function EmergencyHubPage() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('jp');

  const country = generateCountryDetails(selectedCountry);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = allCountries.find(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.capital.toLowerCase().includes(query.toLowerCase()));
    if (found) {
      setSelectedCountry(found.id);
      setQuery('');
    }
  };

  return (
    <div className="emergency-hub-page container">
      <header className="emergency-header flex flex-col gap-2">
        <h1 className="font-display">Global Emergency & Embassy Hub</h1>
        <p className="text-secondary text-sm">Access toll-free emergency contacts, embassies, local tourist police departments, and nearby clinics/hospitals.</p>
        
        <form onSubmit={handleSearch} className="emergency-search-bar glass">
          <Search size={18} className="text-secondary" />
          <input
            type="text"
            placeholder="Search country (e.g. Japan, France, Canada)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-brand text-xs">Search</button>
        </form>
      </header>

      {/* Main dashboard row */}
      <div className="emergency-dashboard mt-6">
        {/* Left Side: emergency numbers */}
        <div className="emergency-contacts-panel glass flex flex-col gap-6">
          <div className="contacts-header-row">
            <ShieldAlert size={22} className="text-warm animate-pulse" />
            <div>
              <h3>Emergency Helpline Details</h3>
              <p className="text-secondary text-xs">Active Country: {country.name}</p>
            </div>
          </div>

          <div className="emergency-numbers-grid">
            <div className="emergency-number-card glass">
              <Phone size={18} className="text-warm" />
              <div>
                <span>Police Helpline</span>
                <p className="font-mono">{country.emergencyNumbers.police}</p>
              </div>
            </div>
            
            <div className="emergency-number-card glass">
              <Phone size={18} className="text-brand" />
              <div>
                <span>Ambulance Help</span>
                <p className="font-mono">{country.emergencyNumbers.ambulance}</p>
              </div>
            </div>

            <div className="emergency-number-card glass">
              <Phone size={18} className="text-warm" />
              <div>
                <span>Fire Department</span>
                <p className="font-mono">{country.emergencyNumbers.fire}</p>
              </div>
            </div>

            <div className="emergency-number-card glass">
              <Phone size={18} className="text-secondary" />
              <div>
                <span>Tourist Police</span>
                <p className="font-mono">
                  {['th', 'vn', 'id', 'jp'].includes(country.id) ? '1155' : '112'}
                </p>
              </div>
            </div>
          </div>

          <div className="emergency-notes-box glass">
            <h4>Health & Vaccination Guidelines</h4>
            <p className="text-secondary text-xs mt-2">
              General vaccinations recommended: Hepatitis A & B, Tetanus, Typhoid.
              Drinking water status: <strong>{country.drinkingWaterSafety}</strong>.
            </p>
          </div>
        </div>

        {/* Right Side: Hospital and Embassy search list */}
        <div className="facilities-panel glass flex flex-col gap-4">
          <h3>Local Facilities & Embassies</h3>
          <p className="text-secondary text-xs">Recommended general locations in {country.capital}:</p>
          
          <div className="facilities-list flex flex-col gap-3">
            <div className="facility-item-card glass">
              <Heart size={16} className="text-warm" />
              <div>
                <h4>{country.capital} General Central Hospital</h4>
                <p className="text-secondary text-xs">Main Clinic Block · Open 24/7</p>
                <p className="text-secondary text-xs mt-1">📞 emergency line: +00 1122 3344</p>
              </div>
            </div>

            <div className="facility-item-card glass">
              <Navigation size={16} className="text-brand" />
              <div>
                <h4>International Embassy District</h4>
                <p className="text-secondary text-xs">Consular Services · Avenue of the Nations</p>
                <p className="text-secondary text-xs mt-1">📞 embassy line: +00 9988 7766</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
