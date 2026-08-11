// Centralized LocalStorage Utility

export const STORAGE_KEYS = {
  ASSETS: 'fintrack_assets',
  DEBTS: 'fintrack_debts',
  TRANSACTIONS: 'fintrack_transactions',
  ACTIVITIES: 'fintrack_activities',
  SETTINGS: 'fintrack_settings',
  AUTH: 'fintrack_auth'
};

export const getItem = (key, fallbackValue) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallbackValue;
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Error reading key "${key}" from LocalStorage:`, error);
    return fallbackValue;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key "${key}" to LocalStorage:`, error);
  }
};

export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing FinTrack LocalStorage data:', error);
  }
};
