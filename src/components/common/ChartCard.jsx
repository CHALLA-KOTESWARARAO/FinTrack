import React from 'react';

export const ChartCard = ({ title, subtitle, children, extraHeader }) => {
  return (
    <div className="chart-card card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-card-title">{title}</h3>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>
        {extraHeader && <div>{extraHeader}</div>}
      </div>
      <div className="chart-card-body">{children}</div>

      <style>{`
        .chart-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-height: 380px;
        }

        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .chart-card-title {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .chart-card-subtitle {
          font-size: 0.825rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        .chart-card-body {
          flex: 1;
          width: 100%;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
