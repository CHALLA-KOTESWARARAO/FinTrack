import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { STORAGE_KEYS, getItem, setItem } from '../utils/storage';
import {
  INITIAL_ASSETS, INITIAL_DEBTS, INITIAL_TRANSACTIONS,
  INITIAL_ACTIVITIES, INITIAL_SETTINGS, INITIAL_HISTORICAL_NET_WORTH
} from '../data/demoData';
import {
  calculateTotalAssets, calculateTotalDebt, calculateNetWorth,
  calculateDebtToAssetRatio, calculateTotalMonthlyEMI
} from '../utils/calculations';

export const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const [assets, setAssets] = useState(() => {
    const stored = getItem(STORAGE_KEYS.ASSETS, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) return INITIAL_ASSETS;
    const hasDemo = stored.some((a) => a.isDemo);
    return hasDemo ? stored : [...INITIAL_ASSETS, ...stored];
  });

  const [debts, setDebts] = useState(() => {
    const stored = getItem(STORAGE_KEYS.DEBTS, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) return INITIAL_DEBTS;
    const hasDemo = stored.some((d) => d.isDemo);
    return hasDemo ? stored : [...INITIAL_DEBTS, ...stored];
  });

  const [transactions, setTransactions] = useState(() => {
    const stored = getItem(STORAGE_KEYS.TRANSACTIONS, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) return INITIAL_TRANSACTIONS;
    return stored;
  });

  const [activities, setActivities] = useState(() =>
    getItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );

  const [settings, setSettings] = useState(() =>
    getItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    getItem(STORAGE_KEYS.AUTH, true)
  );

  useEffect(() => { setItem(STORAGE_KEYS.ASSETS, assets); }, [assets]);
  useEffect(() => { setItem(STORAGE_KEYS.DEBTS, debts); }, [debts]);
  useEffect(() => { setItem(STORAGE_KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { setItem(STORAGE_KEYS.ACTIVITIES, activities); }, [activities]);
  useEffect(() => { setItem(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setItem(STORAGE_KEYS.AUTH, isAuthenticated); }, [isAuthenticated]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  }, [settings.theme]);

  const logActivity = useCallback((type, title, amount, iconType = 'plus') => {
    setActivities((prev) => [{
      id: `act-${Date.now()}`,
      type,
      title,
      amount: Number(amount) || 0,
      date: new Date().toISOString().split('T')[0],
      iconType
    }, ...prev.slice(0, 19)]);
  }, []);

  // ─── Asset CRUD ──────────────────────────────────────────────────────────
  const addAsset = useCallback((newAsset) => {
    const item = {
      ...newAsset,
      id: `ast-${Date.now()}`,
      investedAmount: Number(newAsset.investedAmount) || 0,
      currentValue: Number(newAsset.currentValue) || 0,
      isDemo: false
    };
    setAssets((prev) => [item, ...prev]);
    logActivity('asset', `Added: ${item.name}`, item.currentValue, 'plus');
    return { success: true };
  }, [logActivity]);

  const updateAsset = useCallback((updated) => {
    setAssets((prev) => prev.map((a) =>
      a.id === updated.id
        ? { ...updated, investedAmount: Number(updated.investedAmount) || 0, currentValue: Number(updated.currentValue) || 0 }
        : a
    ));
    return { success: true };
  }, []);

  const deleteAsset = useCallback((id) => {
    const target = assets.find((a) => a.id === id);
    if (!target) return { success: false };
    if (target.isDemo) return { success: false, message: 'Demo data is protected.' };
    setAssets((prev) => prev.filter((a) => a.id !== id));
    logActivity('asset', `Deleted: ${target.name}`, target.currentValue, 'minus');
    return { success: true };
  }, [assets, logActivity]);

  // ─── Debt CRUD ───────────────────────────────────────────────────────────
  const addDebt = useCallback((newDebt) => {
    const item = {
      ...newDebt,
      id: `dbt-${Date.now()}`,
      borrowedAmount: Number(newDebt.borrowedAmount) || 0,
      outstandingAmount: Number(newDebt.outstandingAmount) || 0,
      monthlyEMI: Number(newDebt.monthlyEMI) || 0,
      isDemo: false
    };
    setDebts((prev) => [item, ...prev]);
    logActivity('debt', `Added Debt: ${item.name}`, item.outstandingAmount, 'minus');
    return { success: true };
  }, [logActivity]);

  const updateDebt = useCallback((updated) => {
    setDebts((prev) => prev.map((d) =>
      d.id === updated.id
        ? {
            ...updated,
            borrowedAmount: Number(updated.borrowedAmount) || 0,
            outstandingAmount: Number(updated.outstandingAmount) || 0,
            monthlyEMI: Number(updated.monthlyEMI) || 0
          }
        : d
    ));
    return { success: true };
  }, []);

  const deleteDebt = useCallback((id) => {
    const target = debts.find((d) => d.id === id);
    if (!target) return { success: false };
    if (target.isDemo) return { success: false, message: 'Demo data is protected.' };
    setDebts((prev) => prev.filter((d) => d.id !== id));
    return { success: true };
  }, [debts]);

  // ─── Transactions ─────────────────────────────────────────────────────────
  /**
   * Transaction types and their effects:
   *  - "Asset Top-Up / SIP"  → investedAmount += amount, currentValue += amount
   *  - "Asset Value Update"  → currentValue = amount (manual market update)
   *  - "Debt Payment"        → outstandingAmount -= amount (min 0)
   */
  const addTransaction = useCallback((txData) => {
    const tx = { ...txData, id: `tx-${Date.now()}`, date: txData.date || new Date().toISOString().split('T')[0] };
    setTransactions((prev) => [tx, ...prev]);

    if (tx.type === 'Asset Top-Up / SIP' && tx.targetId) {
      setAssets((prev) => prev.map((a) =>
        a.id === tx.targetId
          ? { ...a, investedAmount: (Number(a.investedAmount) || 0) + Number(tx.amount), currentValue: (Number(a.currentValue) || 0) + Number(tx.amount) }
          : a
      ));
      logActivity('asset', `SIP/Top-Up: ${tx.targetName}`, tx.amount, 'plus');
    }

    if (tx.type === 'Asset Value Update' && tx.targetId) {
      setAssets((prev) => prev.map((a) =>
        a.id === tx.targetId ? { ...a, currentValue: Number(tx.amount) } : a
      ));
      logActivity('asset', `Value Updated: ${tx.targetName}`, tx.amount, 'edit');
    }

    if (tx.type === 'Debt Payment' && tx.targetId) {
      setDebts((prev) => prev.map((d) =>
        d.id === tx.targetId
          ? { ...d, outstandingAmount: Math.max(0, (Number(d.outstandingAmount) || 0) - Number(tx.amount)) }
          : d
      ));
      logActivity('debt', `Payment: ${tx.targetName}`, tx.amount, 'minus');
    }

    return { success: true };
  }, [logActivity]);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Settings & Auth ─────────────────────────────────────────────────────
  const setTheme = useCallback((theme) => setSettings((p) => ({ ...p, theme })), []);
  const setCurrency = useCallback((currency) => setSettings((p) => ({ ...p, currency })), []);

  const login = useCallback((email, password) => {
    if (email === 'demo@fintrack.com' && password === '123456') {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Use demo@fintrack.com / 123456' };
  }, []);

  const logout = useCallback(() => setIsAuthenticated(false), []);

  const restoreDemoData = useCallback(() => {
    setAssets(INITIAL_ASSETS);
    setDebts(INITIAL_DEBTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setActivities(INITIAL_ACTIVITIES);
  }, []);

  const importBackup = useCallback((data) => {
    if (data.assets?.length) setAssets(data.assets);
    if (data.debts?.length) setDebts(data.debts);
    if (data.transactions?.length) setTransactions(data.transactions);
    if (data.settings) setSettings(data.settings);
  }, []);

  // ─── Derived values ───────────────────────────────────────────────────────
  const totalAssets = useMemo(() => calculateTotalAssets(assets), [assets]);
  const totalDebt = useMemo(() => calculateTotalDebt(debts), [debts]);
  const netWorth = useMemo(() => calculateNetWorth(totalAssets, totalDebt), [totalAssets, totalDebt]);
  const debtToAssetRatio = useMemo(() => calculateDebtToAssetRatio(totalAssets, totalDebt), [totalAssets, totalDebt]);
  const totalMonthlyEMI = useMemo(() => calculateTotalMonthlyEMI(debts), [debts]);

  const value = {
    assets, debts, transactions, activities, settings, isAuthenticated,
    historicalNetWorth: INITIAL_HISTORICAL_NET_WORTH,
    totalAssets, totalDebt, netWorth, debtToAssetRatio, totalMonthlyEMI,
    addAsset, updateAsset, deleteAsset,
    addDebt, updateDebt, deleteDebt,
    addTransaction, deleteTransaction,
    setTheme, setCurrency,
    login, logout,
    restoreDemoData, importBackup
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
