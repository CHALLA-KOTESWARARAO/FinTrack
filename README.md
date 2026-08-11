# FinTrack – Personal Assets, Debt & Net Worth Tracker

> **Track your money. Understand your net worth.**

FinTrack is a polished, production-ready frontend web application focused strictly on tracking personal **Assets**, **Debts/Liabilities**, and overall **Net Worth** progress. Built using **React.js**, **Context API**, **React Router**, **Recharts**, and **Custom CSS3**, FinTrack features complete CRUD operations, real-time calculations, dynamic charts, currency conversions, light/dark themes, and LocalStorage data persistence.

---

## 🌟 Key Features

- **Dashboard Overview**: Dynamic KPI summary cards displaying Total Assets, Total Debt, Net Worth, and Debt-to-Asset Ratio.
- **Interactive Recharts**:
  - **Asset Allocation**: Donut chart grouped by asset class (Stocks, Gold, Mutual Funds, Bank, Cash, FD).
  - **Debt Distribution**: Donut chart visualizing outstanding loan balances.
  - **Net Worth Trend**: Line chart tracking historical net worth progression across months.
- **Assets Portfolio Management**: Full CRUD operations for tracking bank accounts, stocks, mutual funds, real estate, and precious metals. Includes real-time calculation of unrealized Gain/Loss and Gain/Loss %.
- **Debts & Liabilities Tracker**: Track home loans, vehicle loans, credit cards, and personal loans with interest rates and total monthly EMI calculations.
- **Financial Reports & Diagnostics**: Net worth calculation summary equation, ROI performance cards, and qualitative financial health indicator scores.
- **Settings & Customization**:
  - **Currency Switcher**: Seamless conversion between INR (₹), USD ($), EUR (€), and GBP (£).
  - **Theme Engine**: Toggle between Dark Navy and Light Mode with instant CSS variable transitions.
  - **Data Backup & Restore**: Export full JSON backups or restore data from files. Reset to demo data or wipe LocalStorage with confirmation prompts.
- **Demo Mode Access**: Frontend-only authentication modal pre-configured with demo credentials (`demo@fintrack.com` / `123456`).

---

## 🛠️ Technology Stack

- **Framework**: React.js (v19) with Vite
- **Routing**: React Router DOM (v7)
- **State Management**: React Context API (`FinanceContext`)
- **Custom Hooks**: `useFinance`, `useLocalStorage`
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Styling**: Pure CSS3 with CSS Custom Properties & Responsive Media Queries (No Tailwind, Bootstrap, or Material UI)
- **Storage**: Browser LocalStorage

---

## 📁 Project Structure

```text
src/
├── assets/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx           # Header navigation with theme & currency switchers
│   │   ├── Sidebar.jsx          # Mobile-responsive navigation menu drawer
│   │   ├── SummaryCard.jsx      # Metric KPI display card
│   │   ├── ChartCard.jsx        # Recharts container wrapper
│   │   ├── Modal.jsx            # Accessible dialog overlay
│   │   ├── ConfirmDialog.jsx    # Delete confirmation prompt
│   │   ├── Button.jsx           # Reusable button component
│   │   ├── Input.jsx            # Form input with validation text
│   │   ├── Select.jsx           # Custom select dropdown
│   │   ├── SearchBar.jsx        # Search input with icon
│   │   ├── FilterDropdown.jsx   # Filter select control
│   │   ├── DataTable.jsx        # Tabular data display with dynamic columns
│   │   ├── EmptyState.jsx       # Zero-data CTA placeholder
│   │   ├── LoadingSpinner.jsx   # Loading animation
│   │   └── Badge.jsx            # Category & status pills
│   ├── dashboard/
│   │   └── RecentActivity.jsx   # Recent activity feed
│   ├── assets/
│   │   └── AssetModal.jsx       # Add/Edit Asset modal with gain/loss preview
│   └── debts/
│       └── DebtModal.jsx        # Add/Edit Debt modal
├── pages/
│   ├── Login.jsx                # Demo login page
│   ├── Dashboard.jsx            # Main dashboard overview
│   ├── Assets.jsx               # Assets management page
│   ├── Debts.jsx                # Liabilities management page
│   ├── Reports.jsx              # Financial diagnostics & ROI reports
│   └── Settings.jsx             # Theme, currency, profile & backup settings
├── context/
│   └── FinanceContext.jsx       # Global application state & CRUD operations
├── hooks/
│   ├── useFinance.js            # Hook for consuming FinanceContext
│   └── useLocalStorage.js       # Hook for LocalStorage synchronization
├── utils/
│   ├── calculations.js          # Pure financial calculation functions
│   ├── storage.js               # Centralized LocalStorage wrapper
│   └── formatters.js           # Currency, date, and percentage formatters
├── data/
│   └── demoData.js              # Initial realistic dataset fallback
├── styles/
│   ├── variables.css            # Light & Dark theme tokens
│   ├── global.css               # Base resets, typography, cards, forms, tables
│   └── responsive.css           # Mobile & tablet media queries
├── App.jsx                      # Router configuration & protected routes
└── main.jsx                     # Application entry point
```

