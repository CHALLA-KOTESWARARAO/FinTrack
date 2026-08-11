import React from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Sun, Moon, Bell, Menu, Wallet } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { settings, setTheme, setCurrency } = useFinance();
  const isDark = settings.theme === 'dark';

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle Navigation">
          <Menu size={22} />
        </button>
        <div className="brand-badge-mobile">
          <Wallet className="brand-icon" size={24} />
          <span className="brand-name">FinTrack</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Currency Quick Selector */}
        <div className="currency-selector-wrapper">
          <label htmlFor="currency-select" className="sr-only">Currency</label>
          <select
            id="currency-select"
            value={settings.currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="currency-select-input"
            title="Select Currency"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>

        {/* Theme Switcher Button */}
        <button
          className="navbar-icon-btn"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notification Bell */}
        <button className="navbar-icon-btn notification-btn" title="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        {/* User Profile Info */}
        <div className="user-profile-badge">
          <img
            src={settings.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt="Profile Avatar"
            className="profile-avatar"
          />
          <div className="profile-info-text">
            <span className="profile-name">{settings.user?.name || 'Alex Morgan'}</span>
            <span className="profile-role">Pro Account</span>
          </div>
        </div>
      </div>

      <style>{`
        .navbar-container {
          height: 70px;
          background: var(--navbar-bg);
          backdrop-filter: var(--backdrop-blur);
          border-bottom: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-menu-btn {
          display: none;
          color: var(--text-primary);
          padding: 0.4rem;
          border-radius: var(--radius-sm);

          &:hover {
            background: var(--card-bg-hover);
          }
        }

        .brand-badge-mobile {
          display: none;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-primary);
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-left: auto;
        }

        .currency-select-input {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--card-border);
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;

          &:focus {
            outline: none;
            border-color: var(--accent-primary);
          }
        }

        .navbar-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border: 1px solid var(--card-border);
          transition: var(--transition-fast);
          position: relative;

          &:hover {
            color: var(--text-primary);
            background: var(--card-bg-hover);
            transform: translateY(-1px);
          }
        }

        .notification-btn {
          position: relative;
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--accent-danger);
          border-radius: 50%;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          background: var(--bg-secondary);
          border: 1px solid var(--card-border);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-primary);
        }

        .profile-info-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .profile-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .profile-role {
          font-size: 0.725rem;
          color: var(--text-secondary);
        }

        @media (max-width: 900px) {
          .navbar-container {
            padding: 0 1.25rem;
          }
          .mobile-menu-btn, .brand-badge-mobile {
            display: flex;
          }
          .profile-info-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
