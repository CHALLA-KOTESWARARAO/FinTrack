import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Button } from '../components/common/Button';
import { Settings as SettingsIcon, Sun, Moon, DollarSign, Database, ShieldCheck, Download, Upload, RotateCcw } from 'lucide-react';

export const Settings = () => {
  const {
    settings,
    setTheme,
    setCurrency,
    restoreDemoData,
    importBackup,
    assets,
    debts,
    activities
  } = useFinance();

  const [importStatus, setImportStatus] = useState('');

  const isDark = settings.theme === 'dark';

  // Export JSON Backup file downloader
  const handleExportJSON = () => {
    const dataObj = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      assets,
      debts,
      activities,
      settings
    };

    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinTrack_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup file reader
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (parsed.assets || parsed.debts) {
          importBackup(parsed);
          setImportStatus('Backup data imported successfully!');
        } else {
          setImportStatus('Invalid JSON format. Please upload a valid FinTrack backup file.');
        }
      } catch {
        setImportStatus('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <SettingsIcon style={{ color: 'var(--accent-primary)' }} />
            Application Settings
          </h1>
          <p className="page-subtitle">Configure display preferences, local storage, and backup files.</p>
        </div>
      </div>

      {/* Preferences Section: Theme & Currency */}
      <div className="card settings-card">
        <h3 className="settings-section-title">App Preferences</h3>

        <div className="settings-options-grid">
          {/* Currency Switcher */}
          <div className="settings-item">
            <div className="settings-item-info">
              <DollarSign size={20} className="settings-icon" />
              <div>
                <strong>Display Currency</strong>
                <p>Choose your primary currency symbol for portfolio calculations.</p>
              </div>
            </div>
            <select
              className="form-select settings-select"
              value={settings.currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">Indian Rupee (₹ INR)</option>
              <option value="USD">US Dollar ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
              <option value="GBP">British Pound (£ GBP)</option>
            </select>
          </div>

          {/* Theme Switcher */}
          <div className="settings-item">
            <div className="settings-item-info">
              {isDark ? <Moon size={20} className="settings-icon" /> : <Sun size={20} className="settings-icon" />}
              <div>
                <strong>Appearance Theme</strong>
                <p>Toggle between Dark Navy and Modern Light mode.</p>
              </div>
            </div>
            <div className="theme-toggle-group">
              <button
                className={`btn btn-sm ${!isDark ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTheme('light')}
              >
                <Sun size={16} /> Light
              </button>
              <button
                className={`btn btn-sm ${isDark ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTheme('dark')}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile View */}
      <div className="card settings-card">
        <h3 className="settings-section-title">User Profile Info</h3>
        <div className="profile-settings-flex">
          <img
            src={settings.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt="Profile Avatar"
            className="settings-avatar"
          />
          <div className="profile-details-grid">
            <div>
              <span className="profile-meta-label">Account Holder</span>
              <strong>{settings.user?.name || 'Alex Morgan'}</strong>
            </div>
            <div>
              <span className="profile-meta-label">Email Address</span>
              <strong>{settings.user?.email || 'demo@fintrack.com'}</strong>
            </div>
            <div>
              <span className="profile-meta-label">Subscription Tier</span>
              <span className="badge badge-success">Portfolio Demo Edition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="card settings-card">
        <h3 className="settings-section-title">
          <Database size={20} style={{ color: 'var(--accent-info)' }} />
          Data Backup & Management
        </h3>

        {importStatus && <div className="import-status-banner">{importStatus}</div>}

        <div className="data-management-grid">
          <div className="data-action-box">
            <h4>Export Data Backup</h4>
            <p>Download a complete JSON backup of all your assets and debts.</p>
            <Button variant="secondary" icon={Download} onClick={handleExportJSON}>
              Export JSON Backup
            </Button>
          </div>

          <div className="data-action-box">
            <h4>Import Data Backup</h4>
            <p>Restore your saved assets and debts from a previously exported JSON backup file.</p>
            <label className="btn btn-secondary file-input-label">
              <Upload size={18} /> Upload JSON File
              <input type="file" accept=".json" onChange={handleImportFile} hidden />
            </label>
          </div>

          <div className="data-action-box">
            <h4>Restore Demo Data</h4>
            <p>Reset to the default demo portfolio assets and debts at any time.</p>
            <Button variant="secondary" icon={RotateCcw} onClick={restoreDemoData}>
              Restore Default Demo Data
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="card privacy-notice-card">
        <div className="privacy-notice-content">
          <ShieldCheck size={26} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
          <div>
            <h4 className="privacy-title">Data Protection & Privacy Notice</h4>
            <p className="privacy-desc">
              Your default demo data is protected and always preserved. Any custom assets or debts you add are saved locally in your browser using LocalStorage.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .settings-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .settings-section-title {
          font-size: 1.15rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .settings-options-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .settings-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .settings-item-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .settings-icon {
          color: var(--accent-primary);
        }

        .settings-select {
          width: auto;
          min-width: 180px;
        }

        .theme-toggle-group {
          display: flex;
          gap: 0.5rem;
        }

        .profile-settings-flex {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: var(--bg-secondary);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          flex-wrap: wrap;
        }

        .settings-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--accent-primary);
        }

        .profile-details-grid {
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
        }

        .profile-meta-label {
          display: block;
          font-size: 0.775rem;
          color: var(--text-secondary);
          margin-bottom: 0.2rem;
        }

        .data-management-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }

        .data-action-box {
          background: var(--bg-secondary);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;

          h4 { font-size: 0.95rem; font-weight: 700; }
          p { font-size: 0.825rem; color: var(--text-secondary); }
        }

        .file-input-label {
          cursor: pointer;
          margin: 0;
        }

        .import-status-banner {
          padding: 0.75rem 1rem;
          background: var(--badge-info-bg);
          color: var(--accent-info);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .privacy-notice-card {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), transparent);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .privacy-notice-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .privacy-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .privacy-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
};
