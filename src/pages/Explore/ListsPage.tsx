import { useState, useEffect } from 'react';
import { List, Plus, Users, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './ListsPage.css';

interface TravelList {
  id: string;
  name: string;
  itemsCount: number;
  collaborators: string[];
  places: string[];
}

const mockLists: TravelList[] = [
  { id: 'l1', name: 'Tokyo Gourmet Tour', itemsCount: 4, collaborators: ['Sarah Chen', 'Marcus Weber'], places: ['Sushi Saito', 'Shinjuku Outer Market', 'Matcha House'] },
  { id: 'l2', name: 'Europe Summer Castles', itemsCount: 6, collaborators: ['Priya Sharma'], places: ['Neuschwanstein Castle', 'Louvre Museum', 'Versailles Palace'] },
  { id: 'l3', name: 'Sydney Beaches & Sights', itemsCount: 3, collaborators: [], places: ['Bondi Beach', 'Sydney Opera House', 'Royal Botanic Gardens'] }
];

export default function ListsPage() {
  const [lists, setLists] = useState<TravelList[]>(mockLists);
  const [newListName, setNewListName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('user_travel_lists');
    if (saved) {
      setLists(JSON.parse(saved));
    }
  }, []);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList: TravelList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      itemsCount: 0,
      collaborators: [],
      places: []
    };

    const updated = [newList, ...lists];
    setLists(updated);
    localStorage.setItem('user_travel_lists', JSON.stringify(updated));
    setNewListName('');
    setShowAddModal(false);
    toast.success(`List "${newList.name}" created successfully!`);
  };

  const handleDeleteList = (id: string) => {
    const updated = lists.filter(l => l.id !== id);
    setLists(updated);
    localStorage.setItem('user_travel_lists', JSON.stringify(updated));
    toast.success('List deleted successfully');
  };

  return (
    <div className="lists-page container">
      <header className="lists-header">
        <div>
          <h1 className="font-display">Custom Travel Lists</h1>
          <p className="text-secondary text-sm">Organize your stays, restaurants, and attractions in custom lists. Invite friends to collaborate in real-time.</p>
        </div>
        <button className="btn-brand text-xs flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Create List
        </button>
      </header>

      {/* Add list modal */}
      {showAddModal && (
        <div className="lists-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <form onSubmit={handleCreateList} className="lists-modal-card glass flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h3>Create Travel List</h3>
            <div className="form-group flex flex-col gap-2">
              <label>List Name</label>
              <input
                type="text"
                placeholder="e.g. Hokkaido Snow Spots, Rome Cafes..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                autoFocus
                className="modal-input"
              />
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button type="button" className="btn-ghost text-xs" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn-brand text-xs">Create List</button>
            </div>
          </form>
        </div>
      )}

      {/* Lists display grid */}
      <div className="lists-grid mt-6">
        {lists.map((list) => (
          <div key={list.id} className="travel-list-card glass">
            <div className="list-card-header">
              <div className="list-title-wrap">
                <List size={18} className="text-brand" />
                <h4>{list.name}</h4>
              </div>
              <button className="delete-list-btn" onClick={() => handleDeleteList(list.id)} aria-label="Delete List">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="list-card-body mt-4">
              <p className="text-secondary text-sm"><strong>Places Saved:</strong> {list.itemsCount} locations</p>
              
              {list.places.length > 0 ? (
                <div className="list-places-preview mt-2">
                  {list.places.map((place, idx) => (
                    <div key={idx} className="place-preview-tag text-xs">
                      📍 {place}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-tertiary text-xs mt-2">No places saved yet. Add destinations from Explore.</p>
              )}

              {/* Collaborators row */}
              <div className="list-collaborators mt-4 flex items-center justify-between border-top pt-3">
                <div className="collaborators-avatars flex items-center gap-1">
                  <Users size={14} className="text-secondary" />
                  <span className="text-secondary text-xs">
                    {list.collaborators.length > 0 ? list.collaborators.join(', ') : 'Only you'}
                  </span>
                </div>
                <button className="btn-ghost text-xs py-1 px-2" style={{ borderRadius: 'var(--radius-sm)' }}>
                  + Invite
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
