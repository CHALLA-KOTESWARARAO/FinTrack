import React from 'react';
import { useFinance } from '../hooks/useFinance';
import { ChartCard } from '../components/common/ChartCard';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
  calculateTotalInvested,
  calculateGainLoss,
  calculateGainLossPercentage,
  getAssetCategoryBreakdown,
  getDebtTypeBreakdown,
  getFinancialHealthMetrics
} from '../utils/calculations';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { PieChart, TrendingUp, ShieldAlert, Award, Activity } from 'lucide-react';

const ASSET_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6', '#3b82f6'];
const DEBT_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#a855f7'];

export const Reports = () => {
  const {
    assets,
    debts,
    totalAssets,
    totalDebt,
    netWorth,
    debtToAssetRatio,
    settings
  } = useFinance();

  const totalPurchase = calculateTotalInvested(assets);
  const totalGainLoss = calculateGainLoss(totalPurchase, totalAssets);
  const overallReturnPct = calculateGainLossPercentage(totalPurchase, totalAssets);
  const isPositiveGain = totalGainLoss >= 0;

  const assetBreakdown = getAssetCategoryBreakdown(assets);
  const debtBreakdown = getDebtTypeBreakdown(debts);
  const healthMetrics = getFinancialHealthMetrics(totalAssets, totalDebt, netWorth, debtToAssetRatio);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <PieChart style={{ color: 'var(--accent-primary)' }} />
            Financial Reports & Diagnostics
          </h1>
          <p className="page-subtitle">Detailed breakdown of assets, debt distribution, return on investment, and health ratios.</p>
        </div>
      </div>

      {/* Net Worth Calculation Equation Banner */}
      <div className="card net-worth-equation-card">
        <h3 className="equation-title">Net Worth Calculation Summary</h3>
        <div className="equation-grid">
          <div className="equation-item">
            <span className="eq-label">Total Assets</span>
            <span className="eq-value positive">{formatCurrency(totalAssets, settings.currency)}</span>
          </div>

          <div className="equation-operator">-</div>

          <div className="equation-item">
            <span className="eq-label">Total Debts</span>
            <span className="eq-value negative">{formatCurrency(totalDebt, settings.currency)}</span>
          </div>

          <div className="equation-operator">=</div>

          <div className="equation-item result">
            <span className="eq-label">Net Worth</span>
            <span className="eq-value highlight">{formatCurrency(netWorth, settings.currency)}</span>
          </div>
        </div>
      </div>

      {/* Gain / Loss & ROI Overview Card */}
      <div className="card gain-loss-summary-card">
        <div className="card-header-flex">
          <h3 className="card-title">
            <TrendingUp size={20} style={{ color: isPositiveGain ? 'var(--accent-success)' : 'var(--accent-danger)' }} />
            Portfolio Gain / Loss Performance
          </h3>
          <span className={`badge ${isPositiveGain ? 'badge-success' : 'badge-danger'}`}>
            Overall Return: {formatPercentage(overallReturnPct)}
          </span>
        </div>

        <div className="roi-metrics-grid">
          <div className="roi-metric">
            <span className="metric-label">Total Purchase Value</span>
            <span className="metric-value">{formatCurrency(totalPurchase, settings.currency)}</span>
          </div>
          <div className="roi-metric">
            <span className="metric-label">Current Portfolio Valuation</span>
            <span className="metric-value">{formatCurrency(totalAssets, settings.currency)}</span>
          </div>
          <div className="roi-metric">
            <span className="metric-label">Net Unrealized Gain / Loss</span>
            <span className={`metric-value ${isPositiveGain ? 'positive-val' : 'negative-val'}`}>
              {isPositiveGain ? '+' : ''}
              {formatCurrency(totalGainLoss, settings.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-charts-grid">
        <ChartCard title="Asset Breakdown" subtitle="Capital allocation by asset class">
          {assetBreakdown.length === 0 ? (
            <div className="chart-empty-text">No asset data recorded</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <RePieChart>
                <Pie data={assetBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {assetBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val, settings.currency)} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RePieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Debt Breakdown" subtitle="Distribution of liabilities and loans">
          {debtBreakdown.length === 0 ? (
            <div className="chart-empty-text">Zero debt liabilities recorded</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <RePieChart>
                <Pie data={debtBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {debtBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEBT_COLORS[index % DEBT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val, settings.currency)} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RePieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Financial Health Indicators */}
      <div className="card health-card">
        <div className="card-header-flex">
          <h3 className="card-title">
            <Award size={20} style={{ color: 'var(--accent-warning)' }} />
            Financial Health Diagnostics
          </h3>
        </div>

        <div className="health-grid">
          <div className="health-indicator-box">
            <span className="health-label">Net Worth Growth</span>
            <span className="health-status" style={{ color: healthMetrics.netWorthColor }}>
              {healthMetrics.netWorthStatus}
            </span>
          </div>

          <div className="health-indicator-box">
            <span className="health-label">Debt-to-Asset Leverage Ratio</span>
            <span className="health-status" style={{ color: healthMetrics.ratioColor }}>
              {debtToAssetRatio}% ({healthMetrics.ratioStatus})
            </span>
          </div>

          <div className="health-indicator-box">
            <span className="health-label">Asset Growth Trajectory</span>
            <span className="health-status" style={{ color: 'var(--accent-success)' }}>
              {healthMetrics.assetGrowth}
            </span>
          </div>

          <div className="health-indicator-box">
            <span className="health-label">Liabilities Stress Level</span>
            <span className="health-status" style={{ color: debtToAssetRatio < 35 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
              {healthMetrics.debtLevel}
            </span>
          </div>
        </div>

        <div className="disclaimer-banner">
          <ShieldAlert size={18} style={{ color: 'var(--accent-warning)', flexShrink: 0 }} />
          <p className="disclaimer-text">
            <strong>Disclaimer:</strong> FinTrack does not provide certified financial advice or investment recommendations. All health scores and ratios are intended purely for personal tracking and visualization purposes.
          </p>
        </div>
      </div>

      <style>{`
        .net-worth-equation-card {
          background: linear-gradient(135deg, var(--card-bg), var(--bg-secondary));
        }

        .equation-title {
          font-size: 1.1rem;
          margin-bottom: 1.25rem;
        }

        .equation-grid {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .equation-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .eq-label {
          font-size: 0.825rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .eq-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
        }

        .eq-value.positive { color: var(--accent-success); }
        .eq-value.negative { color: var(--accent-danger); }
        .eq-value.highlight { color: var(--accent-primary); }

        .equation-operator {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-muted);
        }

        .gain-loss-summary-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-title {
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .roi-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .roi-metric {
          background: var(--bg-secondary);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .metric-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .metric-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
        }

        .positive-val { color: var(--accent-success); }
        .negative-val { color: var(--accent-danger); }

        .health-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .health-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .health-indicator-box {
          background: var(--bg-secondary);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .health-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .health-status {
          font-weight: 700;
          font-size: 1rem;
        }

        .disclaimer-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          background: var(--badge-warning-bg);
          border-radius: var(--radius-md);
        }

        .disclaimer-text {
          font-size: 0.825rem;
          color: var(--badge-warning-text);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
