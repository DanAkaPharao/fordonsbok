🚗 Fordonsbok — Digital Servicehistorik
A free, web-based app for digitally documenting and sharing vehicle service history. No app installation required — works directly in any browser on mobile, tablet, and desktop.
Live: digital-servicebok.pages.dev

Features
FeatureDescription📋Vehicle RegisterCars, motorcycles, motorhomes, caravans, boats and more🔧Service HistoryDate, type, mileage, cost, workshop, receipt upload📊StatisticsCost per year (chart), service types, totals📄PDF ExportProfessional document with full history + statistics🔲QR CodePer-vehicle QR linking directly to the service book🔗Share LinkTime-limited (30 days), no login required for recipient🤝Transfer / SalePermanently locks history, transfers to new owner🌍Multi-languageSwedish & English, independent multi-currency support📱Mobile ReadyiOS & Android, built-in camera for receipt photos

Tech Stack
LayerTechnologyFrontendVanilla JS (ES Modules), HTML5, CSS3Database & AuthGoogle Firebase (Firestore + Authentication + Storage)HostingCloudflare Pages (global CDN, automatic HTTPS)ChartsChart.js 4.4QR Generationqrcode.js (client-side)

Project Structure
fordonsbok/
├── index.html              # App shell + all modals
├── script.js               # Main application logic
├── style.css               # Styling & dark theme
├── canvas.js               # Animated background (speedometer)
├── translations.js         # i18n strings (sv / en-GB)
├── currencies.js           # Multi-currency support
├── LanguageCurrencySelector.js  # Language & currency widget
├── vehicleData.js          # Vehicle makes, models & types
├── swish-QR-large.png      # Support QR code
└── _redirects              # Cloudflare Pages routing

Getting Started
No build step required. Clone and open index.html — or deploy the folder directly to Cloudflare Pages.
bashgit clone https://github.com/danakapharao/fordonsbok.git
cd fordonsbok
# Open index.html in browser or deploy to Cloudflare Pages
Firebase config is included in script.js. For your own deployment, replace with your own Firebase project credentials.

Roadmap

 Service reminders (X km or date)
 Sort & search vehicles
 Duplicate service entry
 Co-ownership / shared vehicles
 B2B integrations (Blocket, Bytbil, Wayke)
 Native mobile app


Author
Daniel Forsén — Business Analyst & Master Data expert
danakapharao@gmail.com
Built with Claude by Anthropic 🤖

"Same thing we do every night, Pinky..." 🐭
