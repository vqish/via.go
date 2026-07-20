import { useState } from 'react';
import { Search, Star, MapPin } from 'lucide-react';
import './HotelDiscoveryPage.css';

interface Hotel {
  id: string;
  name: string;
  type: 'Hotel' | 'Hostel' | 'Resort' | 'Apartment' | 'Guest House';
  location: string;
  priceRange: string;
  rating: number;
  distance: string;
  amenities: string[];
  image: string;
}

const mockHotels: Hotel[] = [
  { id: 'h1', name: 'Aman Tokyo', type: 'Resort', location: 'Tokyo, Japan', priceRange: '$$$$', rating: 4.9, distance: '0.2 km from center', amenities: ['Spa', 'Pool', 'Fitness Center', 'Free WiFi', 'Fine Dining'], image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500' },
  { id: 'h2', name: 'The Ritz-Carlton', type: 'Hotel', location: 'Paris, France', priceRange: '$$$$', rating: 4.8, distance: '0.5 km from center', amenities: ['Bar', 'Room Service', 'Spa', 'Free WiFi', 'AC'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500' },
  { id: 'h3', name: 'Backpackers Central', type: 'Hostel', location: 'Sydney, Australia', priceRange: '$', rating: 4.2, distance: '1.2 km from center', amenities: ['Shared Kitchen', 'Laundry', 'Lounge', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500' },
  { id: 'h4', name: 'Colosseum View Apartment', type: 'Apartment', location: 'Rome, Italy', priceRange: '$$$', rating: 4.7, distance: '0.1 km from center', amenities: ['Kitchen', 'Balcony', 'Washing Machine', 'Free WiFi', 'AC'], image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500' },
  { id: 'h5', name: 'Kyoto Guest House', type: 'Guest House', location: 'Kyoto, Japan', priceRange: '$$', rating: 4.5, distance: '0.8 km from center', amenities: ['Bicycle Rental', 'Garden', 'Shared Lounge', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500' }
];

export default function HotelDiscoveryPage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterHotels(query, selectedType);
  };

  const filterHotels = (searchQuery: string, type: string) => {
    let filtered = mockHotels;
    if (searchQuery) {
      filtered = filtered.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.location.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (type !== 'All') {
      filtered = filtered.filter(h => h.type === type);
    }
    setHotels(filtered);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    filterHotels(query, type);
  };

  return (
    <div className="hotel-discovery-page container">
      <header className="hotel-header flex flex-col gap-2">
        <h1 className="font-display">Hotel & Stay Discovery</h1>
        <p className="text-secondary text-sm">Explore premium hotels, budget hostels, luxury resorts, local apartments, and cozy guest houses.</p>
        
        <form onSubmit={handleSearch} className="hotel-search-bar glass">
          <Search size={18} className="text-secondary" />
          <input
            type="text"
            placeholder="Search by city, country or hotel name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-brand text-xs">Search</button>
        </form>
      </header>

      {/* Filter pills */}
      <div className="hotel-filters mt-6">
        {['All', 'Hotel', 'Hostel', 'Resort', 'Apartment', 'Guest House'].map((type) => (
          <button
            key={type}
            className={`filter-pill ${selectedType === type ? 'active' : ''}`}
            onClick={() => handleTypeSelect(type)}
          >
            {type}s
          </button>
        ))}
      </div>

      {/* Hotels list grid */}
      <div className="hotels-grid mt-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-discovery-card glass">
            <div className="hotel-card-image" style={{ backgroundImage: `url(${hotel.image})` }}>
              <span className="hotel-type-badge">{hotel.type}</span>
            </div>
            
            <div className="hotel-card-body">
              <div className="hotel-title-row">
                <h4>{hotel.name}</h4>
                <div className="hotel-rating">
                  <Star size={12} fill="currentColor" /> {hotel.rating}
                </div>
              </div>
              
              <p className="hotel-location"><MapPin size={12} /> {hotel.location}</p>
              <p className="hotel-dist text-secondary text-xs">{hotel.distance}</p>
              
              <div className="hotel-amenities">
                {hotel.amenities.slice(0, 3).map((a, i) => (
                  <span key={i} className="amenity-badge">{a}</span>
                ))}
                {hotel.amenities.length > 3 && <span className="amenity-badge">+{hotel.amenities.length - 3} more</span>}
              </div>

              <div className="hotel-footer">
                <span className="hotel-price">{hotel.priceRange}</span>
                <button className="btn-brand text-xs">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
