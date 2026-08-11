export const INITIAL_ASSETS = [
  {
    id: 'ast-1',
    name: 'HDFC Savings Account',
    category: 'Bank Account',
    investedAmount: 50000,
    currentValue: 55000,
    description: 'Emergency liquid savings',
    isDemo: true
  },
  {
    id: 'ast-2',
    name: '24K Digital Gold',
    category: 'Gold',
    investedAmount: 1000,
    currentValue: 990,
    description: 'Gold investment',
    isDemo: true
  },
  {
    id: 'ast-3',
    name: 'Nippon Small Cap SIP',
    category: 'Mutual Funds',
    investedAmount: 100000,
    currentValue: 125000,
    description: 'Equity mutual fund SIP',
    isDemo: true
  },
  {
    id: 'ast-4',
    name: 'SBI Fixed Deposit',
    category: 'Fixed Deposit',
    investedAmount: 100000,
    currentValue: 106000,
    description: '3-year FD @ 7.1% interest',
    isDemo: true
  },
  {
    id: 'ast-5',
    name: 'Bluechip Equity Portfolio',
    category: 'Stocks',
    investedAmount: 85000,
    currentValue: 101000,
    description: 'Direct equity stocks',
    isDemo: true
  },
  {
    id: 'ast-6',
    name: 'Cash in Hand',
    category: 'Cash',
    investedAmount: 28000,
    currentValue: 28000,
    description: 'Daily cash',
    isDemo: true
  }
];

export const INITIAL_DEBTS = [
  {
    id: 'dbt-1',
    name: 'HDFC Home Loan',
    type: 'Home Loan',
    borrowedAmount: 150000,
    outstandingAmount: 100000,
    monthlyEMI: 7500,
    description: 'Apartment home loan',
    isDemo: true
  },
  {
    id: 'dbt-2',
    name: 'ICICI Vehicle Loan',
    type: 'Vehicle Loan',
    borrowedAmount: 50000,
    outstandingAmount: 30000,
    monthlyEMI: 3500,
    description: 'Two-wheeler loan',
    isDemo: true
  },
  {
    id: 'dbt-3',
    name: 'SBI Credit Card',
    type: 'Credit Card',
    borrowedAmount: 25000,
    outstandingAmount: 20000,
    monthlyEMI: 1500,
    description: 'Card outstanding balance',
    isDemo: true
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    date: '2026-08-10',
    type: 'Asset Top-Up / SIP',
    targetType: 'asset',
    targetId: 'ast-3',
    targetName: 'Nippon Small Cap SIP',
    amount: 5000,
    note: 'Monthly SIP Investment'
  },
  {
    id: 'tx-2',
    date: '2026-08-08',
    type: 'Debt Payment',
    targetType: 'debt',
    targetId: 'dbt-3',
    targetName: 'SBI Credit Card',
    amount: 5000,
    note: 'Credit Card Outstanding Clearance'
  },
  {
    id: 'tx-3',
    date: '2026-08-05',
    type: 'Asset Top-Up / SIP',
    targetType: 'asset',
    targetId: 'ast-2',
    targetName: '24K Digital Gold',
    amount: 1000,
    note: 'Gold Purchase Investment'
  },
  {
    id: 'tx-4',
    date: '2026-08-01',
    type: 'Debt Payment',
    targetType: 'debt',
    targetId: 'dbt-2',
    targetName: 'ICICI Vehicle Loan',
    amount: 3500,
    note: 'Vehicle Loan Monthly EMI'
  }
];

export const INITIAL_HISTORICAL_NET_WORTH = [
  { month: 'Jan', netWorth: 280000, assets: 400000, debts: 120000 },
  { month: 'Feb', netWorth: 295000, assets: 420000, debts: 125000 },
  { month: 'Mar', netWorth: 310000, assets: 440000, debts: 130000 },
  { month: 'Apr', netWorth: 325000, assets: 460000, debts: 135000 },
  { month: 'May', netWorth: 350000, assets: 500000, debts: 150000 },
  { month: 'Jun', netWorth: 370000, assets: 520000, debts: 150000 }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'asset',
    action: 'add',
    title: 'SIP Top-Up: Nippon Small Cap SIP',
    amount: 5000,
    date: '2026-08-10',
    iconType: 'plus'
  },
  {
    id: 'act-2',
    type: 'debt',
    action: 'payment',
    title: 'Credit Card Payment',
    amount: 5000,
    date: '2026-08-08',
    iconType: 'minus'
  },
  {
    id: 'act-3',
    type: 'asset',
    action: 'add',
    title: 'Invested Gold 1000',
    amount: 1000,
    date: '2026-08-05',
    iconType: 'plus'
  }
];

export const INITIAL_SETTINGS = {
  currency: 'INR', // INR, USD, EUR, GBP
  theme: 'dark', // light, dark
  user: {
    name: 'Alex Morgan',
    email: 'demo@fintrack.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  }
};
