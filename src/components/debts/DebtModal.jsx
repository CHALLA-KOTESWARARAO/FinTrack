import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

const DEBT_TYPES = ['Home Loan', 'Vehicle Loan', 'Personal Loan', 'Education Loan', 'Credit Card', 'Other'];

export const DebtModal = ({ isOpen, onClose, debtToEdit = null, onSave }) => {
  const [form, setForm] = useState({ name: '', type: 'Home Loan', borrowedAmount: '', outstandingAmount: '', monthlyEMI: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (debtToEdit) {
      setForm({
        name: debtToEdit.name || '',
        type: debtToEdit.type || 'Home Loan',
        borrowedAmount: debtToEdit.borrowedAmount ?? '',
        outstandingAmount: debtToEdit.outstandingAmount ?? '',
        monthlyEMI: debtToEdit.monthlyEMI ?? '',
        description: debtToEdit.description || ''
      });
    } else {
      setForm({ name: '', type: 'Home Loan', borrowedAmount: '', outstandingAmount: '', monthlyEMI: '', description: '' });
    }
    setErrors({});
  }, [debtToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Debt name is required';
    if (!form.borrowedAmount || Number(form.borrowedAmount) <= 0) e.borrowedAmount = 'Enter the original borrowed amount';
    if (!form.outstandingAmount || Number(form.outstandingAmount) < 0) e.outstandingAmount = 'Enter a valid outstanding balance';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...(debtToEdit ? { id: debtToEdit.id, isDemo: debtToEdit.isDemo } : {}),
      name: form.name.trim(),
      type: form.type,
      borrowedAmount: Number(form.borrowedAmount),
      outstandingAmount: Number(form.outstandingAmount),
      monthlyEMI: Number(form.monthlyEMI) || 0,
      description: form.description.trim()
    });
    onClose();
  };

  const repaid = (Number(form.borrowedAmount) || 0) - (Number(form.outstandingAmount) || 0);
  const pct = form.borrowedAmount > 0 ? (repaid / Number(form.borrowedAmount)) * 100 : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={debtToEdit ? 'Edit Debt' : '+ Add Debt / Loan'}>
      <form onSubmit={handleSubmit}>
        <Input label="Debt / Loan Name" id="name" value={form.name} onChange={handleChange} placeholder="e.g. HDFC Home Loan, SBI Credit Card" required error={errors.name} />
        <Select label="Debt Type" id="type" value={form.type} onChange={handleChange} options={DEBT_TYPES} required />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Total Borrowed ₹" id="borrowedAmount" type="number" min="0" value={form.borrowedAmount} onChange={handleChange} placeholder="e.g. 500000" required error={errors.borrowedAmount} />
          <Input label="Outstanding Balance ₹" id="outstandingAmount" type="number" min="0" value={form.outstandingAmount} onChange={handleChange} placeholder="e.g. 350000" required error={errors.outstandingAmount} />
        </div>

        <Input label="Monthly EMI ₹ (Optional)" id="monthlyEMI" type="number" min="0" value={form.monthlyEMI} onChange={handleChange} placeholder="e.g. 7500" />

        {Number(form.borrowedAmount) > 0 && Number(form.outstandingAmount) >= 0 && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Repaid So Far</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{Math.max(0, pct).toFixed(1)}%</span>
            </div>
            <div style={{ background: 'var(--card-border)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: 'var(--accent-success)', borderRadius: '999px' }} />
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Note (Optional)</label>
          <textarea name="description" className="form-input" rows="2" value={form.description} onChange={handleChange} placeholder="Any details..." />
        </div>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{debtToEdit ? 'Update Debt' : 'Save Debt'}</Button>
        </div>
      </form>
    </Modal>
  );
};