---

## 💡 React & Engineering Concepts Demonstrated

1. **State Management & Context API**: Global state encapsulation in `FinanceContext` eliminating prop drilling across deep component trees.
2. **Custom React Hooks**: Custom reusable logic encapsulated in `useFinance` for context access and `useLocalStorage` for automatic persistence.
3. **Derived State & Pure Functions**: Financial calculations (Net Worth, Debt-to-Asset Ratio, Gain/Loss %) calculated dynamically from underlying state using `useMemo`.
4. **Form Controls & Validation**: Controlled form inputs with validation error messages, ESC key event listeners, and live calculation previews in modals.
5. **Dynamic Searching & Sorting**: Client-side multi-parameter array filtering (by category, type, search query) and multi-field sorting algorithms (by value, date, name, rate).
6. **Data Visualization**: Recharts integration with custom tooltips, legend formatting, and responsive containers.
7. **CSS Architecture & Design Systems**: Modular CSS variables for dark/light themes, typography tokens, glassmorphism backdrop filters, and media queries.

---

## ⚡ Quick Start & Installation

1. **Clone or Download the Repository**:
   ```bash
   cd FinTrack
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Demo Credentials**:
   - **Email**: `demo@fintrack.com`
   - **Password**: `123456`

---

## 🎤 Technical Resume Q&A (Interview Preparation)

### Q1: Why did you use Context API instead of passing props?
**Answer**: Context API (`FinanceContext`) provides a centralized, global state for assets, debts, settings, and auth. Since summary values like Net Worth and Total Assets are required across multiple pages (Dashboard, Assets, Debts, Reports, Navbar), Context API avoids deep prop drilling and keeps components clean and focused on presentation.

### Q2: How does data persist when the user refreshes the page?
**Answer**: On initial app render, `FinanceContext` reads data from browser `LocalStorage` using the `getItem` storage utility. Whenever state changes (e.g. adding an asset or changing themes), `useEffect` hooks automatically synchronize the updated React state back to LocalStorage via `setItem`. If LocalStorage is empty, it populates initial fallback demo data from `demoData.js`.

### Q3: How are Net Worth and Debt-to-Asset Ratio calculated?
**Answer**: Calculations are performed dynamically using pure functions in `utils/calculations.js`:
- `Net Worth = Total Assets - Total Debt`
- `Debt-to-Asset Ratio = (Total Debt / Total Assets) * 100`
These calculations are wrapped in React `useMemo` hooks inside `FinanceContext` so they re-calculate automatically whenever assets or debts are added, updated, or deleted.

### Q4: How do the Recharts graphs receive their data?
**Answer**: Pure aggregation functions (`getAssetCategoryBreakdown` and `getDebtTypeBreakdown`) group asset and debt items by category/type and sum their current values. The resulting array of `{ name, value }` objects is passed directly to Recharts `Pie` and `Line` components inside `ResponsiveContainer`.

### Q5: How did you implement responsive design without CSS frameworks?
**Answer**: I built a custom responsive CSS system in `variables.css`, `global.css`, and `responsive.css`. Using CSS Grid, Flexbox, CSS Variables, and media queries (`@media (max-width: 900px)`), the layout transitions seamlessly from a Desktop sidebar + grid layout into a mobile drawer menu with touch overlays and vertically stacked cards.

### Q6: How would you convert this into a Full-Stack Web Application?
**Answer**:
1. **Backend**: Build a REST or GraphQL API using Node.js (Express) or Python (Django/FastAPI).
2. **Database**: Replace LocalStorage with a relational database like PostgreSQL (using Prisma or Sequelize ORM) with tables for `Users`, `Assets`, and `Debts`.
3. **Authentication**: Implement JWT authentication or OAuth2 (Google/GitHub sign-in) with password hashing (bcrypt).
4. **API Integration**: Connect frontend state to backend API endpoints using `fetch` or `axios` inside `FinanceContext` async action handlers.
