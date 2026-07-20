import { useState } from 'react';
import { Search, Sun, CloudRain, Cloud, Wind, Droplets, Thermometer, ShieldAlert, Compass } from 'lucide-react';
import { allCountries } from '../../data/countries';
import './WeatherPage.css';

export default function WeatherPage() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('jp');

  const country = allCountries.find(c => c.id === selectedCountry) || allCountries[0];

  // Simulated live weather generator based on country capital
  const getWeatherData = (cId: string) => {
    // Generate semi-random deterministic values based on country code char codes
    const seed = cId.charCodeAt(0) + (cId.charCodeAt(1) || 0);
    const temp = 15 + (seed % 18); // range 15 to 33
    const humidity = 40 + (seed % 45); // range 40 to 85%
    const wind = 5 + (seed % 25); // range 5 to 30 km/h
    const uvIndex = (seed % 10) + 1; // 1 to 10
    const aqi = 15 + (seed % 95); // 15 to 110 (healthy to moderate/unhealthy)
    const rainChance = (seed * 3) % 100; // 0 to 99%
    
    let icon = '☀️';
    let desc = 'Clear Skies';
    let alert = null;

    if (rainChance > 70) {
      icon = '🌧️';
      desc = 'Heavy Rainfall';
      alert = 'Yellow warning: Anticipate wet roadways and high wind gusts.';
    } else if (rainChance > 40) {
      icon = '⛅';
      desc = 'Partly Cloudy';
    } else if (temp > 30) {
      icon = '☀️';
      desc = 'Hot and Sunny';
      alert = 'Amber warning: High UV levels. Apply SPF 50+ protection.';
    }

    // Sunrise and sunset
    const sunrise = `0${5 + (seed % 2)}:${30 + (seed % 25)} AM`;
    const sunset = `0${6 + (seed % 2)}:${15 + (seed % 40)} PM`;

    // Hourly
    const hourly = [
      { time: '09:00 AM', temp: temp - 3, icon: '☀️' },
      { time: '12:00 PM', temp: temp, icon: icon },
      { time: '03:00 PM', temp: temp + 1, icon: icon },
      { time: '06:00 PM', temp: temp - 2, icon: '⛅' },
      { time: '09:00 PM', temp: temp - 5, icon: '🌙' },
    ];

    // 7 Day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const forecast = days.map((day, idx) => {
      const daySeed = seed + idx;
      const dayTemp = temp - 3 + (daySeed % 7);
      let dayIcon = '☀️';
      if ((daySeed % 10) > 7) dayIcon = '🌧️';
      else if ((daySeed % 10) > 4) dayIcon = '⛅';
      
      return { day, temp: dayTemp, icon: dayIcon };
    });

    return { temp, humidity, wind, uvIndex, aqi, rainChance, icon, desc, alert, sunrise, sunset, hourly, forecast };
  };

  const weather = getWeatherData(selectedCountry);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = allCountries.find(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.capital.toLowerCase().includes(query.toLowerCase()));
    if (found) {
      setSelectedCountry(found.id);
      setQuery('');
    }
  };

  return (
    <div className="weather-page container">
      {/* Search Header */}
      <header className="weather-header flex flex-col gap-2">
        <h1 className="font-display">Live Weather Forecast</h1>
        <p className="text-secondary text-sm">Real-time local forecasts, warnings, hourly schedules, and air quality index for all destinations.</p>
        
        <form onSubmit={handleSearch} className="weather-search-bar glass">
          <Search size={18} className="text-secondary" />
          <input
            type="text"
            placeholder="Search country or capital (e.g. Paris, Tokyo, India)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-brand text-xs">Search</button>
        </form>
      </header>

      {/* Weather Dashboard grid */}
      <div className="weather-dashboard-grid mt-6">
        {/* Left main info */}
        <div className="weather-main-panel glass flex flex-col gap-6">
          <div className="weather-current-row">
            <div>
              <span className="weather-badge">📍 {country.capital}, {country.name}</span>
              <h2 className="current-temp-val">{weather.temp}°C</h2>
              <p className="weather-desc-text">{weather.icon} {weather.desc}</p>
            </div>
            <div className="current-weather-large-icon">{weather.icon}</div>
          </div>

          {/* Alert block if active */}
          {weather.alert && (
            <div className="weather-alert-box glass animate-pulse">
              <ShieldAlert size={20} className="text-warm" />
              <div>
                <h4>Weather Alert Advisory</h4>
                <p>{weather.alert}</p>
              </div>
            </div>
          )}

          {/* Details Row */}
          <div className="weather-stats-row">
            <div className="weather-stat-item">
              <Droplets size={16} />
              <div>
                <span>Humidity</span>
                <p>{weather.humidity}%</p>
              </div>
            </div>
            <div className="weather-stat-item">
              <Wind size={16} />
              <div>
                <span>Wind Speed</span>
                <p>{weather.wind} km/h</p>
              </div>
            </div>
            <div className="weather-stat-item">
              <Sun size={16} />
              <div>
                <span>UV Index</span>
                <p>{weather.uvIndex} (Very High)</p>
              </div>
            </div>
            <div className="weather-stat-item">
              <Thermometer size={16} />
              <div>
                <span>Rain Chance</span>
                <p>{weather.rainChance}%</p>
              </div>
            </div>
          </div>

          {/* Hourly forecast */}
          <div className="hourly-section">
            <h3>Hourly Forecast</h3>
            <div className="hourly-scroll-grid">
              {weather.hourly.map((h, i) => (
                <div key={i} className="hourly-card glass">
                  <span className="text-xs text-secondary">{h.time}</span>
                  <span style={{ fontSize: '1.5rem' }}>{h.icon}</span>
                  <span style={{ fontWeight: 800 }}>{h.temp}°C</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side info (7 Day & details) */}
        <div className="weather-side-panel flex flex-col gap-6">
          {/* Air Quality & Sunset */}
          <div className="glass extra-details-card flex flex-col gap-4">
            <h3>Local Atmosphere Details</h3>
            <div className="atmosphere-grid">
              <div className="atmosphere-item">
                <span>Air Quality Index (AQI)</span>
                <p style={{ color: weather.aqi > 80 ? 'var(--brand-warm)' : 'var(--brand-accent)' }}>
                  {weather.aqi} - {weather.aqi > 80 ? 'Moderate' : 'Good'}
                </p>
              </div>
              <div className="atmosphere-item">
                <span>Sunrise</span>
                <p>{weather.sunrise}</p>
              </div>
              <div className="atmosphere-item">
                <span>Sunset</span>
                <p>{weather.sunset}</p>
              </div>
            </div>
          </div>

          {/* 7 Day Forecast */}
          <div className="glass forecast-card flex flex-col gap-3">
            <h3>7-Day Forecast</h3>
            <div className="forecast-list">
              {weather.forecast.map((day, idx) => (
                <div key={idx} className="forecast-day-row">
                  <span className="day-name">{day.day}</span>
                  <span className="day-icon">{day.icon}</span>
                  <span className="day-temp-range" style={{ fontWeight: 700 }}>{day.temp}°C / {day.temp - 6}°C</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
