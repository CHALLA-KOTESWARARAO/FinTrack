import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFinance } from '../../hooks/useFinance';
import {
  LayoutDashboard,
  Landmark,
  CreditCard,
  ArrowRightLeft,
  PieChart,
  Settings,
  LogOut,
  Wallet,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useFinance();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assets', label: 'Assets', icon: Landmark },
    { path: '/debts', label: 'Debts', icon: CreditCard },
    { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
    { path: '/reports', label: 'Reports', icon: PieChart },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon-wrapper">
              <Wallet size={24} />
            </div>
            <div className="brand-text-wrapper">
              <span className="brand-title">FinTrack</span>
              <span className="brand-subtitle">Assets & Net Worth</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">MAIN MENU</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>

        <style>{`
          .sidebar-container {
            width: 260px;
            background: var(--sidebar-bg);
            border-right: 1px solid var(--sidebar-border);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5rem 1rem;
            height: 100vh;
            position: sticky;
            top: 0;
            z-index: 200;
          }
          .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--sidebar-border);
            margin-bottom: 1.5rem;
          }
          .sidebar-brand { display: flex; align-items: center; gap: 0.75rem; }
          .brand-icon-wrapper {
            width: 40px; height: 40px;
            border-radius: var(--radius-md);
            background: linear-gradient(135deg, var(--accent-primary), #818cf8);
            color: #fff;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(99,102,241,0.35);
          }
          .brand-text-wrapper { display: flex; flex-direction: column; }
          .brand-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.35rem; font-weight: 800;
            color: var(--text-primary);
            letter-spacing: -0.03em; line-height: 1.1;
          }
          .brand-subtitle { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }
          .sidebar-close-btn { display: none; color: var(--text-secondary); &:hover { color: var(--text-primary); } }
          .sidebar-nav { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }
          .nav-section-label {
            font-size: 0.7rem; font-weight: 700;
            color: var(--text-muted); letter-spacing: 0.08em;
            padding: 0.5rem 0.75rem 0.25rem 0.75rem;
          }
          .nav-link {
            display: flex; align-items: center; gap: 0.85rem;
            padding: 0.75rem 1rem;
            color: var(--text-secondary);
            border-radius: var(--radius-md);
            font-size: 0.925rem; font-weight: 600;
            transition: var(--transition-fast);
            &:hover { color: var(--text-primary); background: var(--card-bg-hover); }
          }
          .nav-link.active {
            color: #fff;
            background: linear-gradient(90deg, var(--accent-primary), #4f46e5);
            box-shadow: 0 4px 14px rgba(99,102,241,0.3);
            .nav-icon { color: #fff; }
          }
          .nav-icon { color: var(--text-muted); transition: var(--transition-fast); }
          .sidebar-footer { padding-top: 1rem; border-top: 1px solid var(--sidebar-border); }
          .logout-btn {
            width: 100%; display: flex; align-items: center; gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: var(--accent-danger);
            border-radius: var(--radius-md);
            font-size: 0.9rem; font-weight: 600;
            transition: var(--transition-fast);
            &:hover { background: var(--badge-danger-bg); }
          }
          @media (max-width: 900px) { .sidebar-close-btn { display: flex; } }
        `}</style>
      </aside>
    </>
  );
};
