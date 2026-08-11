import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { formatCurrency } from '../../utils/formatters';
import { calculateGainLoss, calculateGainLossPercentage } from '../../utils/calculations';
import { useFinance } from '../../hooks/useFinance';

const CATEGORY_OPTIONS = [
  'Bank Account', 'Cash', 'Fixed Deposit', 'Recurring Deposit',
  'Stocks', 'Mutual Funds', 'Gold', 'Silver', 'Real Estate', 'Other'
];

export const AssetModal = ({ isOpen, onClose, assetToEdit = null, onSave }) => {
  const { settings } = useFinance();
  const [form, setForm] = useState({ name: '', category: 'Bank Account', investedAmount: '', currentValue: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assetToEdit) {
      setForm({
        name: assetToEdit.name || '',
        category: assetToEdit.category || 'Bank Account',
        investedAmount: assetToEdit.investedAmount ?? '',
        currentValue: assetToEdit.currentValue ?? '',
        description: assetToEdit.description || ''
      });
    } else {
      setForm({ name: '', category: 'Bank Account', investedAmount: '', currentValue: '', description: '' });
    }
    setErrors({});
  }, [assetToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Asset name is required';
    if (!form.investedAmount || Number(form.investedAmount) < 0) e.investedAmount = 'Enter a valid invested amount';
    if (!form.currentValue || Number(form.currentValue) < 0) e.currentValue = 'Enter a valid current value';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...(assetToEdit ? { id: assetToEdit.id, isDemo: assetToEdit.isDemo } : {}),
      name: form.name.trim(),
      category: form.category,
      investedAmount: Number(form.investedAmount),
      currentValue: Number(form.currentValue),
      description: form.description.trim()
    });
    onClose();
  };

  const inv = Number(form.investedAmount) || 0;
  const cur = Number(form.currentValue) || 0;
  const gl = calculateGainLoss(inv, cur);
  const glPct = calculateGainLossPercentage(inv, cur);
  const isPos = gl >= 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={assetToEdit ? 'Edit Asset' : '+ Add Asset'}>
      <form onSubmit={handleSubmit}>
        <Input label="Asset Name" id="name" value={form.name} onChange={handleChange} placeholder="e.g. Gold, HDFC Savings, SBI FD" required error={errors.name} />
        <Select label="Category" id="category" value={form.category} onChange={handleChange} options={CATEGORY_OPTIONS} required />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Total Invested ₹"
            id="investedAmount"
            type="number"
            min="0"
            value={form.investedAmount}
            onChange={handleChange}
            placeholder="e.g. 1000"
            error={errors.investedAmount}
            required
          />
          <Input
            label="Current Market Value ₹"
            id="currentValue"
            type="number"
            min="0"
            value={form.currentValue}
            onChange={handleChange}
            placeholder="e.g. 990"
            error={errors.currentValue}
            required
          />
        </div>

        {inv > 0 && cur > 0 && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Gain / Loss Preview</span>
            <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1rem', color: isPos ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
              {isPos ? '+' : ''}{formatCurrency(gl, settings.currency)} ({isPos ? '+' : ''}{glPct.toFixed(1)}%)
            </span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Note (Optional)</label>
          <textarea name="description" className="form-input" rows="2" value={form.description} onChange={handleChange} placeholder="Any details..." />
        </div>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{assetToEdit ? 'Update Asset' : 'Save Asset'}</Button>
        </div>
      </form>
    </Modal>
  );
};
