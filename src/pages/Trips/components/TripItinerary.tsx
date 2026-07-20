import { useState, useEffect } from 'react';
import { Plus, Trash, Check, CheckSquare, Square, Edit, MapPin, DollarSign, Clock } from 'lucide-react';
import './TripItinerary.css';

interface Activity {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  place: string;
  category: string;
  notes: string;
  cost: number;
  completed: boolean;
}

interface TripItineraryProps {
  tripId: string;
  daysCount: number;
  startDate: string;
}

const categories = [
  'Flight', 'Hotel', 'Sightseeing', 'Museum', 'Shopping', 'Cafe',
  'Restaurant', 'Beach', 'Adventure', 'Nightlife', 'Transportation',
  'Meeting', 'Other'
];

export default function TripItinerary({ tripId, daysCount }: TripItineraryProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activities, setActivities] = useState<Record<number, Activity[]>>(() => {
    const saved = localStorage.getItem(`trip_itinerary_${tripId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      1: [
        {
          id: '1',
          title: 'Arrive at Tokyo Haneda Airport',
          startTime: '10:00',
          endTime: '11:30',
          place: 'Haneda Airport',
          category: 'Flight',
          notes: 'Pickup pockets WiFi and PASMO card at airport.',
          cost: 0,
          completed: true,
        },
        {
          id: '2',
          title: 'Lunch at Ichiran Ramen',
          startTime: '13:00',
          endTime: '14:00',
          place: 'Shinjuku, Tokyo',
          category: 'Restaurant',
          notes: 'Classic tonkotsu ramen.',
          cost: 15,
          completed: false,
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem(`trip_itinerary_${tripId}`, JSON.stringify(activities));
  }, [activities, tripId]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    startTime: '12:00',
    endTime: '13:00',
    place: '',
    category: 'Sightseeing',
    notes: '',
    cost: 0,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const targetDay = selectedDay;
    const currentList = activities[targetDay] || [];

    if (editingId) {
      // Edit mode
      setActivities({
        ...activities,
        [targetDay]: currentList.map((a) =>
          a.id === editingId ? { ...a, ...form } : a
        )
      });
      setEditingId(null);
    } else {
      // Add mode
      const newAct: Activity = {
        id: Date.now().toString(),
        title: form.title,
        startTime: form.startTime,
        endTime: form.endTime,
        place: form.place,
        category: form.category,
        notes: form.notes,
        cost: Number(form.cost),
        completed: false,
      };
      setActivities({
        ...activities,
        [targetDay]: [...currentList, newAct]
      });
    }

    setForm({
      title: '',
      startTime: '12:00',
      endTime: '13:00',
      place: '',
      category: 'Sightseeing',
      notes: '',
      cost: 0,
    });
    setShowAddForm(false);
  };

  const handleEdit = (act: Activity) => {
    setForm({
      title: act.title,
      startTime: act.startTime,
      endTime: act.endTime,
      place: act.place,
      category: act.category,
      notes: act.notes,
      cost: act.cost,
    });
    setEditingId(act.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const targetDay = selectedDay;
    setActivities({
      ...activities,
      [targetDay]: (activities[targetDay] || []).filter((a) => a.id !== id)
    });
  };

  const toggleComplete = (id: string) => {
    const targetDay = selectedDay;
    setActivities({
      ...activities,
      [targetDay]: (activities[targetDay] || []).map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    });
  };

  const currentDayActivities = activities[selectedDay] || [];
  const completedCount = currentDayActivities.filter((a) => a.completed).length;
  const progressPercent = currentDayActivities.length
    ? Math.round((completedCount / currentDayActivities.length) * 100)
    : 0;

  return (
    <div className="trip-itinerary">
      <div className="itinerary-layout">
        {/* Days sidebar selection */}
        <div className="days-sidebar glass">
          <h3>Itinerary Days</h3>
          <div className="days-list">
            {Array.from({ length: daysCount }).map((_, idx) => {
              const dayNum = idx + 1;
              return (
                <button
                  key={dayNum}
                  className={`day-sidebar-btn ${selectedDay === dayNum ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDay(dayNum);
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                >
                  Day {dayNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline area */}
        <div className="timeline-area flex flex-col gap-6">
          <div className="timeline-header glass">
            <div>
              <h2>Day {selectedDay} Schedule</h2>
              <p className="text-secondary text-sm">
                {currentDayActivities.length} activities planned · {completedCount} completed
              </p>
            </div>
            <div className="progress-wrap">
              <span className="text-xs font-semibold">{progressPercent}% done</span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${progressPercent}%` }} /></div>
            </div>
          </div>

          {/* Add Activity Trigger */}
          {!showAddForm && (
            <button className="btn-add-activity" onClick={() => setShowAddForm(true)}>
              <Plus size={16} /> Add Activity
            </button>
          )}

          {/* Activity Form */}
          {showAddForm && (
            <form onSubmit={handleSave} className="activity-form glass animate-scale-in">
              <h3>{editingId ? 'Edit Activity' : 'Add Activity'}</h3>
              <div className="form-group">
                <label>Activity Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Visit Senso-ji Temple"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location/Place</label>
                  <input type="text" placeholder="e.g. Asakusa, Tokyo" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estimated Cost ($)</label>
                  <input type="number" min={0} value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea rows={3} placeholder="Notes, tips, maps links..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={() => { setShowAddForm(false); setEditingId(null); }}>Cancel</button>
                <button type="submit" className="btn-brand">Save Activity</button>
              </div>
            </form>
          )}

          {/* Activities List */}
          <div className="activities-timeline">
            {currentDayActivities.length > 0 ? (
              currentDayActivities.map((act) => (
                <div key={act.id} className={`timeline-item glass ${act.completed ? 'completed-item' : ''}`}>
                  <div className="timeline-checkbox-wrap" onClick={() => toggleComplete(act.id)}>
                    {act.completed ? <CheckSquare size={18} className="icon-checkbox checked" /> : <Square size={18} className="icon-checkbox" />}
                  </div>
                  <div className="timeline-item-body">
                    <div className="item-header">
                      <span className="badge badge-brand">{act.category}</span>
                      <div className="item-time"><Clock size={12} /> {act.startTime} – {act.endTime}</div>
                    </div>
                    <h3>{act.title}</h3>
                    {act.place && <div className="item-meta"><MapPin size={12} /> {act.place}</div>}
                    {act.cost > 0 && <div className="item-meta"><DollarSign size={12} /> Spent: ${act.cost}</div>}
                    {act.notes && <p className="item-notes">{act.notes}</p>}
                  </div>
                  <div className="timeline-item-actions">
                    <button className="icon-btn" onClick={() => handleEdit(act)}><Edit size={14} /></button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(act.id)}><Trash size={14} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-timeline glass text-center">
                <Check size={28} style={{ color: 'var(--text-tertiary)' }} />
                <h4>No activities scheduled for this day</h4>
                <p className="text-secondary text-sm">Tap "Add Activity" above to schedule sights, food, and stays.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
