import { Link } from 'react-router-dom';
import { Globe, Heart, Link as LinkIcon, Share2 } from 'lucide-react';
import './Footer.css';

const footerLinks = {
  Product: [
    { label: 'Explore', to: '/explore' },
    { label: 'Trip Planner', to: '/trips' },
    { label: 'Maps', to: '/maps' },
    { label: 'Budget Tracker', to: '/budget' },
    { label: 'Travel Journal', to: '/journal' },
  ],
  Discover: [
    { label: 'Popular Destinations', to: '/explore' },
    { label: 'Travel Guides', to: '/explore' },
    { label: 'Hidden Gems', to: '/explore' },
    { label: 'Travel Tips', to: '/explore' },
    { label: 'Itinerary Ideas', to: '/trips' },
  ],
  Company: [
    { label: 'About Us', to: '/' },
    { label: 'Blog', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Press', to: '/' },
    { label: 'Contact', to: '/' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Service', to: '/' },
    { label: 'Cookie Policy', to: '/' },
    { label: 'Accessibility', to: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <Globe size={18} />
              </div>
              <span className="footer-logo-text">via<span>.go</span></span>
            </Link>
            <p className="footer-tagline">Every journey starts here.</p>
            <p className="footer-description">
              Plan, explore, and relive your adventures with the world's most beautiful travel companion. Built for curious souls who love discovering the world.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Social"><Globe size={16} /></a>
              <a href="#" className="social-btn" aria-label="Social"><Share2 size={16} /></a>
              <a href="#" className="social-btn" aria-label="Social"><LinkIcon size={16} /></a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="footer-section">
              <h4 className="footer-section-title">{section}</h4>
              <ul className="footer-links">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider" />

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} via.go. Made with <Heart size={12} className="heart-icon" /> for travelers everywhere.
          </p>
          <div className="footer-bottom-links">
            <span className="footer-stat">🌍 195 Countries</span>
            <span className="footer-stat">✈️ 2M+ Travelers</span>
            <span className="footer-stat">🗺️ 500K+ Attractions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
