/**
 * Calculate total current value of all assets
 */
export const calculateTotalAssets = (assets = []) => {
  return assets.reduce((sum, asset) => sum + (Number(asset.currentValue) || 0), 0);
};

/**
 * Calculate total invested amount across all assets
 */
export const calculateTotalInvested = (assets = []) => {
  return assets.reduce((sum, asset) => sum + (Number(asset.investedAmount) || 0), 0);
};

/**
 * Calculate total outstanding balance of all debts
 */
export const calculateTotalDebt = (debts = []) => {
  return debts.reduce((sum, debt) => sum + (Number(debt.outstandingAmount) || 0), 0);
};

/**
 * Net Worth = Total Assets - Total Debt
 */
export const calculateNetWorth = (totalAssets, totalDebt) => {
  return totalAssets - totalDebt;
};

/**
 * Debt-to-Asset Ratio = (Total Debt / Total Assets) * 100
 */
export const calculateDebtToAssetRatio = (totalAssets, totalDebt) => {
  if (!totalAssets || totalAssets === 0) return 0;
  const ratio = (totalDebt / totalAssets) * 100;
  return Math.min(100, Math.round(ratio));
};

/**
 * Calculate sum of monthly EMIs
 */
export const calculateTotalMonthlyEMI = (debts = []) => {
  return debts.reduce((sum, debt) => sum + (Number(debt.monthlyEMI) || 0), 0);
};

/**
 * Calculate absolute gain/loss
 */
export const calculateGainLoss = (invested, current) => {
  return (Number(current) || 0) - (Number(invested) || 0);
};

/**
 * Calculate percentage gain/loss
 */
export const calculateGainLossPercentage = (invested, current) => {
  const inv = Number(invested) || 0;
  const cur = Number(current) || 0;
  if (inv <= 0) return 0;
  return ((cur - inv) / inv) * 100;
};

/**
 * Group assets by Category for Pie/Donut chart
 */
export const getAssetCategoryBreakdown = (assets = []) => {
  const map = {};
  assets.forEach((asset) => {
    const cat = asset.category || 'Other';
    const val = Number(asset.currentValue) || 0;
    map[cat] = (map[cat] || 0) + val;
  });
  return Object.keys(map).map((category) => ({ name: category, value: map[category] }));
};

/**
 * Group debts by Type for Pie/Donut chart
 */
export const getDebtTypeBreakdown = (debts = []) => {
  const map = {};
  debts.forEach((debt) => {
    const type = debt.type || 'Other';
    const val = Number(debt.outstandingAmount) || 0;
    map[type] = (map[type] || 0) + val;
  });
  return Object.keys(map).map((type) => ({ name: type, value: map[type] }));
};

/**
 * Generate financial health metrics
 */
export const getFinancialHealthMetrics = (totalAssets, totalDebt, netWorth, debtToAssetRatio) => {
  let ratioStatus = 'Excellent';
  let ratioColor = 'var(--accent-success)';
  if (debtToAssetRatio > 50) { ratioStatus = 'High Risk'; ratioColor = 'var(--accent-danger)'; }
  else if (debtToAssetRatio > 35) { ratioStatus = 'Moderate'; ratioColor = 'var(--accent-warning)'; }

  return {
    ratioStatus,
    ratioColor,
    netWorthStatus: netWorth >= 0 ? 'Positive Growth' : 'Negative Net Worth',
    netWorthColor: netWorth >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)',
    debtLevel: debtToAssetRatio < 30 ? 'Low & Manageable' : 'Attention Required'
  };
};
