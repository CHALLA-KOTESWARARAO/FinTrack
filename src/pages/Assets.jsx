import React, { useState, useMemo } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { DataTable } from '../components/common/DataTable';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { AssetModal } from '../components/assets/AssetModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import { calculateGainLoss, calculateGainLossPercentage } from '../utils/calculations';
import { Plus, Edit2, Trash2, Landmark, ArrowUpDown, Lock } from 'lucide-react';

const CATEGORY_FILTER_OPTIONS = [
  { value: 'ALLzz', label: 'All Categories' },
  { value: 'Bank Account', label: 'Bank Account' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Fixed Deposit', label: 'Fixed Deposit' },
  { value: 'Recurring Deposit', label: 'Recurring Deposit' },
  { value: 'Stocks', label: 'Stocks' },
  { value: 'Mutual Funds', label: 'Mutual Funds' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Other', label: 'Other' }
];

const SORT_OPTIONS = [
  { value: 'HIGHEST_VALUE', label: 'Highest Value' },
  { value: 'LOWEST_VALUE', label: 'Lowest Value' },
  { value: 'NEWEST', label: 'Newest Purchase' },
  { value: 'OLDEST', label: 'Oldest Purchase' },
  { value: 'NAME_ASC', label: 'Name (A-Z)' },
  { value: 'NAME_DESC', label: 'Name (Z-A)' }
];

export const Assets = () => {
  const { assets, totalAssets, addAsset, updateAsset, deleteAsset, settings } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('HIGHEST_VALUE');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter & Sort Logic
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const matchesCategory = categoryFilter === 'ALL' || asset.category === categoryFilter;
        const matchesSearch =
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'HIGHEST_VALUE') return b.currentValue - a.currentValue;
        if (sortBy === 'LOWEST_VALUE') return a.currentValue - b.currentValue;
        if (sortBy === 'NEWEST') return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        if (sortBy === 'OLDEST') return new Date(a.purchaseDate) - new Date(b.purchaseDate);
        if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
        if (sortBy === 'NAME_DESC') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [assets, searchTerm, categoryFilter, sortBy]);

  const handleOpenAddModal = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  const handleSaveAsset = (assetData) => {
    if (assetData.id) {
      updateAsset(assetData);
    } else {
      addAsset(assetData);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingAsset) return;
    const res = deleteAsset(deletingAsset.id);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setDeletingAsset(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Asset Name',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <strong style={{ fontSize: '0.95rem' }}>{row.name}</strong>
            {row.isDemo && (
              <span className="badge badge-info" title="Default Demo Asset" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                Demo Data
              </span>
            )}
          </div>
          {row.description && (
            <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{row.description}</span>
          )}
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <Badge variant="info">{row.category}</Badge>
    },
    {
      key: 'purchaseValue',
      label: 'Purchase Value',
      render: (row) => formatCurrency(row.purchaseValue, settings.currency)
    },
    {
      key: 'currentValue',
      label: 'Current Value',
      render: (row) => (
        <strong style={{ fontFamily: 'Outfit, sans-serif' }}>
          {formatCurrency(row.currentValue, settings.currency)}
        </strong>
      )
    },
    {
      key: 'purchaseDate',
      label: 'Purchase Date',
      render: (row) => formatDate(row.purchaseDate)
    },
    {
      key: 'gainLoss',
      label: 'Gain / Loss',
      render: (row) => {
        const gl = calculateGainLoss(row.purchaseValue, row.currentValue);
        const glPct = calculateGainLossPercentage(row.purchaseValue, row.currentValue);
        const isPos = gl >= 0;
        return (
          <span className={`badge ${isPos ? 'badge-success' : 'badge-danger'}`}>
            {isPos ? '+' : ''}
            {formatCurrency(gl, settings.currency)} ({formatPercentage(glPct)})
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          <button
            className="btn btn-secondary btn-sm btn-icon"
            onClick={() => handleOpenEditModal(row)}
            title="Edit Asset"
          >
            <Edit2 size={16} />
          </button>
          {row.isDemo ? (
            <button
              className="btn btn-secondary btn-sm btn-icon"
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
              onClick={() => setErrorMessage('Default demo items are protected and cannot be deleted. Add your own asset to test deletion!')}
              title="Demo data protected from deletion"
            >
              <Lock size={15} />
            </button>
          ) : (
            <button
              className="btn btn-outline-danger btn-sm btn-icon"
              onClick={() => setDeletingAsset(row)}
              title="Delete Asset"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Landmark style={{ color: 'var(--accent-primary)' }} />
            Assets Portfolio
          </h1>
          <p className="page-subtitle">
            Total Valuation: <strong>{formatCurrency(totalAssets, settings.currency)}</strong> across{' '}
            {assets.length} assets
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
          Add Asset
        </Button>
      </div>

      {/* Demo Error Banner Notice */}
      {errorMessage && (
        <div className="demo-error-toast" onClick={() => setErrorMessage('')}>
          <span>{errorMessage}</span>
          <span className="toast-dismiss">Dismiss</span>
        </div>
      )}

      {/* Toolbar: Search, Category Filter, Sorting */}
      <div className="toolbar-container">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search assets by name or category..." />

        <div className="filter-actions">
          <FilterDropdown label="Category" value={categoryFilter} onChange={setCategoryFilter} options={CATEGORY_FILTER_OPTIONS} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table or Empty State */}
      {filteredAssets.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title={assets.length === 0 ? 'No assets recorded yet' : 'No matching assets found'}
          description={
            assets.length === 0
              ? 'Start tracking your wealth by adding your bank accounts, stocks, mutual funds, or real estate.'
              : 'Try clearing your search terms or selecting a different category filter.'
          }
          actionButton={
            assets.length === 0 ? (
              <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
                Add Your First Asset
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('ALL');
                }}
              >
                Clear Filters
              </Button>
            )
          }
        />
      ) : (
        <DataTable columns={columns} data={filteredAssets} />
      )}

      {/* Add / Edit Asset Modal */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assetToEdit={editingAsset}
        onSave={handleSaveAsset}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingAsset)}
        onClose={() => setDeletingAsset(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Asset"
        message={
          deletingAsset?.isDemo
            ? 'Default demo data items are protected and cannot be deleted.'
            : 'Are you sure you want to delete this asset? It will be permanently removed from your portfolio.'
        }
      />

      <style>{`
        .demo-error-toast {
          background: var(--badge-warning-bg);
          color: var(--badge-warning-text);
          border: 1px solid var(--accent-warning);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }
        .toast-dismiss {
          font-size: 0.75rem;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
