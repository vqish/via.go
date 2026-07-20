import { useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Compass, Star } from 'lucide-react';
import { allCountries } from '../../data/countries';
import { getCountryCities, getCountryAttractions, generateCountryDetails } from '../../data/travelDatabase';
import './ExplorePage.css';

const continents = ['All', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [, startTransition] = useTransition();

  // Compute stats for show
  const totalCount = allCountries.length;

  const filteredCountries = allCountries.filter((c) => {
    const matchesContinent = selectedContinent === 'All' || c.continent === selectedContinent;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesContinent;

    // Check basic details
    const matchesBasic = c.name.toLowerCase().includes(query) ||
                         c.capital.toLowerCase().includes(query) ||
                         c.continent.toLowerCase().includes(query);
    if (matchesBasic) return matchesContinent;

    // Check cities
    const cities = getCountryCities(c.id);
    const matchesCity = cities.some(city => 
      city.name.toLowerCase().includes(query) || 
      city.description.toLowerCase().includes(query) ||
      city.tags?.some(t => t.toLowerCase().includes(query))
    );
    if (matchesCity) return matchesContinent;

    // Check attractions
    const attractions = getCountryAttractions(c.id);
    const matchesAttraction = attractions.some(attr => 
      attr.name.toLowerCase().includes(query) || 
      attr.description.toLowerCase().includes(query) ||
      attr.category.toLowerCase().includes(query) ||
      attr.tags?.some(t => t.toLowerCase().includes(query))
    );
    if (matchesAttraction) return matchesContinent;

    // Check foods and festivals
    const details = generateCountryDetails(c.id);
    const matchesFood = details.foodGuide.topFoods.some(f => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)) ||
                        details.foodGuide.streetFood.some(f => f.toLowerCase().includes(query)) ||
                        details.foodGuide.desserts.some(f => f.toLowerCase().includes(query));
    if (matchesFood) return matchesContinent;

    const matchesFestival = details.cultureGuide.festivals.some(f => f.toLowerCase().includes(query)) ||
                            details.cultureGuide.holidays.some(h => h.toLowerCase().includes(query));
    if (matchesFestival) return matchesContinent;

    return false;
  });

  return (
    <div className="explore-page">
      {/* Hero Section */}
      <section className="explore-hero">
        <div className="explore-hero-glow" />
        <div className="container text-center">
          <div className="explore-badge">
            <Compass size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>Travel Explorer</span>
          </div>
          <h1 className="font-display">Where to Next?</h1>
          <p className="explore-subtitle text-secondary">
            Explore visa info, plug types, etiquette, and top attractions for all {totalCount} countries.
          </p>

          {/* Search bar */}
          <div className="explore-search-wrap glass">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search countries, capitals..."
              value={searchQuery}
              onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
              id="explore-search-input"
            />
          </div>
        </div>
      </section>

      {/* Main section */}
      <section className="explore-main container">
        {/* Continent filter pills */}
        <div className="continents-filter">
          {continents.map((continent) => (
            <button
              key={continent}
              className={`continent-pill ${selectedContinent === continent ? 'active' : ''}`}
              onClick={() => setSelectedContinent(continent)}
              id={`btn-continent-${continent.toLowerCase().replace(' ', '-')}`}
            >
              {continent}
            </button>
          ))}
        </div>

        {/* Results grid */}
        {filteredCountries.length > 0 ? (
          <div className="countries-grid">
            {filteredCountries.map((c) => {
              const isFeatured = ['jp', 'fr'].includes(c.id);
              return (
                <Link
                  key={c.id}
                  to={`/explore/country/${c.id}`}
                  className="country-card glass"
                  id={`country-card-${c.id}`}
                >
                  <div className="card-flag-row">
                    <span className="card-flag">{c.flagEmoji}</span>
                    <span className="card-code font-mono">{c.code}</span>
                  </div>
                  <h3 className="country-card-name">{c.name}</h3>
                  <div className="country-card-details">
                    <p><span>Capital:</span> {c.capital}</p>
                    <p><span>Currency:</span> {c.currency} ({c.currencySymbol})</p>
                    <p><span>Continent:</span> {c.continent}</p>
                  </div>
                  <div className="card-footer">
                    {isFeatured ? (
                      <span className="badge badge-brand"><Star size={10} fill="currentColor" /> Featured Guide</span>
                    ) : (
                      <span className="badge badge-success">Travel Guide</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="explore-empty text-center glass">
            <Globe size={48} className="text-tertiary margin-bottom-4" />
            <h3>No countries found</h3>
            <p className="text-secondary">Try adjusting your search queries or continent filters</p>
            <button
              className="btn-ghost"
              onClick={() => {
                setSearchQuery('');
                setSelectedContinent('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
