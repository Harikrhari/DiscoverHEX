# DiscoverHEX — Human Excellence Marketplace

> **Discover the Best Version of Yourself**

DiscoverHEX is a multi-category premium marketplace combining shopping, sponsor-funded products, an influencer/creator marketplace, and a transparent charity component — all in one platform.

---

## What is DiscoverHEX?

| Pillar | Description |
|--------|-------------|
| **Shopping** | Premium-positioned products across 5 categories sourced from trusted global suppliers |
| **Sponsors** | Brands fund products and earn visibility; DiscoverHEX earns margin |
| **Creators** | Influencers promote products and earn commissions via auto-social-posting tools |
| **Charity** | 5–10% of every purchase goes to verified causes with full transparency |
| **Investment** | Public crowdfunding round for community investors |

## Product Categories

- Sports & Fitness
- Health & Wellness
- Outdoor & Adventure
- AI & Smart Gadgets
- Premium Lifestyle

---

## Monorepo Structure

```
DiscoverHEX/
├── docs/                  # Business plan, architecture, investor pitch
│   ├── BUSINESS_PLAN.md
│   ├── TECH_ARCHITECTURE.md
│   └── INVESTOR_PITCH.md
├── web/                   # React 18 + Vite + TailwindCSS web app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level pages
│   │   ├── services/      # Firebase, Stripe, Tax, Social APIs
│   │   ├── store/         # Zustand global state
│   │   └── data/          # Mock data for MVP
│   └── package.json
├── mobile/                # React Native + Expo mobile app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Reusable components
│   │   ├── navigation/    # React Navigation setup
│   │   └── services/      # Firebase, Stripe services
│   └── package.json
├── backend/               # Firebase Functions + Rules
│   ├── functions/src/
│   │   ├── checkout/      # Payment + tax calculation
│   │   ├── social/        # Auto-posting to Instagram/YouTube/Facebook
│   │   ├── charity/       # Fund allocation + transparency
│   │   ├── sponsors/      # Sponsor ROI tracking
│   │   └── creators/      # Creator commission management
│   ├── firestore.rules
│   └── firebase.json
└── README.md
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Web Frontend | React 18 + Vite + TailwindCSS | Fast build, huge ecosystem |
| Mobile | React Native + Expo | Single codebase, iOS + Android |
| State | Zustand | Lightweight, no boilerplate |
| Backend | Firebase Functions (Node 18) | Serverless, scales to zero, low cost |
| Database | Firestore | Real-time, no schema migrations |
| Auth | Firebase Auth | Google/Apple/Email in 10 lines |
| Payments | Stripe | Industry standard, global |
| Tax | TaxJar API | Automatic US tax calculation |
| Social | Meta Graph API + YouTube Data API | Auto-post to IG/FB/YT |
| Hosting | Firebase Hosting (web) + Expo EAS (mobile) | One-command deploy |
| CI/CD | GitHub Actions | Automated test + deploy |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Expo CLI (`npm install -g expo-cli`)
- Stripe account
- TaxJar account
- Meta Developer app (for social posting)

### 1. Clone & Install

```bash
git clone https://github.com/harikrhari/discoverhex.git
cd DiscoverHEX

# Install web dependencies
cd web && npm install

# Install mobile dependencies
cd ../mobile && npm install

# Install backend dependencies
cd ../backend/functions && npm install
```

### 2. Configure Environment

```bash
# Web
cp web/.env.example web/.env.local
# Fill in Firebase, Stripe, TaxJar, Social keys

# Backend
cp backend/functions/.env.example backend/functions/.env
# Fill in Stripe secret, TaxJar, Meta, YouTube keys
```

### 3. Run Locally

```bash
# Web (http://localhost:5173)
cd web && npm run dev

# Mobile (Expo Go app or simulator)
cd mobile && npx expo start

# Firebase emulators (Firestore + Functions)
cd backend && firebase emulators:start
```

### 4. Deploy

```bash
# Deploy Firebase backend
cd backend && firebase deploy

# Deploy web to Firebase Hosting
cd web && npm run build && firebase deploy --only hosting

# Build mobile apps
cd mobile && eas build --platform all
```

---

## Key Features

### Auto Tax Calculation
Every checkout automatically calculates US state/county/city tax via TaxJar API — no manual configuration needed per state.

### Social Media Auto-Posting
When a new product is added or a sales milestone is hit, the platform auto-posts to Instagram, Facebook, and YouTube with AI-generated captions and hashtags to drive viral traffic.

### Charity Transparency
Every transaction automatically allocates 5–10% to active charity campaigns. The Charity page shows real-time fund allocation with receipts — so donors and buyers can see exactly where money goes.

### Sponsor Marketplace
Brands pay to sponsor products and get visibility. DiscoverHEX tracks impressions, clicks, and attributed sales — giving sponsors real ROI data.

### Creator/Influencer Marketplace
Influencers apply, get assigned products, post with their unique links, and earn commissions. Auto-posting tools make it effortless.

### Public Investment Round
Community investors can buy in at $100/$1,000/$10,000 tiers to own a stake in DiscoverHEX's growth — creating viral word-of-mouth from investors who are also customers.

---

## Brand

**Name:** DiscoverHEX  
**HEX stands for:** Human Excellence | High Excellence | High Performance  
**Tagline:** *Discover the Best Version of Yourself*  
**Colors:**
- Primary: `#FF6B35` (energetic orange — action, sports, excitement)
- Secondary: `#1A1A2E` (deep navy — premium, trust, authority)
- Gold: `#F5A623` (sponsor tier, premium products)
- Green: `#27AE60` (charity, growth, sustainability)
- Accent: `#E94560` (CTA, urgency, limited offers)

---

## Read the Docs

- [Business Plan](./docs/BUSINESS_PLAN.md) — Vision, model, projections, investor info
- [Tech Architecture](./docs/TECH_ARCHITECTURE.md) — Full system design, flows, setup guide
- [Investor Pitch](./docs/INVESTOR_PITCH.md) — 10-slide deck outline

---

## License

Proprietary — All rights reserved by DiscoverHEX. Contact for licensing.
