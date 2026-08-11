import React from 'react';

export const SummaryCard = ({ title, value, icon: Icon, badgeText, badgeVariant = 'info', subtitle }) => {
  return (
    <div className="summary-card card">
      <div className="summary-card-header">
        <span className="summary-card-title">{title}</span>
        {Icon && (
          <div className={`summary-card-icon icon-variant-${badgeVariant}`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="summary-card-value">{value}</div>

      <div className="summary-card-footer">
        {badgeText && <span className={`badge badge-${badgeVariant}`}>{badgeText}</span>}
        {subtitle && <span>{subtitle}</span>}
      </div>

      <style>{`
        .icon-variant-primary { background: var(--badge-info-bg); color: var(--accent-primary); }
        .icon-variant-success { background: var(--badge-success-bg); color: var(--accent-success); }
        .icon-variant-danger { background: var(--badge-danger-bg); color: var(--accent-danger); }
        .icon-variant-warning { background: var(--badge-warning-bg); color: var(--accent-warning); }
        .icon-variant-info { background: var(--badge-info-bg); color: var(--accent-info); }
      `}</style>
    </div>
  );
};
