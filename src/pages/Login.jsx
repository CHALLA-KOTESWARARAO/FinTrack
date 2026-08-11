import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../hooks/useFinance';
import { Wallet, KeyRound, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useFinance();
  const navigate = useNavigate();

  const [email, setEmail] = useState('demo@fintrack.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(email.trim(), password.trim());
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@fintrack.com');
    setPassword('123456');
    setError('');
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper card">
        <div className="login-brand">
          <div className="login-logo-icon">
            <Wallet size={32} />
          </div>
          <h1 className="login-app-title">FinTrack</h1>
          <p className="login-tagline">Track your money. Understand your net worth.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error-alert">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@fintrack.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-with-icon">
              <KeyRound size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            <span>Sign In to Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="demo-credentials-banner">
          <div className="demo-banner-header">
            <ShieldCheck size={16} style={{ color: 'var(--accent-success)' }} />
            <span>Demo Mode Access</span>
          </div>
          <p className="demo-hint-text">
            Use <strong>demo@fintrack.com</strong> and password <strong>123456</strong> to log in.
          </p>
          <button type="button" className="btn-auto-fill" onClick={handleFillDemo}>
            Auto-fill Credentials
          </button>
        </div>
      </div>

      <style>{`
        .login-page-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.15), transparent 40%),
                      var(--bg-primary);
          padding: 1.5rem;
        }

        .login-card-wrapper {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--card-border);
        }

        .login-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .login-logo-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
        }

        .login-app-title {
          font-size: 2rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          color: var(--text-primary);
        }

        .login-tagline {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.35rem;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon input {
          padding-left: 2.6rem;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .login-btn {
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .login-error-alert {
          padding: 0.75rem;
          background: var(--badge-danger-bg);
          color: var(--badge-danger-text);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          text-align: center;
          font-weight: 600;
        }

        .demo-credentials-banner {
          background: var(--bg-secondary);
          border: 1px dashed var(--card-border);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .demo-banner-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .demo-hint-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .btn-auto-fill {
          align-self: flex-start;
          font-size: 0.775rem;
          color: var(--accent-primary);
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          &:hover { color: var(--accent-primary-hover); }
        }
      `}</style>
    </div>
  );
};
