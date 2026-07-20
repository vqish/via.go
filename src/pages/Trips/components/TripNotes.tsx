import { useState, useEffect, useRef } from 'react';
import {
  FileText, Pin, Archive, Trash2, Plus, Search, Square, CheckSquare, X,
  Bold, Italic, Code, List
} from 'lucide-react';
import './TripNotes.css';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface TravelNote {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  checklist: ChecklistItem[];
  updatedAt: string;
}

interface TripNotesProps {
  tripId: string;
}

export default function TripNotes({ tripId }: TripNotesProps) {
  const [notes, setNotes] = useState<TravelNote[]>(() => {
    const saved = localStorage.getItem(`trip_notes_${tripId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'note-1',
        title: 'Pre-departure To-Dos',
        content: 'Crucial tasks to handle before catching the flight. Make sure to complete the checklist below.',
        isPinned: true,
        isArchived: false,
        checklist: [
          { id: 'c-1', text: 'Confirm passport has at least 6 months validity', checked: true },
          { id: 'c-2', text: 'Print paper copies of flight ticket & hotel booking voucher', checked: true },
          { id: 'c-3', text: 'Buy comprehensive international travel insurance', checked: false },
          { id: 'c-4', text: 'Activate international data roaming / eSIM', checked: false }
        ],
        updatedAt: '2026-03-15 14:30'
      },
      {
        id: 'note-2',
        title: 'Food Spots in Kyoto',
        content: 'List of cafes and restaurants recommended by friends:\n- Kichi Kichi Omurice (reserve in advance!)\n- Kyoto Ramen Koji (near Kyoto Station, 10th floor)\n- Nishiki Market (great street snacks: octopus skewers, soy donuts)\n- Gion Tanto (great Okonomiyaki)',
        isPinned: false,
        isArchived: false,
        checklist: [],
        updatedAt: '2026-03-20 18:15'
      }
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState<'active' | 'archived'>('active');
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem(`trip_notes_${tripId}`, JSON.stringify(notes));
  }, [notes, tripId]);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: TravelNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      isPinned: false,
      isArchived: false,
      checklist: [],
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (fields: Partial<TravelNote>) => {
    if (!activeNoteId) return;
    setNotes(
      notes.map((n) =>
        n.id === activeNoteId
          ? {
              ...n,
              ...fields,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          : n
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      if (activeNoteId === id && remaining.length > 0) {
        setActiveNoteId(remaining[0].id);
      } else if (remaining.length === 0) {
        setActiveNoteId('');
      }
    }
  };

  const handleTogglePin = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  };

  const handleToggleArchive = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n)));
  };

  // Markdown insert helpers
  const insertMarkdown = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea || !activeNote) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    let replacement = '';
    if (syntax === 'bold') {
      replacement = `**${selected || 'bold text'}**`;
    } else if (syntax === 'italic') {
      replacement = `*${selected || 'italic text'}*`;
    } else if (syntax === 'code') {
      replacement = `\`${selected || 'code'}\``;
    } else if (syntax === 'list') {
      replacement = `\n- ${selected || 'list item'}`;
    }

    const newContent = before + replacement + after;
    handleUpdateNote({ content: newContent });

    // Refocus and place cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // Checklist handlers
  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistItemText.trim() || !activeNote) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItemText.trim(),
      checked: false
    };

    handleUpdateNote({
      checklist: [...activeNote.checklist, newItem]
    });
    setNewChecklistItemText('');
  };

  const handleToggleChecklistItem = (itemId: string) => {
    if (!activeNote) return;
    const updated = activeNote.checklist.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    handleUpdateNote({ checklist: updated });
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    if (!activeNote) return;
    const updated = activeNote.checklist.filter((item) => item.id !== itemId);
    handleUpdateNote({ checklist: updated });
  };

  // Filtering lists
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const filteredNotes = sortedNotes.filter((n) => {
    const matchesTab = viewTab === 'active' ? !n.isArchived : n.isArchived;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="trip-notes">
      <div className="notes-layout">
        {/* Left Column - Notes list sidebar */}
        <div className="notes-sidebar">
          <div className="notes-sidebar-header">
            <h3>Scratchpad</h3>
            <button className="btn-brand" onClick={handleCreateNote} style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
              <Plus size={14} /> Note
            </button>
          </div>

          {/* Search bar */}
          <div className="search-wrap" style={{ width: '100%' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.8125rem' }}
            />
          </div>

          {/* Tab selector */}
          <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'var(--bg-card)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              className="btn-ghost"
              onClick={() => setViewTab('active')}
              style={{ flex: 1, padding: '4px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', background: viewTab === 'active' ? 'rgba(255,255,255,0.06)' : 'none', color: viewTab === 'active' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              Active
            </button>
            <button
              className="btn-ghost"
              onClick={() => setViewTab('archived')}
              style={{ flex: 1, padding: '4px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', background: viewTab === 'archived' ? 'rgba(255,255,255,0.06)' : 'none', color: viewTab === 'archived' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              Archived
            </button>
          </div>

          {/* Notes list */}
          <div className="notes-list">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => {
                const totalChecklist = note.checklist.length;
                const completedChecklist = note.checklist.filter((i) => i.checked).length;
                const snippet = note.content || 'Empty note content...';

                return (
                  <div
                    key={note.id}
                    className={`note-sidebar-card glass ${activeNoteId === note.id ? 'active' : ''}`}
                    onClick={() => setActiveNoteId(note.id)}
                  >
                    <div className="note-card-title-row">
                      <h4>{note.title || 'Untitled Note'}</h4>
                      {note.isPinned && <Pin size={12} className="note-card-pin" fill="currentColor" />}
                    </div>
                    <p className="note-card-snippet">{snippet}</p>
                    <div className="note-card-footer">
                      <span>{note.updatedAt.split(' ')[0]}</span>
                      {totalChecklist > 0 && (
                        <span>
                          Checklist: {completedChecklist}/{totalChecklist}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-secondary text-xs text-center" style={{ padding: 'var(--space-4) 0' }}>No notes found.</p>
            )}
          </div>
        </div>

        {/* Right Column - Note Editor */}
        <div className="note-editor-pane">
          {activeNote ? (
            <div className="note-editor-panel glass animate-scale-in">
              <div className="editor-header">
                <input
                  type="text"
                  className="note-title-input"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateNote({ title: e.target.value })}
                  placeholder="Note Title"
                />
                <div className="editor-actions-top">
                  <button
                    className="icon-btn"
                    onClick={() => handleTogglePin(activeNote.id)}
                    style={{ color: activeNote.isPinned ? 'var(--brand-primary)' : 'inherit' }}
                    title={activeNote.isPinned ? 'Unpin note' : 'Pin note'}
                  >
                    <Pin size={14} fill={activeNote.isPinned ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleToggleArchive(activeNote.id)}
                    style={{ color: activeNote.isArchived ? 'var(--brand-warm)' : 'inherit' }}
                    title={activeNote.isArchived ? 'Move to Active' : 'Archive note'}
                  >
                    <Archive size={14} />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleDeleteNote(activeNote.id)}
                    title="Delete Note"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="editor-toolbar">
                <button type="button" className="toolbar-btn" onClick={() => insertMarkdown('bold')}>
                  <Bold size={13} /> Bold
                </button>
                <button type="button" className="toolbar-btn" onClick={() => insertMarkdown('italic')}>
                  <Italic size={13} /> Italic
                </button>
                <button type="button" className="toolbar-btn" onClick={() => insertMarkdown('code')}>
                  <Code size={13} /> Code
                </button>
                <button type="button" className="toolbar-btn" onClick={() => insertMarkdown('list')}>
                  <List size={13} /> Bullet
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                className="editor-textarea"
                value={activeNote.content}
                onChange={(e) => handleUpdateNote({ content: e.target.value })}
                placeholder="Start typing your scratchpad notes, tips, coordinates, or links here..."
              />

              {/* Checklist Section inside note */}
              <div className="note-checklist-section">
                <h4>Checklist Tasks</h4>
                <div className="note-checklist-list">
                  {activeNote.checklist.map((item) => (
                    <div key={item.id} className={`note-checklist-item ${item.checked ? 'checked' : ''}`}>
                      <div className="cursor-pointer flex items-center" onClick={() => handleToggleChecklistItem(item.id)}>
                        {item.checked ? <CheckSquare size={16} className="text-brand" fill="rgba(108, 99, 255, 0.1)" /> : <Square size={16} className="text-secondary" />}
                      </div>
                      <span>{item.text}</span>
                      <button className="icon-btn delete-btn" onClick={() => handleDeleteChecklistItem(item.id)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddChecklistItem} className="add-checklist-item-form">
                  <input
                    type="text"
                    placeholder="Add task item..."
                    value={newChecklistItemText}
                    onChange={(e) => setNewChecklistItemText(e.target.value)}
                  />
                  <button type="submit" className="btn-brand" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                    <Plus size={12} /> Add
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="glass text-center" style={{ padding: 'var(--space-20) 0' }}>
              <FileText size={36} className="text-tertiary" style={{ marginBottom: 'var(--space-2)' }} />
              <h4>No note selected</h4>
              <p className="text-secondary text-sm">Select a note from the sidebar scratchpad or tap "Note" to create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
