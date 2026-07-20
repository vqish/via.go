import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Globe, Search, Menu, X, Sun, Moon, User,
  Map, Compass, PlaneTakeoff, List, Backpack,
  DollarSign, BookOpen, FileText, Lock, Bell,
  LogOut, Settings, ChevronDown, Zap
} from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { label: 'Explore', path: '/explore', icon: <Compass size={16} /> },
  { label: 'Trips', path: '/trips', icon: <PlaneTakeoff size={16} /> },
  { label: 'Maps', path: '/maps', icon: <Map size={16} /> },
  { label: 'Lists', path: '/lists', icon: <List size={16} /> },
];

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setProfileOpen(false);
  };

  const avatarLetter = (userProfile?.displayName || currentUser?.displayName || 'U')[0].toUpperCase();

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Globe size={20} className="logo-globe" />
          </div>
          <span className="logo-text">via<span className="logo-dot">.</span>go</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="nav-link">
              {link.icon}
              {link.label}
            </Link>
          ))}
          {currentUser && (
            <div className="nav-dropdown">
              <button className="nav-link nav-dropdown-trigger">
                More <ChevronDown size={14} />
              </button>
              <div className="nav-dropdown-menu glass">
                <Link to="/budget" className="dropdown-item"><DollarSign size={14}/> Budget</Link>
                <Link to="/journal" className="dropdown-item"><BookOpen size={14}/> Journal</Link>
                <Link to="/packing" className="dropdown-item"><Backpack size={14}/> Packing</Link>
                <Link to="/notes" className="dropdown-item"><FileText size={14}/> Notes</Link>
                <Link to="/documents" className="dropdown-item"><Lock size={14}/> Documents</Link>
                <Link to="/scratch-map" className="dropdown-item"><Map size={14}/> Scratch Map</Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Search */}
          <button
            className="icon-btn"
            id="navbar-search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Theme toggle */}
          <button
            className="icon-btn"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {currentUser ? (
            <div className="profile-dropdown">
              <button
                className="avatar-btn"
                id="profile-menu-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="avatar-img" />
                ) : (
                  <span className="avatar-letter">{avatarLetter}</span>
                )}
              </button>
              {profileOpen && (
                <div className="profile-menu glass animate-fade-in">
                  <div className="profile-menu-header">
                    <div className="profile-menu-avatar">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" />
                      ) : (
                        <span>{avatarLetter}</span>
                      )}
                    </div>
                    <div>
                      <p className="profile-menu-name">{userProfile?.displayName || currentUser.displayName}</p>
                      <p className="profile-menu-email">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="divider" />
                  <Link to="/dashboard" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                    <Zap size={14} /> Dashboard
                  </Link>
                  <Link to="/profile" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                    <User size={14} /> Profile
                  </Link>
                  <Link to="/settings" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                    <Settings size={14} /> Settings
                  </Link>
                  <Link to="/notifications" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                    <Bell size={14} /> Notifications
                  </Link>
                  <div className="divider" />
                  <button className="profile-menu-item profile-menu-logout" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-brand">Get Started</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="icon-btn mobile-menu-btn"
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="navbar-search-bar animate-fade-in">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search countries, cities, attractions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              id="global-search-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                  setSearchQuery('');
                }
                if (e.key === 'Escape') setSearchOpen(false);
              }}
            />
            <button className="icon-btn" onClick={() => setSearchOpen(false)}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu glass animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          {currentUser ? (
            <>
              <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                <Zap size={16}/> Dashboard
              </Link>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                <User size={16}/> Profile
              </Link>
              <button className="mobile-nav-link mobile-logout" onClick={handleLogout}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth">
              <Link to="/login" className="btn-ghost w-full text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-brand w-full text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
