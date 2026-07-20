import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ExplorePage from './pages/Explore/ExplorePage';
import CountryPage from './pages/Explore/CountryPage';
import TripsPage from './pages/Trips/TripsPage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import { Toaster } from 'react-hot-toast';

// Simple Premium Placeholder Component for pages under construction
function PlaceholderPage({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="container text-center" style={{ padding: 'var(--space-20) var(--space-6)' }}>
      <div className="glass" style={{ padding: 'var(--space-12)', borderRadius: 'var(--radius-xl)', maxWidth: '540px', margin: '0 auto' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{icon}</div>
        <h1 className="font-display" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-2)' }}>{title}</h1>
        <p className="text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
          This premium feature is currently being connected to the cloud backend.
        </p>
        <div className="badge badge-brand">Coming Soon</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div id="root">
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/explore/country/:id" element={<CountryPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/maps" element={<PlaceholderPage title="Interactive World Map" icon="🗺️" />} />
                <Route path="/lists" element={<PlaceholderPage title="Custom Travel Lists" icon="⭐" />} />
                <Route path="/budget" element={<PlaceholderPage title="Budget & Expense Tracker" icon="💰" />} />
                <Route path="/journal" element={<PlaceholderPage title="Travel Journal & Memories" icon="📓" />} />
                <Route path="/packing" element={<PlaceholderPage title="Smart Packing Checklist" icon="Backpack" />} />
                <Route path="/notes" element={<PlaceholderPage title="Rich Text Travel Notes" icon="📝" />} />
                <Route path="/documents" element={<PlaceholderPage title="Secure Document Vault" icon="🔒" />} />
                <Route path="/scratch-map" element={<PlaceholderPage title="Travel Scratch Map" icon="🗺️" />} />
                <Route path="/profile" element={<PlaceholderPage title="User Profile & Stats" icon="👤" />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<PlaceholderPage title="Travel Notifications" icon="🔔" />} />
                <Route path="*" element={<PlaceholderPage title="Page Not Found" icon="🗺️" />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-glass-strong)',
                backdropFilter: 'var(--blur-md)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
