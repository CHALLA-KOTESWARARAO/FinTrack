import React, { useState, useMemo } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Trash2, ArrowRightLeft, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const TYPE_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Types' },
  { value: 'Asset Top-Up / SIP', label: 'Asset Top-Up / SIP' },
  { value: 'Asset Value Update', label: 'Asset Value Update' },
  { value: 'Debt Payment', label: 'Debt Payment' }
];

const TYPE_CONFIG = {
  'Asset Top-Up / SIP': { variant: 'success', icon: TrendingUp },
  'Asset Value Update': { variant: 'info', icon: RefreshCw },
  'Debt Payment': { variant: 'danger', icon: TrendingDown }
};

export const Transactions = () => {
  const { transactions, deleteTransaction, settings } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchType = typeFilter === 'ALL' || tx.type === typeFilter;
        const q = search.toLowerCase();
        const matchSearch = tx.targetName?.toLowerCase().includes(q) || tx.type?.toLowerCase().includes(q) || tx.note?.toLowerCase().includes(q);
        return matchType && matchSearch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, search, typeFilter]);

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (row) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{formatDate(row.date)}</span>
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => {
        const cfg = TYPE_CONFIG[row.type] || { variant: 'info' };
        return <Badge variant={cfg.variant}>{row.type}</Badge>;
      }
    },
    {
      key: 'targetName',
      label: 'Applied To',
      render: (row) => <strong>{row.targetName}</strong>
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => {
        const isDanger = row.type === 'Debt Payment';
        return (
          <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem', color: isDanger ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
            {isDanger ? '-' : '+'}{formatCurrency(row.amount, settings.currency)}
          </span>
        );
      }
    },
    {
      key: 'note',
      label: 'Note',
      render: (row) => <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{row.note || '—'}</span>
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button className="btn btn-outline-danger btn-sm btn-icon" onClick={() => setDeletingId(row.id)} title="Delete">
          <Trash2 size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ArrowRightLeft style={{ color: 'var(--accent-primary)' }} />
            Transactions
          </h1>
          <p className="page-subtitle">Record SIP top-ups, asset value updates, and EMI payments. Each entry automatically updates your assets or debts.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Record Transaction
        </Button>
      </div>

      {/* How it works */}
      <div className="card tx-guide-card">
        <div className="tx-guide-grid">
          <div className="tx-guide-item">
            <span className="badge badge-success">Asset Top-Up / SIP</span>
            <p>Adds to your Invested Amount + Current Value of the chosen asset (e.g. monthly SIP, gold purchase).</p>
          </div>
          <div className="tx-guide-item">
            <span className="badge badge-info">Asset Value Update</span>
            <p>Replaces the Current Value of an asset with the latest market price (e.g. stock price change, gold rate today).</p>
          </div>
          <div className="tx-guide-item">
            <span className="badge badge-danger">Debt Payment</span>
            <p>Reduces the Outstanding Balance of a loan or credit card (e.g. EMI payment, part-prepayment).</p>
          </div>
        </div>
      </div>

      <div className="toolbar-container">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by asset/debt name or note..." />
        <div className="filter-actions">
          <FilterDropdown value={typeFilter} onChange={setTypeFilter} options={TYPE_FILTER_OPTIONS} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ArrowRightLeft}
          title={transactions.length === 0 ? 'No transactions yet' : 'No matching transactions'}
          description={transactions.length === 0 ? 'Record your first SIP, investment top-up, or loan payment.' : 'Try clearing the filters.'}
          actionButton={transactions.length === 0
            ? <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>Record First Transaction</Button>
            : <Button variant="secondary" onClick={() => { setSearch(''); setTypeFilter('ALL'); }}>Clear Filters</Button>
          }
        />
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { deleteTransaction(deletingId); setDeletingId(null); }}
        title="Delete Transaction"
        message="Remove this transaction log? Note: This won't reverse the effect on the asset or debt."
      />

      <style>{`
        .tx-guide-card { padding: 1.25rem; }
        .tx-guide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .tx-guide-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          p { font-size: 0.825rem; color: var(--text-secondary); line-height: 1.4; margin: 0; }
        }
      `}</style>
    </div>
  );
};
