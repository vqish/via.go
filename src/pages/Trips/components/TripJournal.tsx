import { useState, useEffect } from 'react';
import {
  Calendar, BookOpen, Star, Heart, Trash, Edit, Image as ImageIcon, X
} from 'lucide-react';
import './TripJournal.css';

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  mood: string;
  rating: number;
  text: string;
  photoUrl?: string;
  tags: string[];
  isFavorite: boolean;
}

interface TripJournalProps {
  tripId: string;
}

const moodEmojis: Record<string, string> = {
  Happy: '🤠',
  Excited: '🤩',
  Adventurous: '🧗',
  Relaxed: '🏖',
  Amazed: '😲',
  Tired: '😴',
};

const presetPhotos = [
  { label: 'No Photo', value: '' },
  { label: '🌸 Kyoto Temple', value: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' },
  { label: '🗼 Tokyo Neon Nights', value: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800' },
  { label: '🥐 Parisian Cafe', value: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { label: '🗻 Mount Fuji Sunrise', value: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800' }
];

export default function TripJournal({ tripId }: TripJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(`trip_journal_${tripId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'journal-1',
        title: 'Breathtaking Sakura in Shinjuku Gyoen',
        date: '2026-03-26',
        mood: 'Happy',
        rating: 5,
        text: 'Woke up early to beat the crowds at Shinjuku Gyoen National Garden. The cherry blossoms were at full peak. Hundreds of pink and white trees reflecting in the ponds. We sat down for a small picnic with green tea and mochi.',
        photoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        tags: ['Sakura', 'Tokyo', 'Picnic'],
        isFavorite: true
      },
      {
        id: 'journal-2',
        title: 'Lost in Shinjuku Golden Gai',
        date: '2026-03-27',
        mood: 'Adventurous',
        rating: 4,
        text: 'Spent the evening navigating the narrow alleys of Golden Gai. Found a tiny bar that only seated 4 people. Met some local salarymen and tried delicious yakitori skewers. Navigating Tokyo at night feels like stepping into a cyberpunk movie.',
        photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
        tags: ['Nightlife', 'Food', 'Alleyways'],
        isFavorite: false
      }
    ];
  });

  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    mood: 'Happy',
    rating: 5,
    text: '',
    photoUrl: '',
    tagInput: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(`trip_journal_${tripId}`, JSON.stringify(entries));
  }, [entries, tripId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.text) return;

    const tagsArray = form.tagInput
      ? form.tagInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    if (editingId) {
      setEntries(
        entries.map((entry) =>
          entry.id === editingId
            ? { ...entry, ...form, tags: tagsArray }
            : entry
        )
      );
      setEditingId(null);
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: form.title,
        date: form.date,
        mood: form.mood,
        rating: form.rating,
        text: form.text,
        photoUrl: form.photoUrl || undefined,
        tags: tagsArray,
        isFavorite: false,
      };
      setEntries([newEntry, ...entries]);
    }

    setForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      mood: 'Happy',
      rating: 5,
      text: '',
      photoUrl: '',
      tagInput: '',
    });
  };

  const handleEdit = (entry: JournalEntry) => {
    setForm({
      title: entry.title,
      date: entry.date,
      mood: entry.mood,
      rating: entry.rating,
      text: entry.text,
      photoUrl: entry.photoUrl || '',
      tagInput: entry.tags.join(', '),
    });
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setForm({ ...form, photoUrl: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="trip-journal">
      <div className="journal-layout">
        {/* Left Column - Write Memory Form */}
        <div className="journal-form-card glass">
          <h3>{editingId ? 'Edit Memory Entry' : 'Log a Travel Memory'}</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="form-group">
              <label>Memory Title *</label>
              <input
                type="text"
                placeholder="e.g. Afternoon tea in Kyoto"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`star-btn ${form.rating >= num ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, rating: num })}
                    >
                      <Star size={16} fill={form.rating >= num ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>How did you feel? (Mood)</label>
              <div className="mood-selector">
                {Object.keys(moodEmojis).map((moodName) => (
                  <button
                    key={moodName}
                    type="button"
                    title={moodName}
                    className={`mood-btn ${form.mood === moodName ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, mood: moodName })}
                  >
                    <span>{moodEmojis[moodName]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Memory Story *</label>
              <textarea
                rows={5}
                placeholder="Write down details of your adventure, street foods, interactions, and things you discovered..."
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label>Memory Photo</label>
              <div className="flex gap-2" style={{ flexDirection: 'column' }}>
                <select
                  value={form.photoUrl.startsWith('data:') ? 'custom' : form.photoUrl}
                  onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  {presetPhotos.map((photo) => (
                    <option key={photo.label} value={photo.value}>{photo.label}</option>
                  ))}
                  {form.photoUrl.startsWith('data:') && (
                    <option value="custom">📷 Custom Uploaded Image</option>
                  )}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="text-xs text-secondary">Or upload local image:</span>
                  <label className="btn-ghost text-xs" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                    <ImageIcon size={12} /> Browse File
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              {form.photoUrl && (
                <div className="photo-preview-box">
                  <img src={form.photoUrl} alt="Preview" />
                  <button type="button" className="btn-remove-photo" onClick={() => setForm({ ...form, photoUrl: '' })}>
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Tags (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. food, temples, walking"
                value={form.tagInput}
                onChange={(e) => setForm({ ...form, tagInput: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {editingId && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      title: '',
                      date: new Date().toISOString().split('T')[0],
                      mood: 'Happy',
                      rating: 5,
                      text: '',
                      photoUrl: '',
                      tagInput: '',
                    });
                  }}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-brand" style={{ flex: 2 }}>
                {editingId ? 'Update Entry' : 'Post to Journal'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Memory timeline */}
        <div className="timeline-container">
          <div className="timeline-line" />

          {entries.length > 0 ? (
            entries.map((entry) => (
              <div key={entry.id} className="timeline-card-wrapper">
                <div className="timeline-dot" />
                <div className="journal-card glass animate-fade-in">
                  <div className="journal-card-header">
                    <div className="journal-meta">
                      <h3>{entry.title}</h3>
                      <div className="journal-submeta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {entry.date}
                        </span>
                        <span>Mood: {moodEmojis[entry.mood]} {entry.mood}</span>
                        <div style={{ display: 'flex', gap: '1px', color: '#f1c40f' }}>
                          {Array.from({ length: entry.rating }).map((_, i) => (
                            <Star key={i} size={11} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="journal-actions">
                      <button
                        className={`icon-btn btn-favorite-journal ${entry.isFavorite ? 'is-favorite' : ''}`}
                        onClick={() => toggleFavorite(entry.id)}
                        title={entry.isFavorite ? 'Unfavorite' : 'Favorite'}
                      >
                        <Heart size={14} fill={entry.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <button className="icon-btn" onClick={() => handleEdit(entry)} title="Edit">
                        <Edit size={14} />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDelete(entry.id)} title="Delete">
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="journal-body">{entry.text}</p>

                  {entry.photoUrl && (
                    <img src={entry.photoUrl} alt={entry.title} className="journal-photo" />
                  )}

                  {entry.tags.length > 0 && (
                    <div className="journal-tags">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="tag-badge">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="glass text-center" style={{ padding: 'var(--space-12) 0' }}>
              <BookOpen size={36} className="text-tertiary" style={{ marginBottom: 'var(--space-2)' }} />
              <h4>Your Travel Journal is empty</h4>
              <p className="text-secondary text-sm">Start writing down your logs, feelings, and uploading photos from this amazing trip.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
