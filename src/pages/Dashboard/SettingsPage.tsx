import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { allCountries } from '../../data/countries';
import { toast } from 'react-hot-toast';
import { Shield, Moon, Sun, Globe, Award } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const { userProfile, updateUserProfile } = useAuth();
  
  const [nationality, setNationality] = useState('us');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');

  // Load current settings from user profile or fallback to localStorage
  useEffect(() => {
    if (userProfile?.settings) {
      const s = userProfile.settings;
      setNationality(s.nationality || 'us');
      setTheme(s.theme || 'dark');
      setCurrency(s.currency || 'USD');
      setLanguage(s.language || 'en');
      setUnits(s.units || 'metric');
      setNotifications(s.notifications !== undefined ? s.notifications : true);
      setPrivacy(s.privacy || 'public');
    } else {
      const localNationality = localStorage.getItem('user_passport_country') || 'us';
      setNationality(localNationality);
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSettings = {
        theme,
        currency,
        language,
        units,
        notifications,
        privacy,
        nationality
      };
      
      localStorage.setItem('user_passport_country', nationality);
      
      if (updateUserProfile) {
        await updateUserProfile({
          settings: newSettings
        });
      }
      
      // Update HTML theme attribute
      document.documentElement.setAttribute('data-theme', theme);
      
      toast.success('Settings updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings.');
    }
  };

  return (
    <div className="settings-page container-sm">
      <div className="settings-header">
        <h1 className="font-display">Account Settings</h1>
        <p className="text-secondary text-sm">Customize your travel preference dashboard, visa tracking, and theme styles.</p>
      </div>

      <form onSubmit={handleSave} className="settings-form flex flex-col gap-6">
        {/* Visa & Nationality preference */}
        <div className="settings-section glass">
          <div className="section-title">
            <Award size={20} className="text-brand" />
            <h3>Visa & Passport Settings</h3>
          </div>
          <div className="divider" style={{ margin: 'var(--space-3) 0' }} />
          <div className="form-group">
            <label>Passport Country (Nationality)</label>
            <p className="text-secondary text-xs" style={{ marginBottom: 'var(--space-2)' }}>
              This selection dynamically calculates visa rules (Visa-Free, Visa on Arrival, eVisa) for all 195 destinations.
            </p>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="settings-select"
            >
              {allCountries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flagEmoji} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section glass">
          <div className="section-title">
            <Globe size={20} className="text-brand" />
            <h3>Preferences & Units</h3>
          </div>
          <div className="divider" style={{ margin: 'var(--space-3) 0' }} />
          
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="settings-select">
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="CAD">CAD ($) - Canadian Dollar</option>
                <option value="AUD">AUD ($) - Australian Dollar</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="settings-select">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 'var(--space-3)' }}>
            <label>Measurement Units</label>
            <div className="toggle-group flex gap-2">
              <button
                type="button"
                className={`toggle-btn ${units === 'metric' ? 'active' : ''}`}
                onClick={() => setUnits('metric')}
              >
                Metric (°C, km)
              </button>
              <button
                type="button"
                className={`toggle-btn ${units === 'imperial' ? 'active' : ''}`}
                onClick={() => setUnits('imperial')}
              >
                Imperial (°F, miles)
              </button>
            </div>
          </div>
        </div>

        {/* Design Theme */}
        <div className="settings-section glass">
          <div className="section-title">
            <Sun size={20} className="text-brand" />
            <h3>Appearance</h3>
          </div>
          <div className="divider" style={{ margin: 'var(--space-3) 0' }} />
          <div className="form-group">
            <label>Theme Style</label>
            <div className="toggle-group flex gap-2">
              <button
                type="button"
                className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <Moon size={14} /> Dark Mode
              </button>
              <button
                type="button"
                className={`toggle-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <Sun size={14} /> Light Mode
              </button>
            </div>
          </div>
        </div>

        {/* Security & Notifications */}
        <div className="settings-section glass">
          <div className="section-title">
            <Shield size={20} className="text-brand" />
            <h3>Privacy & Notifications</h3>
          </div>
          <div className="divider" style={{ margin: 'var(--space-3) 0' }} />
          
          <div className="form-group flex flex-col gap-2">
            <div className="checkbox-row flex items-center justify-between">
              <div>
                <label>Enable Email Notifications</label>
                <p className="text-secondary text-xs">Receive flight alerts, packing reminders, and itinerary updates.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="settings-checkbox"
              />
            </div>
            
            <div className="divider" style={{ margin: 'var(--space-2) 0' }} />

            <div className="form-group">
              <label>Profile Privacy</label>
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value as any)} className="settings-select">
                <option value="public">🌍 Public (Anyone can see maps & lists)</option>
                <option value="friends">👥 Friends Only</option>
                <option value="private">🔒 Private (Only you can access)</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-brand save-btn" style={{ padding: '12px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-lg)' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
