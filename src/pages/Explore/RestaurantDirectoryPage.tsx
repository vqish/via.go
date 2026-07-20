import { useState } from 'react';
import { Search, Star, MapPin } from 'lucide-react';
import './RestaurantDirectoryPage.css';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  category: 'Restaurant' | 'Café' | 'Dessert' | 'Street Food' | 'Fine Dining';
  tags: ('Vegan' | 'Vegetarian' | 'Halal')[];
  rating: number;
  priceRange: string;
  location: string;
  hours: string;
  image: string;
}

const mockRestaurants: Restaurant[] = [
  { id: 'r1', name: 'Sushi Saito', cuisine: 'Japanese', category: 'Fine Dining', tags: [], rating: 4.9, priceRange: '$$$$', location: 'Tokyo, Japan', hours: '12:00 PM - 10:00 PM', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500' },
  { id: 'r2', name: 'Le Comptoir du Relais', cuisine: 'French Bistro', category: 'Restaurant', tags: [], rating: 4.6, priceRange: '$$$', location: 'Paris, France', hours: '12:00 PM - 11:00 PM', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500' },
  { id: 'r3', name: 'Veggie Heaven', cuisine: 'Global Vegan', category: 'Restaurant', tags: ['Vegan', 'Vegetarian'], rating: 4.7, priceRange: '$$', location: 'London, UK', hours: '11:00 AM - 09:30 PM', image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=500' },
  { id: 'r4', name: 'Halal Kebab Korner', cuisine: 'Middle Eastern', category: 'Street Food', tags: ['Halal'], rating: 4.4, priceRange: '$', location: 'Dubai, UAE', hours: '10:00 AM - 02:00 AM', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500' },
  { id: 'r5', name: 'Matcha House', cuisine: 'Japanese Desserts', category: 'Café', tags: ['Vegetarian'], rating: 4.8, priceRange: '$$', location: 'Kyoto, Japan', hours: '10:00 AM - 07:00 PM', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500' }
];

export default function RestaurantDirectoryPage() {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterRestaurants(query, selectedTag);
  };

  const filterRestaurants = (searchQuery: string, tag: string) => {
    let filtered = mockRestaurants;
    if (searchQuery) {
      filtered = filtered.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (tag !== 'All') {
      if (tag === 'Vegan' || tag === 'Vegetarian' || tag === 'Halal') {
        filtered = filtered.filter(r => r.tags.includes(tag as any));
      } else {
        filtered = filtered.filter(r => r.category === tag);
      }
    }
    setRestaurants(filtered);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    filterRestaurants(query, tag);
  };

  return (
    <div className="restaurant-directory-page container">
      <header className="restaurant-header flex flex-col gap-2">
        <h1 className="font-display">Restaurants & Café Directory</h1>
        <p className="text-secondary text-sm">Find top local eats, street food, fine dining, cafes, desserts, and dietary options (vegan, vegetarian, halal).</p>
        
        <form onSubmit={handleSearch} className="restaurant-search-bar glass">
          <Search size={18} className="text-secondary" />
          <input
            type="text"
            placeholder="Search cuisine, city or restaurant name (e.g. Japanese, Paris)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-brand text-xs">Search</button>
        </form>
      </header>

      {/* Filter pills */}
      <div className="restaurant-filters mt-6">
        {['All', 'Restaurant', 'Café', 'Fine Dining', 'Street Food', 'Vegan', 'Vegetarian', 'Halal'].map((tag) => (
          <button
            key={tag}
            className={`filter-pill ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => handleTagSelect(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Restaurants grid */}
      <div className="restaurants-grid mt-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card glass">
            <div className="restaurant-card-image" style={{ backgroundImage: `url(${restaurant.image})` }}>
              <span className="cuisine-badge">{restaurant.cuisine}</span>
            </div>
            
            <div className="restaurant-card-body">
              <div className="restaurant-title-row">
                <h4>{restaurant.name}</h4>
                <div className="restaurant-rating">
                  <Star size={12} fill="currentColor" /> {restaurant.rating}
                </div>
              </div>
              
              <p className="restaurant-location"><MapPin size={12} /> {restaurant.location}</p>
              <p className="restaurant-hours text-secondary text-xs">🕒 {restaurant.hours}</p>
              
              <div className="restaurant-tags">
                <span className="category-pill">{restaurant.category}</span>
                {restaurant.tags.map((t, i) => (
                  <span key={i} className="diet-pill">🌱 {t}</span>
                ))}
              </div>

              <div className="restaurant-footer">
                <span className="restaurant-price">{restaurant.priceRange}</span>
                <button className="btn-brand text-xs">Reserve Table</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
