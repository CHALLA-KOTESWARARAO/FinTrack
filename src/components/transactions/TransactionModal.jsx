import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useFinance } from '../../hooks/useFinance';

const TX_TYPES = ['Asset Top-Up / SIP', 'Asset Value Update', 'Debt Payment'];

export const TransactionModal = ({ isOpen, onClose }) => {
  const { assets, debts, addTransaction } = useFinance();

  const [type, setType] = useState('Asset Top-Up / SIP');
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  const isAssetTx = type === 'Asset Top-Up / SIP' || type === 'Asset Value Update';
  const targets = isAssetTx ? assets : debts;

  useEffect(() => {
    setTargetId('');
    setErrors({});
  }, [type, isOpen]);

  const validate = () => {
    const e = {};
    if (!targetId) e.targetId = 'Please select a target';
    if (!amount || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    if (!date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const target = targets.find((t) => t.id === targetId);
    addTransaction({
      type,
      targetId,
      targetName: target?.name || '',
      amount: Number(amount),
      note: note.trim(),
      date
    });
    setType('Asset Top-Up / SIP');
    setTargetId('');
    setAmount('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const labelByType = {
    'Asset Top-Up / SIP': { target: 'Select Asset to Top-Up / SIP', amount: 'Top-Up Amount ₹', hint: 'This will add to your invested amount and current value.' },
    'Asset Value Update': { target: 'Select Asset to Update Value', amount: 'New Current Market Value ₹', hint: 'This replaces the current market value of the asset (e.g. stock price change, gold rate update).' },
    'Debt Payment': { target: 'Select Debt / Loan', amount: 'Payment Amount ₹', hint: 'This will reduce the outstanding balance of the loan.' }
  };

  const meta = labelByType[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="+ Record Transaction">
      <form onSubmit={handleSubmit}>
        {/* Transaction Type Chips */}
        <div className="form-group">
          <label className="form-label">Transaction Type</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {TX_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={`tx-type-chip ${type === t ? 'active' : ''}`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        <div className="tx-hint-box">{meta.hint}</div>

        {/* Target selector */}
        <div className="form-group">
          <label className="form-label">{meta.target} <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
          <select
            className={`form-select ${errors.targetId ? 'is-invalid' : ''}`}
            value={targetId}
            onChange={(e) => { setTargetId(e.target.value); setErrors((p) => ({ ...p, targetId: null })); }}
          >
            <option value="">— Select —</option>
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}{t.category ? ` (${t.category})` : t.type ? ` (${t.type})` : ''}
              </option>
            ))}
          </select>
          {errors.targetId && <span className="form-error">{errors.targetId}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label={meta.amount}
            id="amount"
            type="number"
            min="0"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: null })); }}
            placeholder="0"
            required
            error={errors.amount}
          />
          <Input
            label="Date"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            error={errors.date}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Note (Optional)</label>
          <input
            type="text"
            className="form-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Monthly SIP, Credit card bill payment..."
          />
        </div>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Record Transaction</Button>
        </div>
      </form>

      <style>{`
        .tx-type-chip {
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--card-border);
          cursor: pointer;
          transition: var(--transition-fast);
          &:hover { background: var(--card-bg-hover); color: var(--text-primary); }
        }
        .tx-type-chip.active {
          background: var(--accent-primary);
          color: #fff;
          border-color: var(--accent-primary);
        }
        .tx-hint-box {
          font-size: 0.8rem;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border-left: 3px solid var(--accent-primary);
          padding: 0.6rem 0.85rem;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          margin-bottom: 1.2rem;
          line-height: 1.4;
        }
      `}</style>
    </Modal>
  );
};
