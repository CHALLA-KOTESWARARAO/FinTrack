import React, { useState, useMemo } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { DataTable } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { DebtModal } from '../components/debts/DebtModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { formatCurrency } from '../utils/formatters';
import { Plus, Edit2, Trash2, CreditCard, ArrowUpDown, Lock, ArrowRightLeft } from 'lucide-react';

const DEBT_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Types' },
  'Home Loan', 'Vehicle Loan', 'Personal Loan', 'Education Loan', 'Credit Card', 'Other'
].map((o) => typeof o === 'string' ? { value: o, label: o } : o);

const SORT_OPTIONS = [
  { value: 'HIGHEST_OUTSTANDING', label: 'Highest Outstanding' },
  { value: 'LOWEST_OUTSTANDING', label: 'Lowest Outstanding' },
  { value: 'HIGHEST_EMI', label: 'Highest EMI' }
];

export const Debts = () => {
  const { debts, totalDebt, totalMonthlyEMI, addDebt, updateDebt, deleteDebt, settings } = useFinance();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('HIGHEST_OUTSTANDING');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [deletingDebt, setDeletingDebt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return debts
      .filter((d) => {
        const matchType = typeFilter === 'ALL' || d.type === typeFilter;
        const q = search.toLowerCase();
        return matchType && (d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q));
      })
      .sort((a, b) => {
        if (sortBy === 'HIGHEST_OUTSTANDING') return b.outstandingAmount - a.outstandingAmount;
        if (sortBy === 'LOWEST_OUTSTANDING') return a.outstandingAmount - b.outstandingAmount;
        if (sortBy === 'HIGHEST_EMI') return b.monthlyEMI - a.monthlyEMI;
        return 0;
      });
  }, [debts, search, typeFilter, sortBy]);

  const handleSave = (data) => { data.id ? updateDebt(data) : addDebt(data); };

  const handleDelete = () => {
    if (!deletingDebt) return;
    const res = deleteDebt(deletingDebt.id);
    if (!res.success) setErrorMsg(res.message);
    else setDeletingDebt(null);
  };

  const columns = [
    {
      key: 'name', label: 'Debt / Loan Name',
      render: (row) => {
        const borrowed = Number(row.borrowedAmount) || 0;
        const outstanding = Number(row.outstandingAmount) || 0;
        const repaid = borrowed > 0 ? ((borrowed - outstanding) / borrowed) * 100 : 0;
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <strong>{row.name}</strong>
              {row.isDemo && <span className="badge badge-info" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>Demo</span>}
            </div>
            {row.description && <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{row.description}</div>}
            {/* Repayment progress bar */}
            <div style={{ background: 'var(--card-border)', borderRadius: '999px', height: '5px', width: '120px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, Math.max(0, repaid))}%`, height: '100%', background: 'var(--accent-success)', borderRadius: '999px' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{repaid.toFixed(0)}% repaid</span>
          </div>
        );
      }
    },
    { key: 'type', label: 'Type', render: (row) => <Badge variant="danger">{row.type}</Badge> },
    {
      key: 'borrowedAmount', label: 'Borrowed',
      render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(row.borrowedAmount, settings.currency)}</span>
    },
    {
      key: 'outstandingAmount', label: 'Outstanding',
      render: (row) => (
        <strong style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1rem', color: 'var(--accent-danger)' }}>
          {formatCurrency(row.outstandingAmount, settings.currency)}
        </strong>
      )
    },
    {
      key: 'monthlyEMI', label: 'Monthly EMI',
      render: (row) => row.monthlyEMI ? formatCurrency(row.monthlyEMI, settings.currency) : '—'
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditingDebt(row); setIsModalOpen(true); }} title="Edit"><Edit2 size={15} /></button>
          {row.isDemo
            ? <button className="btn btn-secondary btn-sm btn-icon" style={{ opacity: 0.45, cursor: 'not-allowed' }} onClick={() => setErrorMsg('Demo items are protected.')} title="Protected"><Lock size={15} /></button>
            : <button className="btn btn-outline-danger btn-sm btn-icon" onClick={() => setDeletingDebt(row)} title="Delete"><Trash2 size={15} /></button>
          }
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><CreditCard style={{ color: 'var(--accent-danger)' }} />Debts & Liabilities</h1>
          <p className="page-subtitle">
            Outstanding: <strong>{formatCurrency(totalDebt, settings.currency)}</strong>
            {totalMonthlyEMI > 0 && <> · Monthly EMI: <strong>{formatCurrency(totalMonthlyEMI, settings.currency)}</strong></>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={ArrowRightLeft} onClick={() => setIsTxModalOpen(true)}>Record Payment</Button>
          <Button variant="primary" icon={Plus} onClick={() => { setEditingDebt(null); setIsModalOpen(true); }}>Add Debt</Button>
        </div>
      </div>

      {errorMsg && (
        <div className="demo-error-toast" onClick={() => setErrorMsg('')}>
          <span>{errorMsg}</span><span className="toast-dismiss">✕</span>
        </div>
      )}

      <div className="toolbar-container">
        <SearchBar value={search} onChange={setSearch} placeholder="Search debts..." />
        <div className="filter-actions">
          <FilterDropdown value={typeFilter} onChange={setTypeFilter} options={DEBT_FILTER_OPTIONS} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select className="form-select" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0
        ? <EmptyState icon={CreditCard} title={debts.length === 0 ? 'No debts recorded' : 'No matching debts'} description="Add your loans, EMIs, or credit card balance to track them here." actionButton={<Button variant="primary" icon={Plus} onClick={() => { setEditingDebt(null); setIsModalOpen(true); }}>Add Debt</Button>} />
        : <DataTable columns={columns} data={filtered} />
      }

      <DebtModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} debtToEdit={editingDebt} onSave={handleSave} />
      <TransactionModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} />
      <ConfirmDialog
        isOpen={Boolean(deletingDebt)}
        onClose={() => setDeletingDebt(null)}
        onConfirm={handleDelete}
        title="Delete Debt Record"
        message="Are you sure you want to remove this debt permanently?"
      />

      <style>{`
        .demo-error-toast {
          background: var(--badge-warning-bg); color: var(--badge-warning-text);
          border: 1px solid var(--accent-warning);
          padding: 0.75rem 1.25rem; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: space-between;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
        }
        .toast-dismiss { font-size: 0.85rem; opacity: 0.7; }
      `}</style>
    </div>
  );
};
