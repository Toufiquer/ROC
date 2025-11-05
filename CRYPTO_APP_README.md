# Crypto CSV Analyzer App

A comprehensive Next.js 14 application for analyzing cryptocurrency CSV data with powerful charts, statistics, and financial strategy management.

## 🚀 Features

### 📊 Multi-Currency Support
- Import and manage CSV data for multiple cryptocurrencies (BTC, ETH, etc.)
- Automatic parsing and validation of financial data
- Support for M (million), B (billion), and K (thousand) volume formats

### 📈 Time-Based Analysis
- **Daily Summary**: Individual day analysis
- **Weekly Summary**: Aggregated weekly statistics
- **Monthly Summary**: Month-by-month trends
- **Yearly Summary**: Annual performance overview

### 📉 Research Metrics
- Automatic calculation of difference percentage: `((High - Low) / Low) × 100`
- Price trend visualization
- High-Low volatility analysis
- Volume tracking

### 💼 Financial Strategies
- Create and manage trading configurations
- Support for leverage, grid trading, and custom limits
- CRUD operations for financial strategies

### 📱 Mobile-First Design
- Responsive bottom navigation for mobile
- Desktop sidebar navigation
- PWA support for offline access

### 💾 Local Storage
- All data stored locally using Zustand + localStorage
- No backend required
- Data persists between sessions

## 🗂️ Project Structure

```
src/
├── app/
│   └── crypto/
│       ├── layout.tsx           # Crypto app layout
│       ├── page.tsx             # Home page
│       ├── finance/
│       │   └── page.tsx         # Finance CRUD page
│       ├── summary/
│       │   └── page.tsx         # Summary & Charts page
│       └── settings/
│           └── page.tsx         # CSV Upload & Management page
├── components/
│   └── crypto/
│       ├── BottomNav.tsx        # Mobile bottom navigation
│       ├── Sidebar.tsx          # Desktop sidebar
│       ├── CryptoLayout.tsx     # Main layout wrapper
│       ├── DocumentationModal.tsx
│       └── StatsCard.tsx
├── lib/
│   ├── csvParser.ts             # CSV parsing utilities
│   └── dataProcessing.ts        # Data aggregation & statistics
├── store/
│   ├── useCurrencyStore.ts      # Zustand currency store
│   └── useFinanceStore.ts       # Zustand finance store
└── types/
    └── crypto.ts                # TypeScript type definitions
```

## 📝 CSV Format

Your CSV file must include the following columns:

```csv
"Date","Price","Open","High","Low","Vol.","Change %"
"12/31/2021","0.8299","0.8387","0.8535","0.8029","457.62M","-1.04%"
"12/30/2021","0.8387","0.8168","0.8586","0.8042","502.92M","2.72%"
```

### Column Specifications

- **Date**: Format MM/DD/YYYY (e.g., 12/31/2021)
- **Price, Open, High, Low**: Decimal numbers
- **Vol.**: Supports M (million), B (billion), K (thousand)
- **Change %**: Percentage with % sign

## 🎯 Pages Overview

### 🏠 Home (`/crypto`)
- Global statistics dashboard
- Total currencies, entries, and data size
- Quick access to documentation
- List of all imported currencies

### 💰 Finance (`/crypto/finance`)
- Add/Edit/Delete financial strategies
- Configure:
  - Currency
  - Leverage
  - Grid
  - Amount
  - Upper/Lower Limits
- View all strategies in organized cards

### 📊 Summary (`/crypto/summary`)
- Interactive charts:
  - Price trend (Area chart)
  - Difference percentage (Line chart)
  - High-Low range (Bar chart)
- Time period tabs (Daily/Weekly/Monthly/Yearly)
- Date range filters
- Aggregated statistics table

### ⚙️ Settings (`/crypto/settings`)
- Upload CSV files
- Manage currency datasets
- View dataset information
- Data preview
- Delete/Update operations

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with persist middleware
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI (Radix UI)
- **Charts**: Recharts
- **PWA**: next-pwa

## 🚦 Getting Started

1. **Navigate to the crypto app**:
   ```
   http://localhost:3000/crypto
   ```

2. **Upload your first CSV**:
   - Go to Settings page
   - Click "Add Currency"
   - Enter currency name (e.g., BTC)
   - Select your CSV file
   - Click upload

3. **View analysis**:
   - Navigate to Summary page
   - Select your currency
   - Choose time period
   - Explore charts and statistics

4. **Create strategies**:
   - Go to Finance page
   - Click "Add Strategy"
   - Fill in the form
   - Save your configuration

## 📊 Key Calculations

### Difference Percentage
```typescript
differencePercent = ((High - Low) / Low) × 100
```

This metric helps analyze daily volatility and price movement range.

### Volume Parsing
- **M (Million)**: value × 1,000,000
- **B (Billion)**: value × 1,000,000,000
- **K (Thousand)**: value × 1,000

## 💡 Usage Tips

1. **Import Multiple Currencies**: Upload different CSV files for BTC, ETH, etc.
2. **Date Filtering**: Use presets (Last 7 Days, Last Month, etc.) for focused analysis
3. **Time Periods**: Switch between Daily/Weekly/Monthly/Yearly for different insights
4. **Data Backup**: Export your data using browser's localStorage export tools
5. **Sample Data**: Download sample CSV from Settings to see the exact format

## 🔒 Data Privacy

- All data is stored **locally** in your browser
- No data is sent to any server
- Your financial information stays private
- Data persists using localStorage

## 🎨 Responsive Design

- **Mobile (< 768px)**: Bottom navigation with 4 tabs
- **Desktop (≥ 768px)**: Left sidebar with detailed navigation
- **Tablet**: Adaptive layout based on screen size

## 📱 PWA Features

- Install as standalone app
- Offline access
- App-like experience
- Fast loading

## 🧪 Sample Data

Download sample CSV from the Settings page or use this format:

```csv
"Date","Price","Open","High","Low","Vol.","Change %"
"12/31/2021","0.8299","0.8387","0.8535","0.8029","457.62M","-1.04%"
"12/30/2021","0.8387","0.8168","0.8586","0.8042","502.92M","2.72%"
"12/29/2021","0.8165","0.8100","0.8290","0.7980","412.35M","0.80%"
"12/28/2021","0.8100","0.8250","0.8380","0.8050","385.20M","-1.82%"
"12/27/2021","0.8250","0.8180","0.8420","0.8120","455.78M","0.85%"
```

## 🤝 Support

For questions or issues:
1. Check the in-app documentation (Home page → "View Documentation")
2. Verify CSV format matches requirements
3. Clear browser cache if data doesn't persist
4. Check browser console for error messages

## 📄 License

Built with Next.js 14, TypeScript, and modern web technologies.

---

**Happy Analyzing! 📈**
