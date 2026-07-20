import { useState, useEffect } from 'react';
import { Plus, Trash, CheckSquare, Square, Search, Copy } from 'lucide-react';
import './TripPacking.css';

interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  weight?: string;
  priority: 'low' | 'medium' | 'high';
  packed: boolean;
  purchased: boolean;
}

interface PackingCategory {
  id: string;
  name: string;
  items: PackingItem[];
}

interface TripPackingProps {
  tripId: string;
  tripType: string;
}

const templates: Record<string, string[]> = {
  'International Trip': ['Passport & Visa docs', 'Universal Adapter', 'Local Currency cash', 'Comfortable Shoes', 'First-aid kit'],
  'Weekend Trip': ['Change of clothes', 'Toothbrush & paste', 'Phone Charger', 'Casual jacket'],
  'Beach Vacation': ['Swimwear', 'Sunscreen SPF 50', 'Sunglasses', 'Beach towel', 'Flip flops'],
  'Camping': ['Tent & Sleeping bag', 'Flashlight / Headlamp', 'Bug spray', 'Water bottle', 'Pocket knife'],
};

export default function TripPacking({ tripId }: TripPackingProps) {
  const [categories, setCategories] = useState<PackingCategory[]>(() => {
    const saved = localStorage.getItem(`trip_packing_${tripId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: '1',
        name: 'Documents',
        items: [
          { id: 'item-1', name: 'Passport & Visa docs', quantity: 1, priority: 'high', packed: true, purchased: true },
          { id: 'item-2', name: 'Boarding Pass & Tickets', quantity: 2, priority: 'high', packed: false, purchased: true },
        ],
      },
      {
        id: '2',
        name: 'Electronics',
        items: [
          { id: 'item-3', name: 'Phone & Charger', quantity: 1, priority: 'high', packed: false, purchased: true },
          { id: 'item-4', name: 'Universal Adapter', quantity: 1, priority: 'medium', packed: true, purchased: true },
        ],
      },
      {
        id: '3',
        name: 'Clothing',
        items: []
      },
      {
        id: '4',
        name: 'Toiletries',
        items: []
      },
      {
        id: '5',
        name: 'Miscellaneous',
        items: []
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(`trip_packing_${tripId}`, JSON.stringify(categories));
  }, [categories, tripId]);

  const [newItemName, setNewItemName] = useState('');
  const [targetCategory, setTargetCategory] = useState(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !targetCategory) return;

    setCategories(
      categories.map((cat) => {
        if (cat.id === targetCategory) {
          const newItem: PackingItem = {
            id: Date.now().toString(),
            name: newItemName,
            quantity: 1,
            priority: 'medium',
            packed: false,
            purchased: false,
          };
          return { ...cat, items: [...cat.items, newItem] };
        }
        return cat;
      })
    );
    setNewItemName('');
  };

  const handleTogglePacked = (catId: string, itemId: string) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            items: cat.items.map((i) =>
              i.id === itemId ? { ...i, packed: !i.packed } : i
            ),
          };
        }
        return cat;
      })
    );
  };

  const handleDeleteItem = (catId: string, itemId: string) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === catId) {
          return { ...cat, items: cat.items.filter((i) => i.id !== itemId) };
        }
        return cat;
      })
    );
  };

  const handleApplyTemplate = (tempName: string) => {
    const list = templates[tempName] || [];
    if (list.length === 0) return;

    const miscCat = categories.find((c) => c.name === 'Miscellaneous') || categories[0];
    if (!miscCat) return;

    setCategories(
      categories.map((cat) => {
        if (cat.id === miscCat.id) {
          const newItems: PackingItem[] = list.map((name, i) => ({
            id: `temp-${Date.now()}-${i}`,
            name,
            quantity: 1,
            priority: 'medium',
            packed: false,
            purchased: true,
          }));
          return { ...cat, items: [...cat.items, ...newItems] };
        }
        return cat;
      })
    );
    alert(`Applied "${tempName}" template items to ${miscCat.name}!`);
  };

  // Math totals
  let totalItems = 0;
  let packedItems = 0;
  categories.forEach((cat) => {
    cat.items.forEach((i) => {
      totalItems++;
      if (i.packed) packedItems++;
    });
  });
  const totalPercent = totalItems ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div className="trip-packing">
      <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="dashboard-stat-card glass">
          <div className="stat-info">
            <h3>{totalItems}</h3>
            <p>Total Items</p>
          </div>
        </div>
        <div className="dashboard-stat-card glass">
          <div className="stat-info">
            <h3>{packedItems}</h3>
            <p>Packed Items</p>
          </div>
        </div>
        <div className="dashboard-stat-card glass">
          <div className="stat-info">
            <h3>{totalPercent}%</h3>
            <p>Packing Progress</p>
          </div>
        </div>
      </div>

      <div className="packing-layout">
        {/* Left Column - packing items */}
        <div className="packing-area flex flex-col gap-6">
          <div className="controls-bar glass">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <form onSubmit={handleAddItem} className="add-item-bar">
              <input
                type="text"
                placeholder="New packing item..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                required
              />
              <select value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" className="btn-brand"><Plus size={16} /> Add</button>
            </form>
          </div>

          <div className="categories-list">
            {categories.map((cat) => {
              const matchedItems = cat.items.filter((i) =>
                i.name.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (matchedItems.length === 0 && searchQuery) return null;

              return (
                <div key={cat.id} className="category-group glass">
                  <h3>{cat.name}</h3>
                  <div className="items-list">
                    {matchedItems.length > 0 ? (
                      matchedItems.map((item) => (
                        <div key={item.id} className={`packing-item ${item.packed ? 'item-packed' : ''}`}>
                          <div className="item-check" onClick={() => handleTogglePacked(cat.id, item.id)}>
                            {item.packed ? <CheckSquare size={18} className="icon-checkbox checked" /> : <Square size={18} className="icon-checkbox" />}
                          </div>
                          <div className="item-name-wrap">
                            <h4>{item.name}</h4>
                            <span className="qty-tag">Qty: {item.quantity}</span>
                            <span className={`priority-tag priority-${item.priority}`}>{item.priority}</span>
                          </div>
                          <button className="icon-btn delete-btn" onClick={() => handleDeleteItem(cat.id, item.id)}><Trash size={14} /></button>
                        </div>
                      ))
                    ) : (
                      <p className="text-secondary text-xs" style={{ padding: 'var(--space-2)' }}>No items in this category.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Templates */}
        <div className="packing-sidebar flex flex-col gap-6">
          <div className="templates-card glass">
            <h3>Duplicable Templates</h3>
            <p className="text-secondary text-sm margin-bottom-4">Select a travel template to add default lists instantly.</p>
            <div className="templates-grid">
              {Object.keys(templates).map((temp) => (
                <button key={temp} className="template-btn" onClick={() => handleApplyTemplate(temp)}>
                  <Copy size={13} />
                  <span>{temp}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
