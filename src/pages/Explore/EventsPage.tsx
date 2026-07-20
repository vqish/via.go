import { useState } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import './EventsPage.css';

interface LocalEvent {
  id: string;
  name: string;
  category: 'Concert' | 'Festival' | 'Exhibition' | 'Sport' | 'Market' | 'Holiday';
  date: string;
  location: string;
  cost: string;
  description: string;
  image: string;
}

const mockEvents: LocalEvent[] = [
  { id: 'e1', name: 'Kyoto Gion Matsuri', category: 'Festival', date: 'July 17, 2026', location: 'Kyoto, Japan', cost: 'Free', description: 'One of Japans most famous annual festivals, featuring massive traditional float parades.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500' },
  { id: 'e2', name: 'Paris Jazz Festival', category: 'Concert', date: 'June 28, 2026', location: 'Parc Floral, Paris', cost: '€22 - €45', description: 'Outdoor jazz music sessions under the trees of beautiful floral gardens.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500' },
  { id: 'e3', name: 'Colosseum Light Exhibition', category: 'Exhibition', date: 'August 05, 2026', location: 'Rome, Italy', cost: '€15', description: 'Interactive historical 3D projections highlighting the history of the Colosseum.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500' },
  { id: 'e4', name: 'Melbourne Sunday Market', category: 'Market', date: 'Every Sunday', location: 'Melbourne, Australia', cost: 'Free', description: 'Local artisan crafts, vintage clothing, and fresh organic food trucks.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500' }
];

export default function EventsPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState<LocalEvent[]>(mockEvents);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterEvents(query, selectedCategory);
  };

  const filterEvents = (searchQuery: string, category: string) => {
    let filtered = mockEvents;
    if (searchQuery) {
      filtered = filtered.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.location.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (category !== 'All') {
      filtered = filtered.filter(e => e.category === category);
    }
    setEvents(filtered);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    filterEvents(query, category);
  };

  return (
    <div className="events-page container">
      <header className="events-header flex flex-col gap-2">
        <h1 className="font-display">Concerts & Local Festivals</h1>
        <p className="text-secondary text-sm">Discover public holidays, live art exhibitions, local craft markets, and music festivals happening nearby.</p>
        
        <form onSubmit={handleSearch} className="events-search-bar glass">
          <Search size={18} className="text-secondary" />
          <input
            type="text"
            placeholder="Search events, holidays, cities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-brand text-xs">Search</button>
        </form>
      </header>

      {/* Filter pills */}
      <div className="events-filters mt-6">
        {['All', 'Festival', 'Concert', 'Exhibition', 'Market', 'Holiday'].map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat)}
          >
            {cat}s
          </button>
        ))}
      </div>

      {/* Events grid */}
      <div className="events-grid mt-6">
        {events.map((event) => (
          <div key={event.id} className="event-discovery-card glass">
            <div className="event-card-image" style={{ backgroundImage: `url(${event.image})` }}>
              <span className="event-category-badge">{event.category}</span>
            </div>
            
            <div className="event-card-body">
              <div className="event-title-row">
                <h4>{event.name}</h4>
                <span className="event-cost-tag">{event.cost}</span>
              </div>
              
              <p className="event-date"><Calendar size={12} /> {event.date}</p>
              <p className="event-location"><MapPin size={12} /> {event.location}</p>
              
              <p className="event-desc text-secondary text-xs">{event.description}</p>
              
              <div className="event-footer">
                <button className="btn-brand text-xs w-full">Get Tickets / Info</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
