import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Star, ArrowRight, Play, Globe, MapPin, Users, Zap } from 'lucide-react';
import { popularDestinations, testimonials, travelStats, features } from '../../data/sampleData';
import './LandingPage.css';

const heroImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80',
];

const continentData = [
  { name: 'Europe', count: 44, emoji: '🏰', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400' },
  { name: 'Asia', count: 48, emoji: '🏯', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { name: 'North America', count: 23, emoji: '🗽', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400' },
  { name: 'South America', count: 12, emoji: '🌿', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400' },
  { name: 'Africa', count: 54, emoji: '🦁', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400' },
  { name: 'Oceania', count: 14, emoji: '🦘', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
];

export default function LandingPage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="landing">
      {/* ===== HERO ===== */}
      <section className="hero" id="hero-section">
        <div className="hero-bg">
          {heroImages.map((img, i) => (
            <div
              key={img}
              className={`hero-bg-slide ${i === heroIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-overlay" />
        </div>

        <div className="hero-content container">
          <div className="hero-badge animate-fade-in-up">
            <Globe size={14} />
            <span>195 Countries · 500K+ Attractions</span>
          </div>

          <h1 className="hero-title font-display animate-fade-in-up">
            Every journey
            <br />
            <span className="gradient-text">starts here.</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up">
            Plan unforgettable trips, explore every destination on Earth, track your adventures, and build travel memories that last a lifetime.
          </p>

          {/* Search Bar */}
          <form className="hero-search animate-fade-in-up" onSubmit={handleSearch} id="hero-search-form">
            <div className="hero-search-inner glass">
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
                id="hero-search-input"
              />
              <button type="submit" className="hero-search-btn" id="hero-search-submit">
                Explore <ArrowRight size={16} />
              </button>
            </div>
            <div className="hero-search-suggestions">
              {['Japan', 'Italy', 'Thailand', 'Iceland'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => navigate(`/explore?q=${s}`)}
                >
                  <MapPin size={12} /> {s}
                </button>
              ))}
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="hero-ctas animate-fade-in-up">
            <Link to="/register" className="cta-primary" id="hero-get-started-btn">
              Start Planning Free <ChevronRight size={18} />
            </Link>
            <button className="cta-secondary" id="hero-watch-demo-btn">
              <Play size={16} className="play-icon" /> Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="hero-social-proof animate-fade-in-up">
            <div className="proof-avatars">
              {[1, 2, 3, 4, 5].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/40?img=${i * 3}`} alt="User" className="proof-avatar" />
              ))}
            </div>
            <div className="proof-text">
              <div className="proof-stars">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <span>Loved by <strong>2M+ travelers</strong> worldwide</span>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="hero-indicators">
          {heroImages.map((_, i) => (
            <button
              key={i}
              className={`hero-indicator ${i === heroIndex ? 'active' : ''}`}
              onClick={() => setHeroIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { icon: <Globe size={24} />, value: travelStats.countries, label: 'Countries Covered' },
              { icon: <MapPin size={24} />, value: travelStats.cities, label: 'Cities Explored' },
              { icon: <Zap size={24} />, value: travelStats.attractions, label: 'Attractions Listed' },
              { icon: <Users size={24} />, value: travelStats.users, label: 'Happy Travelers' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card glass">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR COUNTRIES ===== */}
      <section className="section popular-section" id="popular-countries">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">🌟 Trending</span>
            <h2 className="section-title font-display">Popular <span className="gradient-text">Countries</span></h2>
            <p className="section-subtitle">Discover the world's most beloved destinations</p>
          </div>

          <div className="popular-grid">
            {popularDestinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/explore/country/${dest.id}`}
                className="popular-card"
                id={`popular-${dest.id}`}
              >
                <div className="popular-card-img">
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <div className="popular-card-overlay" />
                </div>
                <div className="popular-card-info">
                  <h3>{dest.name}</h3>
                  <span className="popular-trips"><MapPin size={12} /> {dest.trips} trips planned</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTINENTS ===== */}
      <section className="section continents-section" id="explore-continents">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">🌍 Explore</span>
            <h2 className="section-title font-display">Browse by <span className="gradient-text">Continent</span></h2>
            <p className="section-subtitle">All 195 countries, organized by region</p>
          </div>

          <div className="continents-grid">
            {continentData.map((c) => (
              <Link
                key={c.name}
                to={`/explore?continent=${c.name}`}
                className="continent-card glass"
                id={`continent-${c.name.toLowerCase().replace(' ', '-')}`}
              >
                <div className="continent-img">
                  <img src={c.image} alt={c.name} loading="lazy" />
                  <div className="continent-overlay" />
                  <span className="continent-emoji">{c.emoji}</span>
                </div>
                <div className="continent-info">
                  <h3>{c.name}</h3>
                  <span>{c.count} countries</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DESTINATIONS ===== */}
      <section className="section featured-section" id="featured-destinations">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">✨ Featured</span>
            <h2 className="section-title font-display">Dream <span className="gradient-text">Destinations</span></h2>
            <p className="section-subtitle">Curated picks from our travel experts</p>
          </div>

          <div className="featured-grid">
            <Link to="/explore/country/jp" className="featured-card featured-large" id="featured-japan">
              <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800" alt="Japan" loading="lazy" />
              <div className="featured-overlay">
                <div className="featured-tag">🏯 Culture</div>
                <div className="featured-info">
                  <h3>Japan</h3>
                  <p>Ancient temples meet neon skylines in this fascinating island nation.</p>
                  <span className="featured-link">Explore <ArrowRight size={14} /></span>
                </div>
              </div>
            </Link>

            <div className="featured-column">
              {[
                { id: 'it', name: 'Italy', tag: '🍕 Food & Art', desc: 'Pasta, history, and world-class art around every corner.', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600' },
                { id: 'is', name: 'Iceland', tag: '🌋 Adventure', desc: 'Northern lights, geysers, and dramatic volcanic landscapes.', img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600' },
                { id: 'th', name: 'Thailand', tag: '🏝️ Beaches', desc: 'Crystal waters, vibrant street food, and golden temples.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
              ].map((f) => (
                <Link key={f.id} to={`/explore/country/${f.id}`} className="featured-card featured-small" id={`featured-${f.id}`}>
                  <img src={f.img} alt={f.name} loading="lazy" />
                  <div className="featured-overlay">
                    <div className="featured-tag">{f.tag}</div>
                    <div className="featured-info">
                      <h3>{f.name}</h3>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">⚡ Features</span>
            <h2 className="section-title font-display">Everything you need <span className="gradient-text">to travel smarter</span></h2>
            <p className="section-subtitle">A complete toolkit for modern travelers</p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card glass">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">💬 Reviews</span>
            <h2 className="section-title font-display">What travelers <span className="gradient-text">are saying</span></h2>
            <p className="section-subtitle">Stories from our community of adventurers</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card glass">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="star-filled" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-loc">{t.location} · {t.trips} trips</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="section cta-section" id="cta-banner">
        <div className="container">
          <div className="cta-banner glass">
            <div className="cta-bg-glow" />
            <div className="cta-content">
              <h2 className="cta-title font-display">
                Ready to explore the world?
              </h2>
              <p className="cta-subtitle">
                Join 2 million travelers who plan smarter, travel better, and create unforgettable memories with via.go.
              </p>
              <div className="cta-actions">
                <Link to="/register" className="cta-primary" id="cta-register-btn">
                  Get Started — It's Free <ChevronRight size={18} />
                </Link>
                <Link to="/explore" className="cta-secondary" id="cta-explore-btn">
                  Browse Destinations
                </Link>
              </div>
            </div>
            <div className="cta-world-visual">
              <div className="cta-globe-ring" />
              <div className="cta-globe-ring cta-globe-ring-2" />
              <Globe size={80} className="cta-globe-icon" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
