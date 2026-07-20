import { useState, useEffect } from 'react';
import { Bot, Send, User, Check } from 'lucide-react';
import './AiAssistantPage.css';

interface Message {
  id: string;
  sender: 'via' | 'user';
  text: string;
  timestamp: string;
  itinerary?: {
    days: number;
    destination: string;
    schedule: { dayNum: number; morning: string; afternoon: string; evening: string; cost: string; walking: string }[];
  };
  packingList?: string[];
}

interface SavedTrip {
  id: string;
  name: string;
  country: string;
  startDate: string;
  endDate: string;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'via',
      text: 'Hello! I am VIA, your AI Travel Assistant. Select an active trip context or ask me to generate a custom itinerary or packing list for your next destination!',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState('');

  // Load user trips from localStorage for context
  useEffect(() => {
    const saved = localStorage.getItem('user_trips');
    if (saved) {
      setTrips(JSON.parse(saved));
    }
  }, []);

  const activeTrip = trips.find(t => t.id === selectedTripId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    const userQuery = input.toLowerCase();
    setInput('');

    // Simulate AI response typing delay
    setTimeout(() => {
      let viaMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'via',
        text: '',
        timestamp: 'Just now'
      };

      if (userQuery.includes('itinerary') || userQuery.includes('plan')) {
        // Parse days requested (default to 3 days if not specified)
        const daysMatch = userQuery.match(/\b(\d+)\b/);
        const days = daysMatch ? parseInt(daysMatch[0]) : 3;
        const dest = activeTrip ? activeTrip.country : 'Japan';

        viaMsg.text = `Sure! I have generated a custom ${days}-day itinerary for ${dest} based on your requested context.`;
        viaMsg.itinerary = {
          days,
          destination: dest,
          schedule: Array.from({ length: days }).map((_, i) => ({
            dayNum: i + 1,
            morning: `Explore local old shrines and heritage temples.`,
            afternoon: `Visit the central market and enjoy local food stops.`,
            evening: `Stroll through the neon-lit cityscape and enjoy rooftop restaurants.`,
            cost: `$25 - $50`,
            walking: `2.5 km`
          }))
        };
      } else if (userQuery.includes('pack') || userQuery.includes('packing')) {
        const dest = activeTrip ? activeTrip.country : 'France';
        viaMsg.text = `Here is your customized packing checklist for ${dest} based on local climate expectations:`;
        viaMsg.packingList = [
          'Universal Power Adapter (essential plug types)',
          'Comfortable walking sneakers / boots',
          'Weather-appropriate jacket & umbrella',
          'Digital copy of passport & travel insurance',
          'Prescribed medicines & basic first-aid kit'
        ];
      } else {
        viaMsg.text = `I can help you build custom day-by-day itineraries, generate packing checklists, estimate travel costs, or provide visa/custom guidelines. Try typing: "Generate a 3 day itinerary" or "Create a packing list".`;
      }

      setMessages(prev => [...prev, viaMsg]);
    }, 1000);
  };

  const triggerPreset = (preset: string) => {
    setInput(preset);
  };

  return (
    <div className="ai-assistant-page container">
      {/* Sidebar - Context Selector */}
      <div className="ai-sidebar glass">
        <h3>Trip Context Anchor</h3>
        <p className="text-secondary text-xs">Anchor VIA to one of your planned trips to automatically use its dates and destination.</p>
        
        <select
          value={selectedTripId}
          onChange={(e) => setSelectedTripId(e.target.value)}
          className="context-select"
        >
          <option value="">No Active Context (Custom)</option>
          {trips.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.country})</option>
          ))}
        </select>

        {activeTrip && (
          <div className="context-details-badge glass animate-fade-in mt-3">
            <p><strong>Country:</strong> {activeTrip.country}</p>
            <p><strong>Dates:</strong> {activeTrip.startDate} - {activeTrip.endDate}</p>
          </div>
        )}

        <div className="divider" style={{ margin: 'var(--space-4) 0' }} />

        <h3>Suggested Prompts</h3>
        <div className="presets-list">
          <button onClick={() => triggerPreset('Generate a 3 day itinerary')}>📅 3-Day Itinerary</button>
          <button onClick={() => triggerPreset('Create a packing list')}>🎒 Smart Packing Checklist</button>
          <button onClick={() => triggerPreset('Suggest local customs and etiquette')}>⛩️ Cultural Customs</button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-container glass flex flex-col">
        <div className="chat-header">
          <Bot size={24} className="text-brand animate-pulse" />
          <div>
            <h4>VIA · Virtual Travel Assistant</h4>
            <p className="text-secondary text-xs">Active Context: {activeTrip ? activeTrip.name : 'None'}</p>
          </div>
        </div>

        <div className="messages-scroll">
          {messages.map((m) => (
            <div key={m.id} className={`message-row ${m.sender === 'user' ? 'user-row' : 'via-row'}`}>
              <div className="message-avatar">
                {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="message-bubble glass">
                <p className="message-text">{m.text}</p>
                
                {/* Itinerary output block */}
                {m.itinerary && (
                  <div className="itinerary-ai-output mt-4 flex flex-col gap-4">
                    {m.itinerary.schedule.map((day) => (
                      <div key={day.dayNum} className="day-schedule-card glass">
                        <span className="day-badge">Day {day.dayNum} Schedule</span>
                        <div className="day-schedule-timeline">
                          <p>🌅 <strong>Morning:</strong> {day.morning}</p>
                          <p>☀️ <strong>Afternoon:</strong> {day.afternoon}</p>
                          <p>🌙 <strong>Evening:</strong> {day.evening}</p>
                        </div>
                        <div className="day-schedule-footer">
                          <span>🚶 Walking: {day.walking}</span>
                          <span>💰 Spend: {day.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Packing list output block */}
                {m.packingList && (
                  <div className="packing-ai-output mt-3">
                    <ul className="flex flex-col gap-2">
                      {m.packingList.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-secondary">
                          <Check size={14} className="text-brand" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <span className="message-time">{m.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input panel */}
        <form onSubmit={handleSend} className="chat-input-panel">
          <input
            type="text"
            placeholder="Ask VIA (e.g. Plan a 5-day trip, what to pack, visa requirements...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-btn btn-brand">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
