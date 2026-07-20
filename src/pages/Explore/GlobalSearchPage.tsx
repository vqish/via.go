import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Globe, MapPin, Building, Utensils, Star } from 'lucide-react';
import { allCountries } from '../../data/countries';
import { getCountryCities, getCountryAttractions } from '../../data/travelDatabase';
import './GlobalSearchPage.css';

interface SearchResult {
  id: string;
  name: string;
  type: 'Country' | 'City' | 'Attraction' | 'Stay' | 'Eat';
  details: string;
  link: string;
  image?: string;
}

export default function GlobalSearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'destinations' | 'stayeats'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query) return;
    
    const searchTerms = query.toLowerCase();
    const matches: SearchResult[] = [];

    // 1. Search Countries
    allCountries.forEach(c => {
      if (c.name.toLowerCase().includes(searchTerms) || c.capital.toLowerCase().includes(searchTerms)) {
        matches.push({
          id: c.id,
          name: c.name,
          type: 'Country',
          details: `Capital: ${c.capital} · Continent: ${c.continent}`,
          link: `/explore/country/${c.id}`
        });
      }
    });

    // 2. Search Cities (from featured / generated city index)
    allCountries.forEach(c => {
      const cities = getCountryCities(c.id);
      cities.forEach(city => {
        if (city.name.toLowerCase().includes(searchTerms) || city.description.toLowerCase().includes(searchTerms)) {
          matches.push({
            id: city.id,
            name: city.name,
            type: 'City',
            details: `${city.description.slice(0, 80)}...`,
            link: `/explore/country/${c.id}`,
            image: city.coverImage
          });
        }
      });
    });

    // 3. Search Attractions
    allCountries.forEach(c => {
      const attractions = getCountryAttractions(c.id);
      attractions.forEach(attr => {
        if (attr.name.toLowerCase().includes(searchTerms) || attr.description.toLowerCase().includes(searchTerms)) {
          matches.push({
            id: attr.id,
            name: attr.name,
            type: 'Attraction',
            details: `Category: ${attr.category} · Rating: ★ ${attr.rating}`,
            link: `/explore/country/${c.id}`,
            image: attr.images[0]
          });
        }
      });
    });

    // 4. Stays and eats (mock indices)
    if ('hotel'.includes(searchTerms) || 'ritz'.includes(searchTerms) || 'aman'.includes(searchTerms)) {
      matches.push({ id: 'h1', name: 'Aman Tokyo', type: 'Stay', details: 'Resort stay · Tokyo, Japan', link: '/hotels' });
      matches.push({ id: 'h2', name: 'The Ritz-Carlton', type: 'Stay', details: 'Hotel stay · Paris, France', link: '/hotels' });
    }
    if ('sushi'.includes(searchTerms) || 'ramen'.includes(searchTerms) || 'comptoir'.includes(searchTerms)) {
      matches.push({ id: 'r1', name: 'Sushi Saito', type: 'Eat', details: 'Fine Dining · Tokyo, Japan', link: '/restaurants' });
      matches.push({ id: 'r2', name: 'Le Comptoir du Relais', type: 'Eat', details: 'Bistro eat · Paris, France', link: '/restaurants' });
    }

    setResults(matches);
  }, [query]);

  const filteredResults = results.filter(r => {
    if (activeTab === 'destinations') return r.type === 'Country' || r.type === 'City' || r.type === 'Attraction';
    if (activeTab === 'stayeats') return r.type === 'Stay' || r.type === 'Eat';
    return true;
  });

  return (
    <div className="global-search-page container">
      <header className="search-header">
        <h1 className="font-display">Search Results</h1>
        <p className="text-secondary text-sm">Showing search hits matching query: <strong className="gradient-text font-mono">"{query}"</strong></p>
      </header>

      {/* Tabs */}
      <div className="search-tabs-nav mt-6">
        <button className={`search-tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All Hits ({results.length})
        </button>
        <button className={`search-tab-btn ${activeTab === 'destinations' ? 'active' : ''}`} onClick={() => setActiveTab('destinations')}>
          Destinations & Sights
        </button>
        <button className={`search-tab-btn ${activeTab === 'stayeats' ? 'active' : ''}`} onClick={() => setActiveTab('stayeats')}>
          Stays & Eats
        </button>
      </div>

      {/* Search results list */}
      <div className="search-results-list mt-6 flex flex-col gap-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((r, idx) => {
            let icon = <Globe size={18} />;
            if (r.type === 'City') icon = <MapPin size={18} />;
            else if (r.type === 'Attraction') icon = <Star size={18} />;
            else if (r.type === 'Stay') icon = <Building size={18} />;
            else if (r.type === 'Eat') icon = <Utensils size={18} />;

            return (
              <Link key={idx} to={r.link} className="search-result-card glass">
                <div className="result-card-inner">
                  <div className="result-icon-wrap text-brand">{icon}</div>
                  <div className="result-info">
                    <span className="result-type-badge">{r.type}</span>
                    <h4>{r.name}</h4>
                    <p className="text-secondary text-xs">{r.details}</p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="empty-search-state text-center glass">
            <Search size={40} className="text-tertiary" />
            <h4>No matches found</h4>
            <p className="text-secondary">Try searching for other countries, cities, or hotel listings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
