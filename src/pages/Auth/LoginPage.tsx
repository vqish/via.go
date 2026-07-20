import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import './Auth.css';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass animate-scale-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <Globe size={18} />
            </div>
            <span>via.go</span>
          </Link>
          <h2>Welcome back</h2>
          <p>Every journey starts here.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                id="login-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="login-password">Password</label>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-brand w-full" id="login-submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button
          type="button"
          className="google-btn"
          id="google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <span className="google-icon-circle">G</span>
          Sign in with Google
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
