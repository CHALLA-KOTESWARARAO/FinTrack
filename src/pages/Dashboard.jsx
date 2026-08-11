import React from 'react';
import { useFinance } from '../hooks/useFinance';
import { SummaryCard } from '../components/common/SummaryCard';
import { ChartCard } from '../components/common/ChartCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getAssetCategoryBreakdown, getDebtTypeBreakdown } from '../utils/calculations';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { useState } from 'react';
import {
  PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  Landmark, CreditCard, Wallet, Percent, ArrowRightLeft,
  TrendingUp, TrendingDown, RefreshCw, Info, Plus
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

const ASSET_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6', '#3b82f6'];
const DEBT_COLORS  = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#a855f7'];

const TX_ICON = { 'Asset Top-Up / SIP': TrendingUp, 'Asset Value Update': RefreshCw, 'Debt Payment': TrendingDown };
const TX_COLOR = { 'Asset Top-Up / SIP': 'var(--accent-success)', 'Asset Value Update': 'var(--accent-info)', 'Debt Payment': 'var(--accent-danger)' };

export const Dashboard = () => {
  const { assets, debts, transactions, totalAssets, totalDebt, netWorth, debtToAssetRatio, historicalNetWorth, settings } = useFinance();
  const [isTxOpen, setIsTxOpen] = useState(false);

  const assetBreakdown = getAssetCategoryBreakdown(assets);
  const debtBreakdown  = getDebtTypeBreakdown(debts);
  const recentTx = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const tooltipContent = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div className="custom-chart-tooltip">
        <span className="tooltip-label">{d.name}</span>
        <span className="tooltip-value">{formatCurrency(d.value, settings.currency)}</span>
      </div>
    );
  };

  const currSymbol = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[settings.currency] || '₹';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Wallet style={{ color: 'var(--accent-primary)' }} />Financial Dashboard</h1>
          <p className="page-subtitle">Your assets, liabilities, and net worth at a glance.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsTxOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowRightLeft size={18} /> Record Transaction
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="summary-cards-grid">
        <SummaryCard title="Total Assets"         value={formatCurrency(totalAssets, settings.currency)} icon={Landmark}    badgeText={`${assets.length} items`}  badgeVariant="success" />
        <SummaryCard title="Total Debt"            value={formatCurrency(totalDebt, settings.currency)}   icon={CreditCard}  badgeText={`${debts.length} loans`}    badgeVariant="danger"  />
        <SummaryCard title="Net Worth"             value={formatCurrency(netWorth, settings.currency)}    icon={Wallet}      badgeText={netWorth >= 0 ? 'Positive' : 'Deficit'} badgeVariant={netWorth >= 0 ? 'success' : 'danger'} />
        <SummaryCard title="Debt-to-Asset Ratio"  value={`${debtToAssetRatio}%`}                         icon={Percent}     badgeText={debtToAssetRatio <= 35 ? 'Healthy' : 'High Leverage'} badgeVariant={debtToAssetRatio <= 35 ? 'success' : 'warning'} />
      </div>

      {/* Pie Charts */}
      <div className="dashboard-charts-grid">
        <ChartCard title="Asset Allocation" subtitle="By current market value">
          {assetBreakdown.length === 0
            ? <p style={{ color: 'var(--text-muted)' }}>No assets yet</p>
            : <ResponsiveContainer width="100%" height={280}>
                <RePieChart>
                  <Pie data={assetBreakdown} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value">
                    {assetBreakdown.map((_, i) => <Cell key={i} fill={ASSET_COLORS[i % ASSET_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={tooltipContent} />
                </RePieChart>
              </ResponsiveContainer>
          }
        </ChartCard>

        <ChartCard title="Debt Distribution" subtitle="By outstanding balance">
          {debtBreakdown.length === 0
            ? <p style={{ color: 'var(--text-muted)' }}>No debts recorded</p>
            : <ResponsiveContainer width="100%" height={280}>
                <RePieChart>
                  <Pie data={debtBreakdown} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value">
                    {debtBreakdown.map((_, i) => <Cell key={i} fill={DEBT_COLORS[i % DEBT_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={tooltipContent} />
                </RePieChart>
              </ResponsiveContainer>
          }
        </ChartCard>
      </div>

      {/* Line Chart + Recent Transactions */}
      <div className="dashboard-charts-grid grid-2-1">
        <ChartCard
          title="Net Worth Trend"
          subtitle="Historical monthly progression"
          extraHeader={
            <span className="demo-notice-chip"><Info size={13} /> Sample Data</span>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={historicalNetWorth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" tickFormatter={(v) => `${currSymbol}${v / 1000}k`} />
              <Tooltip formatter={(v) => [formatCurrency(v, settings.currency), 'Net Worth']} contentStyle={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="netWorth" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent-primary)', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Transactions Panel */}
        <div className="card recent-tx-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRightLeft size={18} style={{ color: 'var(--accent-primary)' }} />
              Recent Transactions
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsTxOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Plus size={15} /> New
            </button>
          </div>

          {recentTx.length === 0
            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>No transactions yet.</p>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentTx.map((tx) => {
                  const Icon = TX_ICON[tx.type] || ArrowRightLeft;
                  const color = TX_COLOR[tx.type] || 'var(--accent-primary)';
                  return (
                    <div key={tx.id} className="recent-tx-item">
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.targetName}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{tx.type} · {formatDate(tx.date)}</div>
                      </div>
                      <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.9rem', color, flexShrink: 0 }}>
                        {tx.type === 'Debt Payment' ? '-' : '+'}{formatCurrency(tx.amount, settings.currency)}
                      </span>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      </div>

      <TransactionModal isOpen={isTxOpen} onClose={() => setIsTxOpen(false)} />

      <style>{`
        .dashboard-charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .grid-2-1 { grid-template-columns: 2fr 1fr; }
        .custom-chart-tooltip { background: var(--card-bg); border: 1px solid var(--card-border); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); box-shadow: var(--shadow-md); }
        .tooltip-label { display: block; font-size: 0.775rem; color: var(--text-secondary); font-weight: 600; }
        .tooltip-value { display: block; font-size: 0.95rem; font-weight: 800; color: var(--accent-primary); }
        .demo-notice-chip { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.2rem 0.6rem; font-size: 0.72rem; color: var(--text-secondary); background: var(--bg-secondary); border: 1px solid var(--card-border); border-radius: var(--radius-full); }
        .recent-tx-card { display: flex; flex-direction: column; }
        .recent-tx-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: var(--radius-md); background: var(--bg-secondary); border: 1px solid var(--card-border); transition: var(--transition-fast); &:hover { background: var(--card-bg-hover); } }
        @media (max-width: 900px) { .dashboard-charts-grid, .grid-2-1 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};
