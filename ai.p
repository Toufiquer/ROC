I am building a Next.js 14 App Router project with TypeScript and PWA support.
You will help me create the architecture, UI components, pages, data structure, Zustand stores, parsing utilities, and summary logic.

This app is focused on financial CSV data analysis, especially crypto data such as BTC, ETH, etc.

📌 Input Example (CSV Sample)

Here is a sample CSV format I will import:

"Date","Price","Open","High","Low","Vol.","Change %"
"12/31/2021","0.8299","0.8387","0.8535","0.8029","457.62M","-1.04%"
"12/30/2021","0.8387","0.8168","0.8586","0.8042","502.92M","2.72%"
...


Dates must be parsed to real Date objects.
Prices should be parsed to float numbers.
Volume should support both M (million) and B (billion) conversions.

🎯 Main Purpose of the App

Allow importing CSV data for multiple currencies.

Compute:

Daily summary

Weekly summary

Monthly summary

Yearly summary

Compute research metric:

Difference percentage = ((High - Low) / Low) * 100

UI supports tabs for:

Daily / Weekly / Monthly / Yearly summary toggle

Multiple currencies

All data is stored locally using Zustand + LocalStorage persist.

Fully Mobile Friendly UI with bottom navigation tabs.

📱 Bottom Navigation Layout (Mobile-first)

Persistent navigation with 4 main pages:

Name	Path	Description
Home	/	Overview + Documentation + Data Counts
Finance	/finance	Add/Edit/View/Delete financial strategies
Summary	/summary	Summary tabs for each currency
Settings	/settings	Currency data import + manage CSV uploads
🏠 Home Page (/)

Simple hero/title text explaining the app purpose.

Button: Documentation (modal popup with tutorial)

Show global stats:

Total currencies stored

Total data entries across currencies

Size of dataset in bytes (approx)

💰 Finance Page (/finance)

This page is for user-created financial configurations, NOT from CSV.

Fields:

currency (string)
leverage (number)
grid (number)
amount (number)
upperLimit (number)
lowerLimit (number)


Actions:

Add new item (popup form)

Edit existing

Delete

Display in table

📊 Summary Page (/summary)

Tabs for each currency

Display computed statistical summary:

Total days of data

Start date

End date

Min price

Max price

Average high-low percentage difference

Dropdown to select date range filter

Display difference percentage chart (line chart)

Data source must come from Zustand store.

⚙️ Settings Page (/settings)

Tabs for each currency

Currency card contains:

Upload CSV button

Summary panel:

Total rows

Start date

End date

CSV imports must:

Parse & validate format

Normalize values

Store result in Zustand with persist

🧱 Technical Requirements

Use:

Next.js App Router

TypeScript

Zustand with persist middleware

TailwindCSS for styling

Shadcn UI components (especially Tabs, Modal, Button, Input, Table)

Recharts or ApexCharts for charts

Create:

lib/csvParser.ts → convert CSV to structured data

store/useCurrencyStore.ts → Zustand store with persist

components/ui/BottomNav.tsx → mobile bottom navigation

Page components for:

/page.tsx

/finance/page.tsx

/summary/page.tsx

/settings/page.tsx

Ensure:

Layout is mobile responsive

Desktop layout uses sidebar instead of bottom nav

✅ Final Output Expected

Provide code in full working format, including:

Folder Structure
Layout Component
Bottom Navigation Component
Zustand Store
CSV Parser Utility
Home Page UI
Finance CRUD UI
Summary Chart & Tabs UI
Settings Upload UI


Do NOT shorten code.
Do NOT skip files.
Do NOT return pseudo code.
Return complete implementation in multiple code blocks.