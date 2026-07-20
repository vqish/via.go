import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Globe, MapPin, Calendar, HelpCircle,
  Eye, Navigation, Shield, Wifi, Zap, Star,
  ShieldCheck, Award
} from 'lucide-react';
import { generateCountryDetails, getCountryCities, getCountryAttractions } from '../../data/travelDatabase';
import { useAuth } from '../../contexts/AuthContext';
import './CountryPage.css';

type ActiveTab = 'overview' | 'cities' | 'attractions' | 'info';

export default function CountryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  
  // Track user passport nationality
  const [nationality, setNationality] = useState('us');

  useEffect(() => {
    if (userProfile?.settings?.nationality) {
      setNationality(userProfile.settings.nationality);
    } else {
      const saved = localStorage.getItem('user_passport_country');
      if (saved) {
        setNationality(saved);
      }
    }
  }, [userProfile]);

  if (!id) {
    return (
      <div className="country-page container text-center" style={{ padding: 'var(--space-20) 0' }}>
        <h2>Country Not Found</h2>
        <Link to="/explore" className="btn-brand">Back to Explore</Link>
      </div>
    );
  }

  // Load detailed structured database entries
  const country = generateCountryDetails(id, nationality);
  const cities = getCountryCities(id);
  const attractions = getCountryAttractions(id);

  return (
    <div className="country-page">
      {/* Hero Banner */}
      <section className="country-hero" style={{ backgroundImage: `url(${country.coverImage})` }}>
        <div className="country-hero-overlay" />
        <div className="country-hero-content container">
          <button className="back-btn" onClick={() => navigate('/explore')}>
            <ArrowLeft size={16} /> Back to Explore
          </button>
          <div className="country-title-row">
            <span className="country-flag-emoji">{country.flagEmoji}</span>
            <div>
              <h1 className="font-display">{country.name}</h1>
              <p className="country-meta-subtitle">{country.officialName} · Capital: {country.capital} · Continent: {country.continent}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation tabs */}
      <div className="country-tabs-nav">
        <div className="container tabs-inner">
          {(['overview', 'cities', 'attractions', 'info'] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              id={`tab-btn-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="container tab-content-wrapper">
        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="tab-pane animate-fade-in">
            {/* Grid layout for basic info */}
            <div className="overview-grid">
              <div className="overview-main-info glass">
                <h3>About {country.name}</h3>
                <p style={{ marginBottom: 'var(--space-6)', lineHeight: '1.7', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                  Welcome to the ultimate travel guide for {country.name}. Explore cities, discover must-try street foods, check weather averages, and map out itineraries for solo, family, or backpacker adventures.
                </p>
                
                <div className="divider" style={{ marginBottom: 'var(--space-6)' }} />
                
                <div className="key-details-grid">
                  <div className="detail-item">
                    <span>Capital</span>
                    <p>{country.capital}</p>
                  </div>
                  <div className="detail-item">
                    <span>Native Name</span>
                    <p>{country.nativeName}</p>
                  </div>
                  <div className="detail-item">
                    <span>Currency</span>
                    <p>{country.currency} ({country.currencySymbol})</p>
                  </div>
                  <div className="detail-item">
                    <span>Official Languages</span>
                    <p>{country.languages.join(', ')}</p>
                  </div>
                  <div className="detail-item">
                    <span>Time Zone</span>
                    <p>{country.timeZone}</p>
                  </div>
                  <div className="detail-item">
                    <span>Driving Side</span>
                    <p style={{ textTransform: 'capitalize' }}>{country.drivingSide} Side</p>
                  </div>
                  <div className="detail-item">
                    <span>UN Region</span>
                    <p>{country.unRegion}</p>
                  </div>
                  <div className="detail-item">
                    <span>ISO Codes</span>
                    <p>{country.code} / {country.iso3}</p>
                  </div>
                  <div className="detail-item">
                    <span>Power Grid</span>
                    <p>{country.voltage}</p>
                  </div>
                  <div className="detail-item">
                    <span>Drinking Water</span>
                    <p>{country.drinkingWaterSafety}</p>
                  </div>
                </div>
              </div>

              {/* Side highlight cards */}
              <div className="overview-side-info flex flex-col gap-4">
                <div className="glass card-highlight">
                  <Calendar size={20} className="icon-brand" />
                  <div>
                    <h4>Best Time to Visit</h4>
                    <p className="text-secondary text-sm">{country.bestMonths.join(', ')}</p>
                  </div>
                </div>

                <div className="glass card-highlight">
                  <Globe size={20} className="icon-warm" />
                  <div>
                    <h4>Climate Group</h4>
                    <p className="text-secondary text-sm">{country.climate}</p>
                  </div>
                </div>

                <div className="glass card-highlight">
                  <ShieldCheck size={20} className="icon-success" />
                  <div>
                    <h4>Safety Quality</h4>
                    <p className="text-secondary text-sm">{country.safetyInfo}</p>
                  </div>
                </div>

                <div className="glass card-highlight">
                  <Award size={20} className="icon-brand" />
                  <div>
                    <h4>Visa (Passport: {nationality.toUpperCase()})</h4>
                    <p className="text-secondary text-sm">{country.visaDetails.typeText}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Season Cards */}
            <div className="weather-section">
              <h3>Weather & Seasonal Climate</h3>
              <div className="weather-grid">
                <div className="weather-card glass">
                  <span className="weather-season">🌸 Spring</span>
                  <span className="weather-temp">{country.weatherProfile.spring.temp}</span>
                  <p className="text-secondary text-xs">{country.weatherProfile.spring.desc}</p>
                </div>
                <div className="weather-card glass">
                  <span className="weather-season">☀️ Summer</span>
                  <span className="weather-temp">{country.weatherProfile.summer.temp}</span>
                  <p className="text-secondary text-xs">{country.weatherProfile.summer.desc}</p>
                </div>
                <div className="weather-card glass">
                  <span className="weather-season">🍁 Autumn</span>
                  <span className="weather-temp">{country.weatherProfile.autumn.temp}</span>
                  <p className="text-secondary text-xs">{country.weatherProfile.autumn.desc}</p>
                </div>
                <div className="weather-card glass">
                  <span className="weather-season">❄️ Winter</span>
                  <span className="weather-temp">{country.weatherProfile.winter.temp}</span>
                  <p className="text-secondary text-xs">{country.weatherProfile.winter.desc}</p>
                </div>
              </div>
            </div>

            {/* Best Time to Visit Table */}
            <div className="best-time-section">
              <h3>Best Months & Tourism Crowd Levels</h3>
              <div className="best-time-card glass">
                <div className="best-time-table-grid" style={{ fontWeight: 800, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                  <div className="table-header">Rating</div>
                  <div className="table-header">Months</div>
                  <div className="table-header">Crowd Level</div>
                  <div className="table-header">Temperatures</div>
                  <div className="table-header">Rainfall</div>
                  <div className="table-header">Reason</div>
                </div>
                <div className="best-time-table-grid" style={{ paddingTop: 'var(--space-3)' }}>
                  <div className="rating-stars-badge">{country.bestTimeToVisitDetails.rating}</div>
                  <div style={{ fontWeight: 700 }}>{country.bestTimeToVisitDetails.months}</div>
                  <div>{country.bestTimeToVisitDetails.crowdLevel}</div>
                  <div>{country.bestTimeToVisitDetails.tempRange}</div>
                  <div>{country.bestTimeToVisitDetails.rainfall}</div>
                  <div className="text-secondary text-sm">{country.bestTimeToVisitDetails.reason}</div>
                </div>
              </div>
            </div>

            {/* Food Guide Section */}
            <div className="food-section">
              <h3>Food & Drinks Guide</h3>
              <div className="food-grid">
                {country.foodGuide.topFoods.map((dish, i) => (
                  <div key={i} className="food-card glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4>{dish.name}</h4>
                      <span className="food-origin-tag">{dish.origin}</span>
                    </div>
                    <p className="text-secondary text-xs" style={{ margin: 'var(--space-2) 0' }}>{dish.description}</p>
                    <div className="food-footer-row">
                      <span>💰 Cost: {dish.cost}</span>
                      <span>📍 Try: {dish.whereToTry}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub categories */}
              <div className="food-sub-sections" style={{ marginTop: 'var(--space-4)' }}>
                <div className="food-sub-card glass">
                  <h4>🍢 Street Food</h4>
                  <ul>
                    {country.foodGuide.streetFood.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
                <div className="food-sub-card glass">
                  <h4>🍰 Desserts</h4>
                  <ul>
                    {country.foodGuide.desserts.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
                <div className="food-sub-card glass">
                  <h4>🍵 Drinks</h4>
                  <ul>
                    {country.foodGuide.drinks.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
                <div className="food-sub-card glass">
                  <h4>🌱 Dietary Info</h4>
                  <p className="text-secondary text-xs" style={{ marginBottom: '4px' }}>
                    <strong>Vegan:</strong> {country.foodGuide.veganNotes}
                  </p>
                  <p className="text-secondary text-xs">
                    <strong>Halal:</strong> {country.foodGuide.halalNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Itineraries */}
            <div className="itineraries-section">
              <h3>Suggested Travel Itineraries</h3>
              <div className="itineraries-grid">
                {country.suggestedItineraries.map((itinerary, i) => (
                  <div key={i} className="itinerary-card glass">
                    <span className="itinerary-days-badge">{itinerary.days} Day Trip</span>
                    <h4>{itinerary.title}</h4>
                    <p className="text-secondary text-xs" style={{ margin: '4px 0' }}>{itinerary.summary}</p>
                    <div className="itinerary-stops">
                      {itinerary.stops.map((stop, j) => (
                        <div key={j} className="itinerary-stop-item">
                          <span>📍</span>
                          <span>{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural Information */}
            <div className="culture-section">
              <h3>Culture & Traditions</h3>
              <div className="culture-grid">
                <div className="culture-card glass">
                  <h4>Greetings & Language</h4>
                  <p className="text-secondary text-xs" style={{ marginBottom: 'var(--space-2)' }}>{country.cultureGuide.greetings}</p>
                  <h4>Traditional Music</h4>
                  <p className="text-secondary text-xs">{country.cultureGuide.music}</p>
                </div>
                <div className="culture-card glass">
                  <h4>Important Festivals</h4>
                  <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: '4px' }}>
                    {country.cultureGuide.festivals.map((f) => (
                      <span key={f} className="badge badge-brand">{f}</span>
                    ))}
                  </div>
                  <h4 style={{ marginTop: 'var(--space-3)' }}>Public Holidays</h4>
                  <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: '4px' }}>
                    {country.cultureGuide.holidays.map((h) => (
                      <span key={h} className="badge badge-success">{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: CITIES ================= */}
        {activeTab === 'cities' && (
          <div className="tab-pane animate-fade-in">
            <div className="cities-grid">
              {cities.map((city) => (
                <div key={city.id} className="city-card glass" id={`city-${city.id}`}>
                  <div className="city-image">
                    <img src={city.coverImage} alt={city.name} />
                  </div>
                  <div className="city-body">
                    <h3>{city.name}</h3>
                    <p className="text-secondary text-xs">{city.description}</p>
                    
                    <div className="city-stats">
                      <span>🏢 Pop: {city.population ? city.population.toLocaleString() : '850K+'}</span>
                      <span>⌚ TZ: {city.timezone || country.timeZone}</span>
                    </div>

                    <div className="city-tags">
                      {city.tags?.map((tag) => (
                        <span key={tag} className="tag-pill">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: ATTRACTIONS ================= */}
        {activeTab === 'attractions' && (
          <div className="tab-pane animate-fade-in">
            <div className="attractions-grid">
              {attractions.map((attr) => (
                <div key={attr.id} className="attraction-card glass" id={`attraction-${attr.id}`}>
                  <div className="attraction-image">
                    <img src={attr.images[0]} alt={attr.name} />
                    <div className="attraction-rating">
                      <Star size={12} fill="currentColor" /> {attr.rating}
                    </div>
                  </div>
                  <div className="attraction-body">
                    <div className="flex justify-between items-center">
                      <span className="badge badge-brand" style={{ textTransform: 'capitalize' }}>
                        {attr.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 style={{ margin: '6px 0' }}>{attr.name}</h3>
                    <p className="text-secondary text-xs" style={{ marginBottom: 'var(--space-3)' }}>{attr.description}</p>
                    
                    <div className="attraction-actions">
                      <span>⌛ {attr.estimatedDuration}</span>
                      <span>💵 {attr.entryFee}</span>
                    </div>
                    
                    <div className="flex gap-2" style={{ marginTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
                      <a
                        href={attr.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attr.name + ' ' + attr.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}
                      >
                        <MapPin size={10} /> Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: INFO (VISA & DETAILS) ================= */}
        {activeTab === 'info' && (
          <div className="tab-pane animate-fade-in">
            {/* Visa Section */}
            <div className="visa-section glass">
              <div className="visa-header">
                <div>
                  <h3>Visa Policy Summary</h3>
                  <p className="text-secondary text-sm">
                    Calculated for citizens of: <strong>{nationality.toUpperCase()}</strong> passport holders entering <strong>{country.name}</strong>.
                  </p>
                </div>
                <div className="visa-badge-row">
                  <span className="badge badge-brand" style={{ fontSize: '0.875rem', padding: '6px 14px' }}>
                    {country.visaDetails.typeText}
                  </span>
                </div>
              </div>

              <div className="visa-details-grid">
                <div className="visa-label">Allowed Stay Period</div>
                <div>{country.visaDetails.validity}</div>

                <div className="visa-label">Processing Wait Time</div>
                <div>{country.visaDetails.processingTime}</div>

                <div className="visa-label">Passport Requirement</div>
                <div>Must be valid for at least 6 months past entry date, with 2 empty pages.</div>

                <div className="visa-label">Required Documents</div>
                <div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {country.visaDetails.documents.map((doc, idx) => (
                      <li key={idx}>• {doc}</li>
                    ))}
                  </ul>
                </div>

                <div className="visa-label">Immigration Link</div>
                <div>
                  <a
                    href={country.visaDetails.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-text"
                    style={{ fontWeight: 700 }}
                  >
                    Official Portal ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Etiquette Grid */}
            <div className="info-tab-grid">
              <div className="glass etiquette-card">
                <HelpCircle size={22} className="card-icon icon-brand" style={{ marginBottom: 'var(--space-2)' }} />
                <h3>Local Etiquette & Customs</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <li><strong>Customs:</strong> {country.etiquetteTips.customs}</li>
                  <li><strong>Dress Code:</strong> {country.etiquetteTips.dress}</li>
                  <li><strong>Tipping:</strong> {country.etiquetteTips.tipping}</li>
                  <li><strong>Photography:</strong> {country.etiquetteTips.photography}</li>
                </ul>
              </div>

              <div className="glass details-column">
                <div className="info-detail-row">
                  <Shield size={18} className="icon-secondary" />
                  <div>
                    <h4>Safety & Regulations</h4>
                    <p className="text-secondary text-sm">{country.safetyInfo}</p>
                  </div>
                </div>

                <div className="info-detail-row">
                  <Navigation size={18} className="icon-success" />
                  <div>
                    <h4>Transportation Overview</h4>
                    <p className="text-secondary text-sm">{country.transportation}</p>
                    <p className="text-secondary text-xs" style={{ marginTop: '2px' }}>
                      <strong>Network:</strong> {country.transportationDetails.railNetwork}. {country.transportationDetails.publicTransport}. {country.transportationDetails.taxiAndRideshare}
                    </p>
                  </div>
                </div>

                <div className="info-detail-row">
                  <Wifi size={18} className="icon-primary" />
                  <div>
                    <h4>Connectivity & SIMs</h4>
                    <p className="text-secondary text-sm">
                      Quality: <strong>{country.internetAvailability}</strong>. {country.simInfo}
                    </p>
                    <p className="text-secondary text-xs" style={{ marginTop: '2px' }}>
                      <strong>SIM Providers:</strong> {country.simProviders.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="info-detail-row">
                  <Zap size={18} className="icon-warm" />
                  <div>
                    <h4>Power Outlet Configurations</h4>
                    <p className="text-secondary text-sm">{country.plugType}</p>
                  </div>
                </div>

                <div className="info-detail-row">
                  <Eye size={18} className="icon-brand" />
                  <div>
                    <h4>Emergency Contact Lines</h4>
                    <p className="text-secondary text-sm font-mono">
                      Police: {country.emergencyNumbers.police} · Ambulance: {country.emergencyNumbers.ambulance} · Fire: {country.emergencyNumbers.fire}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
