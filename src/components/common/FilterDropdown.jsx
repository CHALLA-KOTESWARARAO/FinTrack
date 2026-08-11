import React from 'react';
import { Filter } from 'lucide-react';

export const FilterDropdown = ({ label = 'Filter', value, onChange, options = [] }) => {
  return (
    <div className="filter-dropdown-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Filter size={16} style={{ color: 'var(--text-muted)' }} />
      <select
        className="form-select"
        style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={idx} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
};
