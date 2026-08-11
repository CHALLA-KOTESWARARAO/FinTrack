import React from 'react';
import { useFinance } from '../../hooks/useFinance';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PlusCircle, MinusCircle, Edit3, Activity } from 'lucide-react';

export const RecentActivity = () => {
  const { activities, settings } = useFinance();
  const recentList = activities.slice(0, 5);

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'plus':
        return <PlusCircle size={18} style={{ color: 'var(--accent-success)' }} />;
      case 'minus':
        return <MinusCircle size={18} style={{ color: 'var(--accent-danger)' }} />;
      default:
        return <Edit3 size={18} style={{ color: 'var(--accent-info)' }} />;
    }
  };

  return (
    <div className="card activity-card">
      <div className="activity-card-header">
        <h3 className="activity-card-title">
          <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
          Recent Activity
        </h3>
        <span className="badge badge-info">{activities.length} Recorded</span>
      </div>

      {recentList.length === 0 ? (
        <p className="no-activity">No recent activity logged yet.</p>
      ) : (
        <div className="activity-list">
          {recentList.map((item) => (
            <div key={item.id} className="activity-item">
              <div className="activity-left">
                <div className="activity-icon-bg">{getIcon(item.iconType)}</div>
                <div className="activity-details">
                  <span className="activity-title">{item.title}</span>
                  <span className="activity-date">{formatDate(item.date)}</span>
                </div>
              </div>
              <div
                className={`activity-amount ${
                  item.iconType === 'plus' ? 'amount-positive' : 'amount-negative'
                }`}
              >
                {item.iconType === 'plus' ? '+' : '-'}
                {formatCurrency(item.amount, settings.currency)}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .activity-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .activity-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          border: 1px solid var(--card-border);
          transition: var(--transition-fast);

          &:hover {
            background: var(--card-bg-hover);
          }
        }

        .activity-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .activity-icon-bg {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-details {
          display: flex;
          flex-direction: column;
        }

        .activity-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .activity-date {
          font-size: 0.775rem;
          color: var(--text-secondary);
        }

        .activity-amount {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .amount-positive { color: var(--accent-success); }
        .amount-negative { color: var(--accent-danger); }

        .no-activity {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-align: center;
          padding: 1.5rem 0;
        }
      `}</style>
    </div>
  );
};
