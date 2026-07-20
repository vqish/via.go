import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Globe, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import './Auth.css';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    try {
      setLoading(true);
      await resetPassword(email);
      setSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
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
          <h2>Reset password</h2>
          <p>We'll email you instructions to reset your password.</p>
        </div>

        {submitted ? (
          <div className="reset-success animate-scale-in text-center">
            <div className="success-icon-wrapper">
              <Check size={28} className="success-check" />
            </div>
            <h3>Check your email</h3>
            <p className="text-secondary text-sm">
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn-brand w-full margin-top-4" style={{ marginTop: 'var(--space-6)', display: 'inline-flex' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" id="forgot-form">
            <div className="form-group">
              <label htmlFor="forgot-email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  id="forgot-email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn-brand w-full" id="forgot-submit-btn" disabled={loading}>
              {loading ? 'Sending Link...' : 'Send Reset Link'} <ArrowRight size={16} />
            </button>

            <p className="auth-footer">
              Remembered your password? <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
